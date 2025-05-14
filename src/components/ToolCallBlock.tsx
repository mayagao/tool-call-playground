import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { useEffect } from "react";

interface ToolCallBlockProps {
  toolCall: ToolCall;
  displayMode: ToolCallDisplayMode;
  output?: string;
}

export function ToolCallBlock({
  toolCall,
  displayMode,
  output,
}: ToolCallBlockProps) {
  const isCondensed = displayMode === "condensed";

  useEffect(() => {
    console.log("ToolCallBlock output:", output);
  }, [output]);

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-700">
            {toolCall.function.name}
          </span>
          <span className="text-sm text-gray-500">#{toolCall.index}</span>
        </div>
        <span className="text-xs text-gray-400">{toolCall.id}</span>
      </div>

      {!isCondensed && (
        <>
          <div className="mt-2">
            <div className="text-sm text-gray-600 mb-2">Arguments:</div>
            <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(JSON.parse(toolCall.function.arguments), null, 2)}
            </pre>
          </div>

          {output && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Output:</div>
              <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                {output}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
