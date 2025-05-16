import React from "react";
import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { ToolCallFactory } from "./tool-calls/ToolCallFactory";

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
  return (
    <ToolCallFactory
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
    />
  );
}
