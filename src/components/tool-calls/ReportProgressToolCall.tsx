import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { BaseToolCall } from "./BaseToolCall";
import { CheckCircleIcon, ChecklistIcon } from "@primer/octicons-react";
import React, { ReactElement } from "react";

interface ReportProgressToolCallProps {
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

export function ReportProgressToolCall({
  toolCall,
  displayMode,
  output,
  modelInfo,
  metadata,
}: ReportProgressToolCallProps) {
  // Parse the arguments to extract information for the progress items
  const args = JSON.parse(toolCall.function.arguments);
  const commitMessage = args.commitMessage || "Progress Report";

  // Extract the PR description which contains the progress steps
  // The format is expected to be Markdown checkboxes (- [x] Step description)
  const prDescription = args.prDescription || "";

  // Custom renderer for the arguments
  const renderArguments = (args: Record<string, any>) => {
    const lines = prDescription.split("\n");

    // Function to determine the indentation level based on leading spaces
    const getIndentationLevel = (line: string): number => {
      const leadingSpaces = line.match(/^(\s*)/)?.[1].length || 0;
      return Math.floor(leadingSpaces / 2);
    };

    // Recursive function to render nested lists
    const renderNestedList = (
      currentLines: string[],
      currentIndex: number = 0,
      baseIndentation: number = 0
    ): [ReactElement[], number] => {
      const items: ReactElement[] = [];
      let i = currentIndex;

      while (i < currentLines.length) {
        const line = currentLines[i];
        const indentation = getIndentationLevel(line);

        // If we encounter a line with lower indentation than our base, return to parent
        if (indentation < baseIndentation) {
          break;
        }

        // If this is a line at our current indentation level
        if (indentation === baseIndentation) {
          // Check if it's a checkbox item
          const checkboxMatch = line.trim().match(/^- \[([ x])\] (.+)$/);

          if (checkboxMatch) {
            const isChecked = checkboxMatch[1] === "x";
            const text = checkboxMatch[2];

            // Check if next line is at a deeper indentation - if so, it's a child
            const hasChildren =
              i + 1 < currentLines.length &&
              getIndentationLevel(currentLines[i + 1]) > indentation;

            if (hasChildren) {
              // Render this item and process its children
              const [childElements, nextIndex] = renderNestedList(
                currentLines,
                i + 1,
                indentation + 1
              );

              items.push(
                <li key={i} className="flex items-start mb-2">
                  <span
                    className={`mr-2 ${
                      isChecked ? "text-gray-400" : "text-gray-300"
                    }`}
                  >
                    <CheckCircleIcon />
                  </span>
                  <div className="flex-1">
                    <span className={isChecked ? "" : "text-gray-400"}>
                      {text}
                    </span>
                    <ul className="mt-2 ml-2 space-y-2">{childElements}</ul>
                  </div>
                </li>
              );

              // Update index to continue after the children
              i = nextIndex;
            } else {
              // No children, just render this item
              items.push(
                <li key={i} className="flex items-start mb-2">
                  <span
                    className={`mr-2 ${
                      isChecked ? "text-gray-400" : "text-gray-300"
                    }`}
                  >
                    <CheckCircleIcon />
                  </span>
                  <span className={isChecked ? "" : "text-gray-400"}>
                    {text}
                  </span>
                </li>
              );
              i++;
            }
          } else if (line.trim().startsWith("- ")) {
            // Regular list item (not a checkbox)
            const text = line.trim().substring(2);

            // Check for children
            const hasChildren =
              i + 1 < currentLines.length &&
              getIndentationLevel(currentLines[i + 1]) > indentation;

            if (hasChildren) {
              const [childElements, nextIndex] = renderNestedList(
                currentLines,
                i + 1,
                indentation + 1
              );

              items.push(
                <li key={i} className="flex items-center mb-2">
                  <span className="mr-2">•</span>
                  <div className="flex-1">
                    <span>{text}</span>
                    <ul className="mt-2 ml-4 space-y-2">{childElements}</ul>
                  </div>
                </li>
              );

              i = nextIndex;
            } else {
              items.push(
                <li key={i} className="flex items-center mb-2">
                  <span className="mr-2">•</span>
                  <span>{text}</span>
                </li>
              );
              i++;
            }
          } else {
            // Regular text
            items.push(
              <li key={i} className="mb-2">
                <span>{line.trim()}</span>
              </li>
            );
            i++;
          }
        } else {
          // This line is at a deeper indentation than what we're currently processing
          // Skip it, as it will be handled by a recursive call
          i++;
        }
      }

      return [items, i];
    };

    const [listItems] = renderNestedList(
      lines.filter((line: string) => line.trim().length > 0)
    );

    return (
      <div className="px-3 py-2.5">
        <div>
          <h3 className="font-medium text-gray-700 mb-2 flex items-center">
            Progress Report
          </h3>
          <ul className="space-y-2">{listItems}</ul>
        </div>
      </div>
    );
  };

  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      icon={<ChecklistIcon size={16} className="text-gray-500" />}
      title={commitMessage}
      metadata={metadata}
      defaultCollapsed={false}
      modelInfo={modelInfo}
      renderArguments={renderArguments}
    />
  );
}
