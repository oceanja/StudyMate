"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { GenerateContentDialog } from "@/components/generate-content-dialog"
import { Calendar, Clock, BookOpen, Target, TrendingUp, Plus, CheckCircle, AlertCircle, Brain, Zap } from "lucide-react"

export default function DashboardPage() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [showGenerate, setShowGenerate] = useState(false)

  const upcomingTasks = [
    {
      id: 1,
      title: "Complete Math Assignment",
      subject: "Mathematics",
      dueDate: "Today, 11:59 PM",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      title: "Read Chapter 5 - Biology",
      subject: "Biology",
      dueDate: "Tomorrow, 2:00 PM",
      priority: "medium",
      completed: false,
    },
    {
      id: 3,
      title: "History Essay Draft",
      subject: "History",
      dueDate: "Dec 28, 2024",
      priority: "low",
      completed: true,
    },
  ]

  const recentResources = [
    {
      id: 1,
      title: "Calculus Study Guide",
      type: "AI Generated",
      subject: "Mathematics",
      createdAt: "2 hours ago",
    },
    {
      id: 2,
      title: "Biology Flashcards",
      type: "Created",
      subject: "Biology",
      createdAt: "1 day ago",
    },
    {
      id: 3,
      title: "History Timeline",
      type: "Saved",
      subject: "History",
      createdAt: "3 days ago",
    },
  ]

  const studyStats = {
    todayStudyTime: 2.5,
    weeklyGoal: 20,
    weeklyProgress: 12.5,
    streak: 7,
    completedTasks: 15,
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-400 to-blue-400 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Alex! 👋</h1>
        <p className="text-pink-100">You have 2 tasks due today. Let's make it a productive day!</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-700">Today's Study Time</CardTitle>
            <Clock className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{studyStats.todayStudyTime}h</div>
            <p className="text-xs text-pink-500">+20% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Weekly Progress</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{studyStats.weeklyProgress}h</div>
            <Progress value={(studyStats.weeklyProgress / studyStats.weeklyGoal) * 100} className="mt-2" />
            <p className="text-xs text-blue-500 mt-1">{studyStats.weeklyGoal - studyStats.weeklyProgress}h remaining</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Study Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{studyStats.streak} days</div>
            <p className="text-xs text-yellow-500">Keep it up! 🔥</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{studyStats.completedTasks}</div>
            <p className="text-xs text-green-500">This week</p>
          </CardContent>
        </Card>
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
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
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
                    <h4
                      className={`font-medium text-purple-800 ${task.completed ? "line-through text-purple-500" : ""}`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-sm text-purple-600">
                      {task.subject} • {task.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={task.priority === "high" ? "destructive" : "secondary"}
                    className={
                      task.priority === "high"
                        ? "bg-rose-100 text-rose-600 hover:bg-rose-100"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"
                          : "bg-green-100 text-green-600 hover:bg-green-100"
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
            ))}
          </CardContent>
        </Card>

        {/* Recent Resources */}
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
                className="border-blue-300 text-blue-600 hover:bg-blue-100 bg-transparent"
                onClick={() => setShowGenerate(true)}
              >
                <Brain className="h-4 w-4 mr-1" />
                Generate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-3 bg-white/60 border border-blue-200 rounded-lg hover:bg-blue-50/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                    {resource.type === "AI Generated" ? (
                      <Brain className="h-4 w-4 text-blue-600" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">{resource.title}</h4>
                    <p className="text-sm text-blue-600">
                      {resource.subject} • {resource.createdAt}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    resource.type === "AI Generated"
                      ? "bg-purple-100 text-purple-600 hover:bg-purple-100"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-100"
                  }
                >
                  {resource.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-yellow-600">Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/60 border-pink-200 text-pink-600 hover:bg-pink-50"
              onClick={() => setShowGenerate(true)}
            >
              <Brain className="h-6 w-6" />
              <span className="text-sm">Generate Quiz</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/60 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">Create Notes</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/60 border-green-200 text-green-600 hover:bg-green-50"
            >
              <Clock className="h-6 w-6" />
              <span className="text-sm">Start Timer</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/60 border-purple-200 text-purple-600 hover:bg-purple-50"
              onClick={() => setShowAddTask(true)}
            >
              <Target className="h-6 w-6" />
              <span className="text-sm">Set Goal</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
      <GenerateContentDialog open={showGenerate} onOpenChange={setShowGenerate} />
    </div>
  )
}
