"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Settings, Clock, Coffee, TrendingUp } from "lucide-react"

export default function TimerPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [userId, setUserId] = useState<string | null>(null);

  const workDuration = 25 * 60
  const breakDuration = 5 * 60

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        console.error("No user logged in!");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
        setTotalTime((prev) => prev + 1)
      }, 1000)
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setSessions((prev) => prev + 1)
        savePomodoroSession(workDuration / 60)
        setIsBreak(true)
        setTimeLeft(breakDuration)
      } else {
        setIsBreak(false)
        setTimeLeft(workDuration)
      }
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, isBreak, workDuration, breakDuration])

  const savePomodoroSession = async (durationMins: number) => {
    if (!userId) {
      console.error("User ID not available - cannot save session");
      return;
    }

    const roundedDuration = Math.round(durationMins);
    const { error } = await supabase
      .from("pomodoro_sessions")
      .insert([
        {
          user_id: userId,
          session_type: "work",
          duration: roundedDuration,
          created_at: new Date().toISOString()
        }
      ])
    if (error) {
      console.error("Failed to log pomodoro session:", error)
    } else {
      console.log("Pomodoro session saved successfully! Check Supabase.");
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsBreak(false)
    setTimeLeft(workDuration)
  }

  const currentDuration = isBreak ? breakDuration : workDuration
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Focus Timer</h1>
          <p className="text-gray-600">Use the Pomodoro technique to boost your productivity</p>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="text-center">
            <CardHeader>
              <div className="flex items-center justify-center space-x-2 mb-4">
                {isBreak ? (
                  <>
                    <Coffee className="w-6 h-6 text-orange-500" />
                    <Badge className="bg-peach-100 text-peach-600">Break Time</Badge>
                  </>
                ) : (
                  <>
                    <Clock className="w-6 h-6 text-emerald-500" />
                    <Badge className="bg-green-100 text-green-600">Focus Time</Badge>
                  </>
                )}
              </div>
              <CardTitle className="text-6xl font-mono font-bold text-gray-800">{formatTime(timeLeft)}</CardTitle>
              <CardDescription className="text-lg">
                {isBreak ? "Take a break and recharge" : "Stay focused on your task"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progress} className="h-3" />

              <div className="flex items-center justify-center space-x-4">
                <Button
                  size="lg"
                  onClick={() => setIsActive(!isActive)}
                  className={`px-8 ${isActive ? "bg-rose-400 hover:bg-rose-500" : "bg-green-400 hover:bg-green-500"}`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button size="lg" variant="outline" onClick={resetTimer}>
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Sessions completed today: <span className="font-semibold">{sessions}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{Math.floor(totalTime / 60)}m</div>
                <div className="text-sm text-emerald-700">This Session</div>
              </div>
              <div className="text-center p-4 bg-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-500">{sessions}</div>
                <div className="text-sm text-purple-700">Completed</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Work Duration</span>
                <span className="text-sm font-medium">25 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Break Duration</span>
                <span className="text-sm font-medium">5 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Long Break</span>
                <span className="text-sm font-medium">15 min</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent" disabled>
                Customize
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
