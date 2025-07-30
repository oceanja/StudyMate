import { supabase } from "@/lib/supabaseClient";

export async function savePomodoroSession({
  sessionType,
  duration,
}: {
  sessionType: "work" | "break";
  duration: number;
}) {
  const { data, error } = await supabase.from("pomodoro_sessions").insert([
    {
      session_type: sessionType,
      duration,
    },
  ]);

  if (error) {
    console.error("Error saving session:", error.message);
    throw error;
  }

  return data;
}
