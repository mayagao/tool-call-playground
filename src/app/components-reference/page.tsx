"use client";

import { ToolCallBlock } from "@/components/ToolCallBlock";
import { ToolCallDisplayMode } from "@/types/tool-calls";
import { useState, useEffect } from "react";

export default function ComponentsPage() {
  const [toolCalls, setToolCalls] = useState<any[]>([]);

  useEffect(() => {
    // Fetch sample data
    fetch("/data/mock-data.json")
      .then((res) => res.json())
      .then((data) => {
        // Get a sample tool call for each type
        const extractedToolCalls = data.results
          .flatMap((result: any) =>
            result.choices.flatMap(
              (choice: any) => choice.delta.tool_calls || []
            )
          )
          .filter(
            (toolCall: any, index: number, self: any[]) =>
              index ===
              self.findIndex(
                (t: any) => t.function.name === toolCall.function.name
              )
          );

        setToolCalls(extractedToolCalls);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Tool Call Components Reference
        </h1>

        <div className="space-y-8">
          {toolCalls.map((toolCall: any) => (
            <div key={toolCall.id} className="space-y-4">
              <h2 className="text-xl font-semibold">
                {toolCall.function.name}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Condensed Mode</h3>
                  <ToolCallBlock toolCall={toolCall} displayMode="condensed" />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Expanded Mode</h3>
                  <ToolCallBlock toolCall={toolCall} displayMode="expanded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
