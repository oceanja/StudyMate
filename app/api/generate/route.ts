
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "User-Agent": `StudyMate (${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"})`,
  },
});

export async function POST(req: Request) {
  const cookieStore = cookies(); 
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
   
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to generate content." },
        { status: 401 }
      );
    }


    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

   
    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0]?.message?.content || "";

    
    const { error: insertError } = await supabase.from("ai_responses").insert([
      {
        prompt,
        response: aiResponse,
        created_at: new Date().toISOString(),
        user_id: user.id,
      },
    ]);

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to save to database." },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: aiResponse });
  } catch (error: any) {
    console.error("Error generating content:", error);

    return NextResponse.json(
      {
        error:
          error?.code === "insufficient_quota"
            ? "Quota exceeded. Try again later or use a different model."
            : "Failed to generate content.",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
