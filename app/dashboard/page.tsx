"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { GenerateContentDialog } from "@/components/generate-content-dialog"
import {
  Calendar,
  BookOpen,
  Plus,
  CheckCircle,
  AlertCircle,
  Brain
} from "lucide-react"

interface Task {
  id: string
  title: string
  subject: string
  dueDate: string
  priority: "low" | "medium" | "high"
  completed: boolean
}

interface Resource {
  id: string
  prompt: string
  response: string
  created_at: string
}

export default function DashboardPage() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [showGenerate, setShowGenerate] = useState(false)
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [recentResources, setRecentResources] = useState<Resource[]>([])

  useEffect(() => {
    const fetchTasksAndResources = async () => {
      // ✅ Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("completed", false)
        .order("due_date", { ascending: true })
        .limit(3)

      if (tasksError) console.error("Tasks fetch error:", tasksError)
      else setUpcomingTasks(tasksData || [])

      // ✅ Fetch AI responses (resources)
      const { data: resourcesData, error: resourcesError } = await supabase
        .from("ai_responses")
        .select("id, prompt, response, created_at")
        .order("created_at", { ascending: false })
        .limit(3)

      if (resourcesError) console.error("Resources fetch error:", resourcesError)
      else setRecentResources(resourcesData || [])
    }

    fetchTasksAndResources()
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-400 to-blue-400 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Alex! 👋</h1>
        <p className="text-pink-100">You have {upcomingTasks.length} tasks due soon. Let's make it a productive day!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Calendar className="h-5 w-5" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription className="text-purple-600">Your tasks and deadlines</CardDescription>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-400 to-purple-400 text-white"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-purple-600">No tasks found.</p>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-white/60 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.priority === "high"
                          ? "bg-rose-400"
                          : task.priority === "medium"
                            ? "bg-yellow-400"
                            : "bg-green-400"
                      }`}
                    />
                    <div>
                      <h4 className={`font-medium text-purple-800 ${task.completed ? "line-through text-purple-500" : ""}`}>
                        {task.title}
                      </h4>
                      <p className="text-sm text-purple-600">
                        {task.subject} • {new Date(task.dueDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={task.priority === "high" ? "destructive" : "secondary"}
                      className={
                        task.priority === "high"
                          ? "bg-rose-100 text-rose-600"
                          : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                      }
                    >
                      {task.priority}
                    </Badge>
                    {task.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-purple-400" />
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent AI Resources */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <BookOpen className="h-5 w-5" />
                  Recent Resources
                </CardTitle>
                <CardDescription className="text-blue-600">Your latest study materials</CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600"
                onClick={() => setShowGenerate(true)}
              >
                <Brain className="h-4 w-4 mr-1" />
                Generate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
  {recentResources.length === 0 ? (
    <p className="text-sm text-blue-600">No resources found.</p>
  ) : (
    <Accordion type="single" collapsible className="w-full">
      {recentResources.map((resource) => (
        <AccordionItem key={resource.id} value={resource.id}>
          <AccordionTrigger className="flex items-center justify-between p-3 bg-white/60 border border-blue-200 rounded-lg hover:no-underline">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800">{resource.prompt}</h4>
                <p className="text-xs text-blue-400">
                  {new Date(resource.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-600"
            >
              AI
            </Badge>
          </AccordionTrigger>
          <AccordionContent className="p-3 bg-white/80 border border-blue-200 rounded-b-lg">
            <p className="text-sm text-blue-600">{resource.response}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )}
</CardContent>
        </Card>
      </div>

      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
      <GenerateContentDialog open={showGenerate} onOpenChange={setShowGenerate} />
    </div>
  )
}
