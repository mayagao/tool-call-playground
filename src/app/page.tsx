"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useCompletion } from 'ai/react';
import ReactMarkdown from "react-markdown";
import { DisplayConfig } from "@/components/DisplayConfig";
import {
  ToolCallDisplayConfig,
  GlobalDisplaySettings,
} from "@/types/tool-calls";
import { ToolCallFactory } from "@/components/tool-calls";
import { EndBlockDetector, CondensedEndBlock } from "@/components/endBlocks";
import { ContentRenderer } from "@/components/ui/renderers";
import { useSiteContext } from "@/context/SiteContext";

export default function Home() {
  const [displayConfig, setDisplayConfig] = useState<ToolCallDisplayConfig>({
    str_replace_editor: "condensed",
    get_figma_data: "condensed",
    think: "condensed",
    bash: "condensed",
    create_issue: "expanded",
    report_progress: "condensed",
    endBlocks: "expanded",
  });

  // Get access to the global context
  const { globalSettings, updateGlobalSettings } = useSiteContext();

  // Handler for changing global settings
  const handleGlobalSettingsChange = (newSettings: GlobalDisplaySettings) => {
    updateGlobalSettings(newSettings);
  };

  // Vercel AI SDK hook for streaming completion
  const { completion, complete, error: completionError } = useCompletion({ api: '/api/stream' });

  // State for messages (text + tool calls)
  const [messages, setMessages] = useState<
    Array<{
      type: "text" | "tool-call";
      content: string;
      toolCall?: any;
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
    }>
  >([]);

  // Trigger the stream on component mount
  useEffect(() => {
    complete(''); // Send an empty message to trigger the GET request
  }, [complete]);

  // Process the completion data when it changes
  // useEffect(() => {
  //   if (completion) {
  //     try {
  //       const data = JSON.parse(completion);
  //       // Keep track of text and tool calls
  //       const newMessages: Array<{
  //         type: "text" | "tool-call";
  //         content: string;
  //         toolCall?: any;
  //         output?: string;
  //         modelInfo?: {
  //           name?: string;
  //           usage?: {
  //             completion_tokens?: number;
  //             prompt_tokens?: number;
  //             total_tokens?: number;
  //           };
  //         };
  //         metadata?: Record<string, any>;
  //       }> = [];
  //
  //       // Use an offset to create sequential timestamps
  //       let timeOffset = 0;
  //
  //       // Process each result sequentially to maintain proper ordering
  //       data.results.forEach((result: any) => {
  //         // Extract only the essential model info from the result
  //         const modelInfo = {
  //           name: result.model,
  //           usage: {
  //             completion_tokens: result.usage?.completion_tokens,
  //             prompt_tokens: result.usage?.prompt_tokens,
  //             total_tokens: result.usage?.total_tokens,
  //           },
  //         };
  //
  //         result.choices.forEach((choice: any) => {
  //           const hasToolCalls =
  //             choice.delta.tool_calls && choice.delta.tool_calls.length > 0;
  //           const hasContent = !!choice.delta.content;
  //
  //           // Get additional metadata from the delta with sequential timestamps
  //           const additionalMetadata: Record<string, any> = {
  //             timestamp: new Date(
  //               Date.now() + timeOffset * 1000
  //             ).toISOString(),
  //             finish_reason: choice.finish_reason || null,
  //           };
  //
  //           // Increase time offset for next message
  //           timeOffset += 5;
  //
  //           if (choice.delta.reasoning_text) {
  //             additionalMetadata.reasoning_text = choice.delta.reasoning_text;
  //           }
  //
  //           // If delta contains tool calls, process them with the content from the same choice
  //           if (hasToolCalls) {
  //             choice.delta.tool_calls.forEach((toolCall: any) => {
  //               // Check if this tool call ID is already in our messages
  //               const existingToolCallIndex = newMessages.findIndex(
  //                 (m) =>
  //                   m.type === "tool-call" && m.toolCall?.id === toolCall.id
  //               );
  //
  //               if (existingToolCallIndex === -1) {
  //                 // New tool call - add it with content from the same choice
  //                 newMessages.push({
  //                   type: "tool-call",
  //                   content: "",
  //                   toolCall: toolCall,
  //                   output: choice.delta.content || "", // Content from the same choice
  //                   modelInfo: modelInfo,
  //                   metadata: additionalMetadata,
  //                 });
  //               } else if (
  //                 hasContent &&
  //                 !newMessages[existingToolCallIndex].output
  //               ) {
  //                 // Update existing tool call if it doesn't have output yet
  //                 newMessages[existingToolCallIndex].output =
  //                   choice.delta.content;
  //               }
  //             });
  //           }
  //           // Only add as text if there are no tool calls in this choice
  //           else if (hasContent) {
  //             newMessages.push({
  //               type: "text",
  //               content: choice.delta.content,
  //               modelInfo: modelInfo,
  //               metadata: additionalMetadata,
  //             });
  //           }
  //         });
  //       });
  //       setMessages(newMessages);
  //     } catch (err: any) {
  //       // Handle JSON parsing errors or other processing errors
  //       console.error("Failed to process completion data:", err);
  //       // Optionally set an error state to display to the user
  //     }
  //   }
  // }, [completion]);

  // Memoize the toggle function to avoid recreation on each render
  const handleExpandEndBlock = useCallback(() => {
    // Use functional update for setState to ensure we're working with the latest state
    setDisplayConfig((prev) => ({
      ...prev,
      endBlocks: "expanded",
    }));

    // Force a reflow to ensure immediate visual update
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        // This nested RAF ensures we're after the next paint
        const blocks = document.querySelectorAll(".truncated-content");
        blocks.forEach((block) => {
          // Force recalculation of layout
          block.getBoundingClientRect();
        });
      });
    });
  }, []);

  // Pre-process end blocks for faster rendering
  const processedMessages = useMemo(() => {
    return messages.map((message) => {
      // Add a pre-processed endBlockInfo to each message for faster rendering
      if (
        message.type === "text" &&
        message.metadata?.finish_reason === "stop" &&
        message.content.trim().startsWith("<")
      ) {
        // Check for PR end blocks
        const isPR =
          message.content.includes("<pr_title>") &&
          message.content.includes("</pr_title>");

        if (isPR) {
          const titleMatch = message.content.match(
            /<pr_title>([\s\S]*?)<\/pr_title>/
          );
          const title = titleMatch
            ? titleMatch[1].trim()
            : "PR Title Not Found";

          // Add pre-processed info
          return {
            ...message,
            endBlockInfo: {
              type: "pr",
              title,
              isPR,
            },
          };
        }

        // Generic end block
        return {
          ...message,
          endBlockInfo: {
            type: "generic",
            title: "Special block detected",
            isPR: false,
          },
        };
      }

      return message;
    });
  }, [messages]);

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {completionError && <div className="mb-4 text-red-600 font-mono">{completionError.message}</div>}
        {/* Display raw completion data for debugging */}
        <pre className="text-xs whitespace-pre-wrap p-4 my-4 bg-gray-100 border rounded-md font-mono">
          {completion}
        </pre>
        <div className="space-y-3">
          {processedMessages.map((message, index) => {
            // Find previous tool call's timestamp for time calculation
            let previousToolCallTimestamp: string | undefined;
            if (message.type === "tool-call" && index > 0) {
              // Look backwards to find the previous tool call's timestamp
              for (let i = index - 1; i >= 0; i--) {
                const prevMessage = processedMessages[i];
                if (
                  prevMessage.type === "tool-call" &&
                  prevMessage.metadata &&
                  typeof prevMessage.metadata.timestamp === "string"
                ) {
                  previousToolCallTimestamp = prevMessage.metadata.timestamp;
                  break;
                }
              }
            }

            return (
              <div key={index}>
                {message.type === "text" ? (
                  <div>
                    {/* Check if this is an end block first */}
                    {message.metadata?.finish_reason === "stop" &&
                    message.content.trim().startsWith("<") ? (
                      displayConfig.endBlocks === "expanded" ? (
                        <EndBlockDetector
                          content={message.content}
                          finishReason={message.metadata?.finish_reason}
                        />
                      ) : (
                        <CondensedEndBlock
                          content={message.content}
                          finishReason={message.metadata?.finish_reason}
                          onClick={handleExpandEndBlock}
                        />
                      )
                    ) : (
                      <ContentRenderer
                        content={message.content}
                        contentType="markdown"
                        enableTruncation={false}
                        showMoreEnabled={false}
                      />
                    )}
                  </div>
                ) : (
                  <ToolCallFactory
                    key={message.toolCall.id}
                    toolCall={message.toolCall}
                    displayMode={
                      displayConfig[message.toolCall.function.name] ||
                      "condensed"
                    }
                    output={message.output}
                    modelInfo={message.modelInfo}
                    metadata={message.metadata}
                    previousToolCallTimestamp={previousToolCallTimestamp}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <DisplayConfig
        config={displayConfig}
        onConfigChange={setDisplayConfig}
        globalSettings={globalSettings}
        onGlobalSettingsChange={handleGlobalSettingsChange}
      />
    </main>
  );
}
