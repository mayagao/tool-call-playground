import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { Figma } from "lucide-react";
import { BaseToolCall } from "./BaseToolCall";
import { ReactNode } from "react";

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
  const fileKey = args.fileKey || args.file_key || "05oSlsKrygUk97Nk6PDhCv";
  const fileTitle = args.title || args.name || "Copilot Extensions Dashboard";

  // Generate a title with styled components similar to StrReplaceToolCall
  const title = (
    <div className="flex sentence-case items-center gap-1">
      <span className="text-gray-500">Viewed</span>
      <Figma size={16} className="text-gray-500" />
      <span className="font-medium">{fileTitle}</span>
      <span className="text-gray-500">({fileKey})</span>
    </div>
  );

  // Create icon as ReactNode
  const iconElement: ReactNode = (
    <Figma size={16} className="text-indigo-500" />
  );

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
      icon={undefined}
      hideInitialIcon={true}
      title={title}
      metadata={combinedMetadata}
      defaultCollapsed={false}
      modelInfo={modelInfo}
    />
  );
}
