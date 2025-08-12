"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import type { Task } from "./TaskCard";

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTask: (updatedTask: Task) => void;
}

export function EditTaskDialog({ task, open, onOpenChange, onUpdateTask }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task.priority);
  const [subject, setSubject] = useState(task.category || ""); // Assuming category = subject
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    // Fetch current user for user_id filtering
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user logged in - cannot update task");
      setLoading(false);
      return;  // You can add a toast or UI feedback here
    }

    const updatedData = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      subject: subject.trim() || "General",
      due_date: dueDate || null,
    };

    const { data, error } = await supabase
      .from("tasks")
      .update(updatedData)
      .eq("id", task.id)
      .eq("user_id", user.id)  // Key addition: Filter by user_id for safety
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error("Error updating task:", error.message);
      return;
    }

    if (data) {
      onUpdateTask({
        id: data.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        priority: data.priority,
        category: data.subject, // category = subject
        dueDate: data.due_date,
      });

      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Update your task details.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
