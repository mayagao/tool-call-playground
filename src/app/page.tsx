"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ToolCallBlock } from "@/components/ToolCallBlock";
import { DisplayConfig } from "@/components/DisplayConfig";
import { ToolCallDisplayConfig } from "@/types/tool-calls";
export default function Home() {
  const [displayConfig, setDisplayConfig] = useState<ToolCallDisplayConfig>({
    str_replace_editor: "expanded",
    get_figma_data: "condensed",
    think: "expanded",
    bash: "condensed",
    create_issue: "expanded",
    report_progress: "expanded",
  });

  // State for parsed tool calls
  const [toolCalls, setToolCalls] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State for messages (text + tool calls)
  const [messages, setMessages] = useState<
    Array<{
      type: "text" | "tool-call";
      content: string;
      toolCall?: any;
      output?: string;
    }>
  >([]);

  // Load mock-data.json by default
  useEffect(() => {
    fetch("/data/mock-data.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load file: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        try {
          // Keep track of text and tool calls
          const messages: Array<{
            type: "text" | "tool-call";
            content: string;
            toolCall?: any;
            output?: string;
          }> = [];

          // Process each result sequentially to maintain proper ordering
          data.results.forEach((result: any) => {
            result.choices.forEach((choice: any) => {
              const hasToolCalls =
                choice.delta.tool_calls && choice.delta.tool_calls.length > 0;
              const hasContent = !!choice.delta.content;

              // If delta contains tool calls, process them with the content from the same choice
              if (hasToolCalls) {
                choice.delta.tool_calls.forEach((toolCall: any) => {
                  // Check if this tool call ID is already in our messages
                  const existingToolCallIndex = messages.findIndex(
                    (m) =>
                      m.type === "tool-call" && m.toolCall?.id === toolCall.id
                  );

                  if (existingToolCallIndex === -1) {
                    // New tool call - add it with content from the same choice
                    messages.push({
                      type: "tool-call",
                      content: "",
                      toolCall: toolCall,
                      output: choice.delta.content || "", // Content from the same choice
                    });
                  } else if (
                    hasContent &&
                    !messages[existingToolCallIndex].output
                  ) {
                    // Update existing tool call if it doesn't have output yet
                    messages[existingToolCallIndex].output =
                      choice.delta.content;
                  }
                });
              }
              // Only add as text if there are no tool calls in this choice
              else if (hasContent) {
                messages.push({
                  type: "text",
                  content: choice.delta.content,
                });
              }
            });
          });

          // Extract just the tool calls for the existing component
          const uniqueToolCalls = messages
            .filter((m) => m.type === "tool-call")
            .map((m) => m.toolCall);

          setToolCalls(uniqueToolCalls);
          setMessages(messages);
        } catch (err: any) {
          setError(err.message || "Failed to process JSON data.");
        }
      })
      .catch((err) => setError(err.message || "Failed to load mock-data.json"));
  }, []);

  // Handle file upload and parsing
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    try {
      const text = await file.text();

      if (file.name.endsWith(".json")) {
        const data = JSON.parse(text);

        // Keep track of text and tool calls
        const messages: Array<{
          type: "text" | "tool-call";
          content: string;
          toolCall?: any;
          output?: string;
        }> = [];

        // Process each result sequentially
        data.results.forEach((result: any) => {
          result.choices.forEach((choice: any) => {
            const hasToolCalls =
              choice.delta.tool_calls && choice.delta.tool_calls.length > 0;
            const hasContent = !!choice.delta.content;

            // If delta contains tool calls, process them with the content from the same choice
            if (hasToolCalls) {
              choice.delta.tool_calls.forEach((toolCall: any) => {
                // Check if this tool call ID is already in our messages
                const existingToolCallIndex = messages.findIndex(
                  (m) =>
                    m.type === "tool-call" && m.toolCall?.id === toolCall.id
                );

                if (existingToolCallIndex === -1) {
                  // New tool call - add it with content from the same choice
                  messages.push({
                    type: "tool-call",
                    content: "",
                    toolCall: toolCall,
                    output: choice.delta.content || "", // Content from the same choice
                  });
                } else if (
                  hasContent &&
                  !messages[existingToolCallIndex].output
                ) {
                  // Update existing tool call if it doesn't have output yet
                  messages[existingToolCallIndex].output = choice.delta.content;
                }
              });
            }
            // Only add as text if there are no tool calls in this choice
            else if (hasContent) {
              messages.push({
                type: "text",
                content: choice.delta.content,
              });
            }
          });
        });

        // Extract just the tool calls
        const uniqueToolCalls = messages
          .filter((m) => m.type === "tool-call")
          .map((m) => m.toolCall);

        setToolCalls(uniqueToolCalls);
        setMessages(messages);
      } else {
        setError(
          "This app only supports JSON files. Please upload a .json file."
        );
        setToolCalls([]);
        setMessages([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to parse file.");
      setToolCalls([]);
      setMessages([]);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tool Calls Playground</h1>

        {error && <div className="mb-4 text-red-600 font-mono">{error}</div>}
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div key={index}>
              {message.type === "text" ? (
                <div className="prose prose-slate max-w-none mb-4">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <ToolCallBlock
                  key={message.toolCall.id}
                  toolCall={message.toolCall}
                  displayMode={
                    displayConfig[message.toolCall.function.name] || "condensed"
                  }
                  output={message.output}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <DisplayConfig
        config={displayConfig}
        onConfigChange={setDisplayConfig}
        onFileUpload={handleFileUpload}
      />
    </main>
  );
}
