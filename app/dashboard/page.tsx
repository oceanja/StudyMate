"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Calendar,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Brain
} from "lucide-react"

interface Task {
  id: string
  title: string
  subject: string
  dueDate: string | null  
  priority: "low" | "medium" | "high"
  completed: boolean
}

interface Resource {
  id: string
  prompt: string
  response: string
  created_at: string | null  
}


function formatDateString(dateStr?: string | null) {
  if (!dateStr) return "No due date";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "No due date" : d.toLocaleString();  
}

export default function DashboardPage() {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [recentResources, setRecentResources] = useState<Resource[]>([])
  const [userName, setUserName] = useState("User")
  const [currentUser, setCurrentUser] = useState<any>(null)  

  useEffect(() => {
    const fetchData = async () => {
    
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUser(user)
        setUserName(user.user_metadata?.name || user.email?.split("@")[0] || "User")
      } else {
        console.error("No user logged in - redirecting or showing login prompt")
        return
      }

      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)  
        .eq("completed", false)
        .order("due_date", { ascending: true })
        .limit(3)

      if (tasksError) console.error("Tasks fetch error:", tasksError)
      else {
        const mappedTasks = (tasksData || []).map((t: any) => ({
          ...t,
          dueDate: t.due_date  
        })) as Task[]
        setUpcomingTasks(mappedTasks)
      }

 
      const { data: resourcesData, error: resourcesError } = await supabase
        .from("ai_responses")
        .select("id, prompt, response, created_at")
        .eq("user_id", user.id)  
        .order("created_at", { ascending: false })
        .limit(3)

      if (resourcesError) console.error("Resources fetch error:", resourcesError)
      else setRecentResources(resourcesData || [])
    }

    fetchData()


    let tasksSubscription: any
    let resourcesSubscription: any

    if (currentUser) {
      tasksSubscription = supabase
        .channel("tasks-channel")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "tasks", filter: `user_id=eq.${currentUser.id}` },
          (payload) => {
            const newTaskRaw = payload.new as any
            const newTask = {
              ...newTaskRaw,
              dueDate: newTaskRaw.due_date 
            } as Task
            if (!newTask.completed) {
              setUpcomingTasks((prev) => {
                const updated = [newTask, ...prev].sort((a, b) => {
                  const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
                  const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
                  return dateA - dateB
                }).slice(0, 3)
                return updated
              })
            }
          }
        )
        .subscribe()

      resourcesSubscription = supabase
        .channel("resources-channel")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "ai_responses", filter: `user_id=eq.${currentUser.id}` },
          (payload) => {
            const newResource = payload.new as Resource
            setRecentResources((prev) => {
              const updated = [newResource, ...prev].slice(0, 3)
              return updated
            })
          }
        )
        .subscribe()
    }
    return () => {
      if (tasksSubscription) supabase.removeChannel(tasksSubscription)
      if (resourcesSubscription) supabase.removeChannel(resourcesSubscription)
    }
  }, [currentUser])  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-400 to-blue-400 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
        <p className="text-pink-100">You have {upcomingTasks.length} tasks due soon. Let's make it a productive day!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Calendar className="h-5 w-5" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription className="text-purple-600">Your tasks and deadlines</CardDescription>
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
                        {task.subject} • {formatDateString(task.dueDate)}  {/* Safe formatting here */}
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
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <BookOpen className="h-5 w-5" />
                Recent Resources
              </CardTitle>
              <CardDescription className="text-blue-600">Your latest study materials</CardDescription>
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
                            {formatDateString(resource.created_at)}  {/* Safe formatting here */}
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
    </div>
  )
}
