"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskCard, type Task } from "./components/TaskCard";
import { AddTaskDialog } from "./components/AddTaskDialog";
import { TaskStats } from "./components/TaskStats";
import { TaskFilters, type FilterState } from "./components/TaskFilters";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient"; 

const Page = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    priority: "all",
    status: "all",
    subject: "",
  });
  const { toast } = useToast();

  const categories = Array.from(new Set(tasks.map((task) => task.category)));

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({ title: "Failed to fetch tasks", description: error.message, variant: "destructive" });
      } else {
        setTasks(data || []);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "completed" && task.completed) ||
      (filters.status === "pending" && !task.completed);
    const matchesCategory =
      !filters.subject ||
      filters.subject === "all" ||
      task.category === filters.subject;

    return (
      matchesSearch && matchesPriority && matchesStatus && matchesCategory
    );
  });

  const handleAddTask = async (newTask: Omit<Task, "id">) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...newTask })
      .select()
      .single();

    if (error) {
      toast({ title: "Failed to add task", description: error.message, variant: "destructive" });
      return;
    }

    setTasks((prev) => [data, ...prev]);
    toast({
      title: "Task added successfully!",
      description: `"${data.title}" has been added to your list.`,
    });
  };

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updated = { ...task, completed: !task.completed };

    const { error } = await supabase
      .from("tasks")
      .update({ completed: updated.completed })
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to update task", description: error.message, variant: "destructive" });
      return;
    }

    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

    toast({
      title: updated.completed ? "Task completed!" : "Task marked as pending",
      description: `"${task.title}" ${updated.completed ? "has been completed" : "is now pending"}.`,
    });
  };

  const handleEditTask = (id: string) => {
    toast({
      title: "Edit functionality",
      description: "Edit dialog would open here in a full implementation.",
    });
  };

  const handleDeleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      toast({ title: "Failed to delete task", description: error.message, variant: "destructive" });
      return;
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));

    toast({
      title: "Task deleted",
      description: `"${task.title}" has been removed from your list.`,
      variant: "destructive",
    });
  };

  const handleCompleteAll = async () => {
    const pendingTasks = tasks.filter((task) => !task.completed);
    if (pendingTasks.length === 0) return;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: true })
      .in("id", pendingTasks.map((t) => t.id));

    if (!error) {
      setTasks((prev) => prev.map((t) => ({ ...t, completed: true })));
      toast({
        title: "All tasks completed!",
        description: `Marked ${pendingTasks.length} tasks as completed.`,
      });
    }
  };

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter((task) => task.completed);
    if (completedTasks.length === 0) return;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .in("id", completedTasks.map((t) => t.id));

    if (!error) {
      setTasks((prev) => prev.filter((t) => !t.completed));
      toast({
        title: "Completed tasks cleared",
        description: `Removed ${completedTasks.length} completed tasks.`,
      });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Task Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Organize your work and life, one task at a time
          </p>
        </div>
        <AddTaskDialog onAddTask={handleAddTask} />
      </div>

      <TaskStats tasks={tasks} />

      <Card className="p-4">
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          subjects={categories}
        />
      </Card>

      <div className="flex flex-wrap gap-4 justify-end">
        <Button variant="secondary" onClick={handleCompleteAll}>
          Complete All
        </Button>
        <Button variant="destructive" onClick={handleClearCompleted}>
          Clear Completed
        </Button>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="p-6 text-center space-y-2">
            <RotateCcw className="mx-auto h-6 w-6 text-gray-500" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {tasks.length === 0
                ? "Get started by adding your first task!"
                : "Try adjusting your filters to see more tasks."}
            </p>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>

      <div className="text-sm text-center text-gray-500 dark:text-gray-400 pt-4">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>
    </div>
  );
};

export default Page;
