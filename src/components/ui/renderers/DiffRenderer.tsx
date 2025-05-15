import React from "react";

interface DiffRendererProps {
  content: string;
  className?: string;
}

export function DiffRenderer({ content, className }: DiffRendererProps) {
  // Check if the content is a diff format
  const isDiff =
    content.includes("diff --git") ||
    content.includes("@@ ") ||
    content.includes("+++ ") ||
    (content.includes("+ ") && content.includes("- "));

  if (!isDiff) {
    // If not a diff, just render as pre-formatted text
    return (
      <pre
        className={`bg-gray-50 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap font-mono ${
          className || ""
        }`}
      >
        {content}
      </pre>
    );
  }

  // Split into lines for processing
  const lines = content.split("\n");

  return (
    <div
      className={`diff-renderer bg-gray-50 p-0 rounded overflow-hidden ${
        className || ""
      }`}
    >
      <pre className="text-sm font-mono p-0 m-0 whitespace-pre-wrap">
        {lines.map((line, index) => {
          // Determine line type based on starting character
          let lineClass = "";

          if (line.startsWith("+")) {
            // Added line
            lineClass =
              "bg-green-50 text-green-800 border-l-4 border-green-500 pl-2 py-1";
          } else if (line.startsWith("-")) {
            // Removed line
            lineClass =
              "bg-red-50 text-red-800 border-l-4 border-red-500 pl-2 py-1";
          } else if (line.startsWith("@@")) {
            // Diff section header
            lineClass =
              "bg-blue-50 text-blue-800 border-l-4 border-blue-500 pl-2 py-1";
          } else if (
            line.startsWith("diff") ||
            line.startsWith("index") ||
            line.startsWith("---") ||
            line.startsWith("+++")
          ) {
            // Diff metadata
            lineClass = "bg-gray-100 text-gray-700 pl-4 py-1";
          } else {
            // Context line
            lineClass = "text-gray-700 pl-4 py-1";
          }

          return (
            <div key={index} className={lineClass}>
              {line || " "}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
