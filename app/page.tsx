import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Calendar, Clock, Target, Users, Zap, ArrowRight, Star, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-blue-400 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              StudyMate
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-pink-100 text-pink-600 hover:bg-pink-100 text-sm sm:text-base">
            ✨ AI-Powered Study Assistant
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Master Your Studies with
            <br className="hidden sm:block" />
            Smart AI Assistance
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your learning experience with personalized study plans, AI-generated content, and powerful
            productivity tools designed for modern students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-base sm:text-lg px-6 sm:px-8"
              >
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>50K+ Students</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-pink-400 mr-1" />
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive study tools powered by AI to help you learn faster and retain more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-pink-500" />
                </div>
                <CardTitle>AI Study Assistant</CardTitle>
                <CardDescription>
                  Get personalized study recommendations and AI-generated content tailored to your learning style.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle>Smart Scheduling</CardTitle>
                <CardDescription>
                  Intelligent task management with deadline tracking and automated study session planning.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-rose-500" />
                </div>
                <CardTitle>Focus Timer</CardTitle>
                <CardDescription>
                  Pomodoro technique with customizable intervals to maximize your concentration and productivity.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-r from-pink-400 to-blue-400">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to Transform Your Study Experience?</h2>
          <p className="text-base sm:text-xl text-emerald-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already studying smarter, not harder.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-50 text-base sm:text-lg px-6 sm:px-8">
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-blue-400 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold">StudyMate</span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">© 2025 StudyMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
