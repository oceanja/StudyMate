"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type HistoryItem = {
  id: number;
  prompt: string;
  response: string;
  created_at: string;
};

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("ai_responses") // replace with your actual table name
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setHistory(data as HistoryItem[]);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Previous Prompts</h2>
      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="p-4 border rounded bg-gray-100">
              <p>
                <strong>Prompt:</strong> {item.prompt}
              </p>
              <p>
                <strong>Response:</strong> {item.response}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
