"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import {
  Download,
  Pencil,
  Trash,
  Upload,
  Zap,
  MoreVertical,
  Brain,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import jsPDF from "jspdf"

interface Resource {
  id: string
  prompt: string
  response: string
  created_at: string
}

export default function Page() {
  const [resources, setResources] = useState<Resource[]>([])
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from("ai_responses")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) console.error("Error fetching:", error)
      else setResources(data)
    }

    fetchResources()
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) return alert("Please enter a topic first.")
    setLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error("Failed to generate")

      const data = await response.json()

      const { data: saved, error: saveError } = await supabase
        .from("ai_responses")
        .insert([{ prompt: prompt, response: data.content }])
        .select()

      if (saveError) throw saveError

      setResources((prev) => [...saved, ...prev])
      setPrompt("")
    } catch (err) {
      alert("Something went wrong while generating.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("ai_responses").delete().eq("id", id)
    if (error) {
      alert("Error deleting resource.")
      console.error(error)
    } else {
      setResources((prev) => prev.filter((res) => res.id !== id))
    }
  }

  const handleDownloadPDF = (resource: Resource) => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text(`Prompt: ${resource.prompt}`, 10, 10)
    doc.setFontSize(12)
    const lines = doc.splitTextToSize(resource.response, 180)
    doc.text(lines, 10, 20)
    doc.save(`${resource.prompt}.pdf`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Generated Resources</h1>
        <div className="space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500"
          >
            <Zap className="w-4 h-4 mr-2" />
            {loading ? "Generating..." : "Generate with AI"}
          </Button>
        </div>
      </div>

      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a topic to generate resource (e.g., Photosynthesis)"
        className="w-full max-w-xl"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-purple-100 text-purple-500">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-semibold">{resource.prompt}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(resource.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
              {resource.response}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadPDF(resource)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 border-red-500"
                  onClick={() => handleDelete(resource.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <Button size="icon" variant="ghost">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
