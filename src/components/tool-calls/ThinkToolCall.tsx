import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { Brain } from "lucide-react";
import { BaseToolCall } from "./BaseToolCall";
import { MarkdownRenderer, TruncatedContent } from "../ui/renderers";

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
  previousToolCallTimestamp?: string;
  metadata?: Record<string, any>;
}

export function ThinkToolCall({
  toolCall,
  displayMode,
  output,
  modelInfo,
  previousToolCallTimestamp,
  metadata,
}: ThinkToolCallProps) {
  const args = JSON.parse(toolCall.function.arguments);
  const thought = args.thought || args.message || "";

  // Calculate thinking time in seconds
  let thinkingTime = 0;

  if (previousToolCallTimestamp && metadata?.timestamp) {
    const currentTime = new Date(metadata.timestamp).getTime();
    const prevTime = new Date(previousToolCallTimestamp).getTime();
    thinkingTime = Math.round((currentTime - prevTime) / 1000);

    console.log("ThinkToolCall timing:", {
      currentTimestamp: metadata.timestamp,
      previousTimestamp: previousToolCallTimestamp,
      calculatedSeconds: thinkingTime,
    });
  }

  // Format the title with thinking time
  const thinkingTimeText =
    thinkingTime > 0
      ? `for ${thinkingTime}${thinkingTime !== 1 ? "s" : ""}`
      : "";

  // Generate a title that shows thought timing + truncated thought
  const title = (
    <div className="flex items-center gap-1">
      <span className="text-gray-500">Thought {thinkingTimeText}</span>
      <Brain size={16} className="text-gray-500" />
      <span className="text-gray-700 grow truncate">
        {thought.substring(0, 80)}
        {thought.length > 80 ? "..." : ""}
      </span>
    </div>
  );

  // Custom renderer for the arguments (the thought)
  const renderArguments = (args: Record<string, any>) => {
    const thoughtContent = args.thought || args.message || "";
    return (
      <div className="px-3">
        <TruncatedContent>
          <MarkdownRenderer content={thoughtContent} />
        </TruncatedContent>
      </div>
    );
  };

  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      icon={<Brain size={16} className="text-gray-500" />}
      title={title}
      metadata={{
        ...args,
        thinkingTimeSeconds: thinkingTime,
        ...(metadata || {}),
      }}
      hideInitialIcon={true}
      modelInfo={modelInfo}
      renderArguments={renderArguments}
    />
  );
}
