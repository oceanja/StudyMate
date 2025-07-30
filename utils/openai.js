// utils/openai.js
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Must match your .env key name
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Change this to your deployed domain later
    "User-Agent": "StudyMate (http://localhost:3000)", // Required by OpenRouter
  },
  dangerouslyAllowBrowser: true,
});

export async function getOpenAIResponse(prompt) {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-3.5-turbo", // Must include prefix for OpenRouter
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}
