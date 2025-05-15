import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { Brain } from "lucide-react";
import { BaseToolCall } from "./BaseToolCall";
import ReactMarkdown from "react-markdown";

interface ThinkToolCallProps {
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
}

export function ThinkToolCall({
  toolCall,
  displayMode,
  output,
  modelInfo,
}: ThinkToolCallProps) {
  const args = JSON.parse(toolCall.function.arguments);
  const thought = args.thought || args.message || "";

  // Generate a title that shows think: + truncated thought
  const title = (
    <div className="flex items-center gap-1">
      <span className="font-medium">think:</span>
      <span className="text-gray-700">
        {thought.substring(0, 50)}
        {thought.length > 50 ? "..." : ""}
      </span>
    </div>
  );
  console.log(thought);
  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      icon={<Brain size={16} className="text-yellow-500" />}
      title={title}
      metadata={args}
      defaultCollapsed={false}
      hideInitialIcon={false}
      modelInfo={modelInfo}
      renderArguments={() => <ReactMarkdown>{thought}</ReactMarkdown>}
    />
  );
}
