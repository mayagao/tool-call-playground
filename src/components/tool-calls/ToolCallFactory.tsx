import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import {
  FigmaToolCall,
  ThinkToolCall,
  BashToolCall,
  BaseToolCall,
  StrReplaceToolCall,
} from "./index";
import { FileText } from "lucide-react";

interface ToolCallFactoryProps {
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
  previousToolCallTimestamp?: string;
}

export function ToolCallFactory({
  toolCall,
  displayMode,
  output,
  modelInfo,
  metadata,
  previousToolCallTimestamp,
}: ToolCallFactoryProps) {
  // Determine which component to use based on the function name or type
  const functionName = toolCall.function.name.toLowerCase();

  // Match to specific tool call types
  if (functionName.includes("figma") || functionName.includes("design")) {
    return (
      <FigmaToolCall
        toolCall={toolCall}
        displayMode={displayMode}
        output={output}
        modelInfo={modelInfo}
        metadata={metadata}
      />
    );
  }

  if (
    functionName.includes("think") ||
    functionName.includes("reason") ||
    functionName.includes("analyze")
  ) {
    return (
      <ThinkToolCall
        toolCall={toolCall}
        displayMode={displayMode}
        output={output}
        modelInfo={modelInfo}
        metadata={metadata}
        previousToolCallTimestamp={previousToolCallTimestamp}
      />
    );
  }

  if (
    functionName.includes("bash") ||
    functionName.includes("terminal") ||
    functionName.includes("shell") ||
    functionName.includes("command")
  ) {
    return (
      <BashToolCall
        toolCall={toolCall}
        displayMode={displayMode}
        output={output}
        modelInfo={modelInfo}
        metadata={metadata}
      />
    );
  }
  if (functionName.includes("str_replace")) {
    return (
      <StrReplaceToolCall
        toolCall={toolCall}
        displayMode={displayMode}
        output={output}
      />
    );
  }

  // Default case: use a generic tool call with function name as title
  const args = JSON.parse(toolCall.function.arguments);
  const title = `${toolCall.function.name}`;

  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      icon={<FileText size={16} className="text-blue-500" />}
      title={title}
      metadata={args}
      defaultCollapsed={false}
      modelInfo={modelInfo}
    />
  );
}
