import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import {
  FigmaToolCall,
  ThinkToolCall,
  BashToolCall,
  BaseToolCall,
  StrReplaceToolCall,
  CreateIssueToolCall,
  ReportProgressToolCall,
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
  argsMaxHeight?: number;
  outputMaxHeight?: number;
  contentMaxHeight?: number;
  descriptionMaxHeight?: number;
}

export function ToolCallFactory({
  toolCall,
  displayMode,
  output,
  modelInfo,
  metadata,
  previousToolCallTimestamp,
  argsMaxHeight = 200,
  outputMaxHeight = 200,
  contentMaxHeight = 250,
  descriptionMaxHeight = 200,
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

  if (
    functionName.includes("createissue") ||
    functionName.includes("create_issue") ||
    functionName.includes("issue")
  ) {
    return (
      <CreateIssueToolCall
        toolCall={toolCall}
        displayMode={displayMode}
        output={output}
        modelInfo={modelInfo}
        metadata={metadata}
        descriptionMaxHeight={descriptionMaxHeight}
      />
    );
  }

  if (
    functionName.includes("report_progress") ||
    functionName.includes("reportprogress") ||
    functionName.includes("progress")
  ) {
    return (
      <ReportProgressToolCall
        toolCall={toolCall}
        displayMode={displayMode}
        output={output}
        modelInfo={modelInfo}
        metadata={metadata}
        contentMaxHeight={contentMaxHeight}
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
      modelInfo={modelInfo}
      argsMaxHeight={argsMaxHeight}
      outputMaxHeight={outputMaxHeight}
    />
  );
}
