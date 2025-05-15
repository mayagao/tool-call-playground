import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { Terminal } from "lucide-react";
import { BaseToolCall } from "./BaseToolCall";

interface BashToolCallProps {
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

export function BashToolCall({
  toolCall,
  displayMode,
  output,
  modelInfo,
  metadata,
}: BashToolCallProps) {
  // Parse the arguments to extract information for the title
  const args = JSON.parse(toolCall.function.arguments);
  const command = args.command || args.cmd || "Unknown command";

  // Generate a title that shows the bash command
  const title = `Bash: ${command.substring(0, 50)}${
    command.length > 50 ? "..." : ""
  }`;

  // Metadata to display in the popover
  const combinedMetadata = {
    ...args,
    functionName: toolCall.function.name,
    timestamp: new Date().toISOString(),
    workingDirectory: args.cwd || args.workingDirectory || "unknown",
    ...(metadata || {}),
  };

  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      icon={<Terminal size={16} className="text-green-500" />}
      title={title}
      metadata={combinedMetadata}
      defaultCollapsed={false}
      modelInfo={modelInfo}
    />
  );
}
