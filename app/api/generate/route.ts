import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabaseClient"; // make sure this path is correct

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // change in prod
    "User-Agent": "StudyMate (http://localhost:3000)", // change in prod
  },
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("Received prompt:", prompt);

    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;
    console.log("OpenRouter response:", aiResponse);

    // Save to Supabase
    const { error } = await supabase.from("ai_responses").insert([
      {
        prompt,
        response: aiResponse,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save to database." }, { status: 500 });
    }

    return NextResponse.json({ title: aiResponse });
  } catch (error: any) {
    console.error("Error generating content:", error);

    const errMsg =
      error?.code === "insufficient_quota"
        ? "Quota exceeded. Try again later or use a different model."
        : "Failed to generate content.";

    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
