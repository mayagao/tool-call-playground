import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { Figma } from "lucide-react";
import { BaseToolCall } from "./BaseToolCall";

interface FigmaToolCallProps {
  toolCall: ToolCall;
  displayMode: ToolCallDisplayMode;
  output?: string;
  modelInfo?: {
    name?: string;
    usage?: {
      completion_tokens?: number;
      prompt_tokens?: number;
      total_tokens?: number;
    };
  };
  metadata?: Record<string, any>;
}

export function FigmaToolCall({
  toolCall,
  displayMode,
  output,
  modelInfo,
  metadata,
}: FigmaToolCallProps) {
  // Parse the arguments to extract information for the title
  const args = JSON.parse(toolCall.function.arguments);
  const fileId = args.fileId || args.file_id || "Unknown file";

  // Generate a title based on the arguments
  const title = `Figma: ${fileId}`;

  // Metadata to display in the popover
  const combinedMetadata = {
    ...args,
    functionName: toolCall.function.name,
    timestamp: new Date().toISOString(),
    ...(metadata || {}),
  };

  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      icon={<Figma size={16} className="text-indigo-500" />}
      title={title}
      metadata={combinedMetadata}
      defaultCollapsed={false}
      modelInfo={modelInfo}
    />
  );
}
