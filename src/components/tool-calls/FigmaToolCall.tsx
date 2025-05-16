import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { Figma } from "lucide-react";
import { BaseToolCall } from "./BaseToolCall";
import { ReactNode } from "react";
import { TruncatedContent } from "../ui/renderers";

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
      <span className="">{fileTitle}</span>
      <span className="text-gray-500 text-xs">({fileKey})</span>
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

  // Custom renderer for the arguments
  const renderArguments = (args: Record<string, any>) => (
    <div className="text-sm text-gray-700 py-2.5 px-3">
      <div>fileKey: {fileKey}</div>
      {args.description && (
        <div className="mt-2">
          <div className="font-medium mb-1">Description:</div>
          <div>{args.description}</div>
        </div>
      )}
    </div>
  );

  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      title={title}
      metadata={metadata}
      hideInitialIcon={true}
      modelInfo={modelInfo}
      renderArguments={renderArguments}
    />
  );
}
