"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, FileText, HelpCircle, BookOpen, Zap, Loader2 } from "lucide-react"

interface GenerateContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GenerateContentDialog({ open, onOpenChange }: GenerateContentDialogProps) {
  const [selectedType, setSelectedType] = useState("")
  const [formData, setFormData] = useState({
    topic: "",
    subject: "",
    details: "",
    difficulty: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const contentTypes = [
    {
      id: "quiz",
      title: "Quiz Questions",
      description: "Generate practice questions and answers",
      icon: HelpCircle,
      color: "from-pink-400 to-rose-400",
    },
    {
      id: "notes",
      title: "Study Notes",
      description: "Create comprehensive study notes",
      icon: FileText,
      color: "from-blue-400 to-cyan-400",
    },
    {
      id: "flashcards",
      title: "Flashcards",
      description: "Generate flashcards for memorization",
      icon: BookOpen,
      color: "from-purple-400 to-pink-400",
    },
    {
      id: "summary",
      title: "Topic Summary",
      description: "Get a concise overview of any topic",
      icon: Brain,
      color: "from-green-400 to-emerald-400",
    },
  ]

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      onOpenChange(false)

      // Reset form
      setFormData({
        topic: "",
        subject: "",
        details: "",
        difficulty: "",
      })
      setSelectedType("")

      alert(`${contentTypes.find((t) => t.id === selectedType)?.title} generated successfully!`)
    }, 3000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-purple-50 to-pink-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-700">
            <Brain className="w-5 h-5" />
            Generate AI Content
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            Use AI to create study materials tailored to your needs.
          </DialogDescription>
        </DialogHeader>

        {!selectedType ? (
          <div className="space-y-4">
            <Label className="text-purple-700 text-base font-medium">Choose Content Type</Label>
            <div className="grid grid-cols-2 gap-4">
              {contentTypes.map((type) => (
                <Card
                  key={type.id}
                  className="cursor-pointer hover:shadow-lg transition-all border-purple-200 hover:border-purple-300"
                  onClick={() => setSelectedType(type.id)}
                >
                  <CardHeader className="pb-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mb-2`}
                    >
                      {type.icon && <type.icon className="w-5 h-5 text-white" />}
                    </div>
                    <CardTitle className="text-sm text-purple-800">{type.title}</CardTitle>
                    <CardDescription className="text-xs text-purple-600">{type.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-r ${contentTypes.find((t) => t.id === selectedType)?.color} flex items-center justify-center`}
                >
                  {(() => {
                    const selectedContentType = contentTypes.find((t) => t.id === selectedType)
                    const IconComponent = selectedContentType?.icon
                    return IconComponent ? <IconComponent className="w-4 h-4 text-white" /> : null
                  })()}
                </div>
                <span className="font-medium text-purple-700">
                  {contentTypes.find((t) => t.id === selectedType)?.title}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedType("")}
                className="text-purple-600 hover:bg-purple-100"
              >
                Change Type
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic" className="text-purple-700">
                Topic
              </Label>
              <Input
                id="topic"
                placeholder="Enter the topic you want to study..."
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="border-purple-200 focus:border-purple-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-purple-700">Subject</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-purple-700">Difficulty Level</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details" className="text-purple-700">
                Additional Details (Optional)
              </Label>
              <Textarea
                id="details"
                placeholder="Add any specific requirements or focus areas..."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="border-purple-200 focus:border-purple-400"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
