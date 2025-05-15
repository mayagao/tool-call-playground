import React, { useEffect, useState } from "react";

interface DiffRendererProps {
  content: string;
  className?: string;
}

// Parse the diff header to get information about line numbers
function parseHunkHeader(header: string): {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
} {
  // Format: @@ -oldStart,oldCount +newStart,newCount @@
  const match = header.match(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);

  if (!match) {
    return { oldStart: 0, oldCount: 0, newStart: 0, newCount: 0 };
  }

  return {
    oldStart: parseInt(match[1], 10),
    oldCount: match[2] ? parseInt(match[2], 10) : 1,
    newStart: parseInt(match[3], 10),
    newCount: match[4] ? parseInt(match[4], 10) : 1,
  };
}

export function DiffRenderer({ content, className }: DiffRendererProps) {
  const [parsedDiff, setParsedDiff] = useState<
    Array<{
      type: string;
      content: string;
      className: string;
      oldLineNumber?: number;
      newLineNumber?: number;
    }>
  >([]);

  useEffect(() => {
    if (!content) return;

    // Check if the content is a diff format
    const isDiff =
      content.includes("@@ ") ||
      (content.includes("+ ") && content.includes("- "));

    if (!isDiff) {
      // Not a diff, just return as-is
      setParsedDiff([{ type: "normal", content, className: "" }]);
      return;
    }

    // Split into lines for processing
    const lines = content.split("\n");
    const result: Array<{
      type: string;
      content: string;
      className: string;
      oldLineNumber?: number;
      newLineNumber?: number;
    }> = [];

    // Track current state
    let inHunk = false;
    let oldFile = "";
    let newFile = "";
    let currentHunk: ReturnType<typeof parseHunkHeader> | null = null;
    let oldLineNumber = 0;
    let newLineNumber = 0;

    // Process each line
    lines.forEach((line) => {
      // Skip unwanted metadata lines
      if (
        line.startsWith("create file mode") ||
        line.startsWith("index 0000000") ||
        line.startsWith("diff --git") // Skip diff --git headers
      ) {
        return;
      }

      // File markers
      if (line.startsWith("--- ")) {
        oldFile = line.slice(4);
        result.push({
          type: "old-file",
          content: line,
          className: "bg-gray-100 text-gray-700 pl-4 py-1 hidden",
        });
        return;
      }

      if (line.startsWith("+++ ")) {
        newFile = line.slice(4);
        result.push({
          type: "new-file",
          content: line,
          className: "bg-gray-100 text-gray-700 pl-4 py-1 hidden",
        });
        return;
      }

      // Hunk header
      if (line.startsWith("@@")) {
        currentHunk = parseHunkHeader(line);
        inHunk = true;
        // Reset line numbers based on hunk header
        oldLineNumber = currentHunk.oldStart;
        newLineNumber = currentHunk.newStart;

        // We'll keep the hunk header but make it less prominent
        result.push({
          type: "hunk-header",
          content: `${line}`, // Keep original format
          className: "bg-gray-100 text-gray-500 pl-4 py-1 text-xs",
        });
        return;
      }

      // Content lines within a hunk
      if (inHunk) {
        if (line.startsWith("+")) {
          result.push({
            type: "addition",
            content: line,
            className:
              "bg-green-50 text-green-800 border-l-4 border-green-500 pl-2 py-1",
            oldLineNumber: undefined, // No old line for additions
            newLineNumber: newLineNumber++,
          });
        } else if (line.startsWith("-")) {
          result.push({
            type: "deletion",
            content: line,
            className:
              "bg-red-50 text-red-800 border-l-4 border-red-500 pl-2 py-1",
            oldLineNumber: oldLineNumber++,
            newLineNumber: undefined, // No new line for deletions
          });
        } else {
          // Special case: if old file is /dev/null, all context lines should be treated as additions
          // but Git sometimes omits the + prefix
          if (oldFile === "/dev/null" && !line.startsWith(" ")) {
            result.push({
              type: "implicit-addition",
              content: `+ ${line}`, // Add the + prefix that should have been there
              className:
                "bg-green-50 text-green-800 border-l-4 border-green-500 pl-2 py-1",
              oldLineNumber: undefined,
              newLineNumber: newLineNumber++,
            });
          } else {
            // Regular context line (exists in both files)
            result.push({
              type: "context",
              content: line,
              className: "text-gray-700 pl-4 py-1",
              oldLineNumber: oldLineNumber++,
              newLineNumber: newLineNumber++,
            });
          }
        }
        return;
      }

      // Any other lines
      result.push({
        type: "other",
        content: line,
        className: "text-gray-700 pl-4 py-1 hidden",
      });
    });

    setParsedDiff(result);
  }, [content]);

  if (!parsedDiff.length) {
    return null;
  }

  // If not a diff, just render as pre-formatted text
  if (parsedDiff.length === 1 && parsedDiff[0].type === "normal") {
    return (
      <pre
        className={`bg-gray-50 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap font-mono ${
          className || ""
        }`}
      >
        {parsedDiff[0].content}
      </pre>
    );
  }

  // Render the diff with GitHub-style line numbers
  return (
    <div
      className={`diff-renderer bg-gray-50 p-0 rounded overflow-hidden ${
        className || ""
      }`}
    >
      <div className="text-sm font-mono whitespace-pre-wrap">
        {parsedDiff.map((line, index) => {
          // For header lines without line numbers
          if (
            line.type === "old-file" ||
            line.type === "new-file" ||
            line.type === "hunk-header" ||
            line.type === "other"
          ) {
            return (
              <div key={index} className={line.className}>
                {line.content}
              </div>
            );
          }

          // Choose which line number to show (GitHub style)
          const lineNumber = line.type === "deletion" ? "" : line.newLineNumber;

          // Get border colors for indicators
          const indicatorClass =
            line.type === "deletion"
              ? "border-r-2 border-red-500"
              : line.type === "addition" || line.type === "implicit-addition"
              ? "border-r-2 border-green-500"
              : "";

          // Calculate background colors
          const bgClass =
            line.type === "deletion"
              ? "bg-red-50"
              : line.type === "addition" || line.type === "implicit-addition"
              ? "bg-green-50"
              : "";

          // Extract the first character (+ or -) and the rest of the content
          const firstChar = line.content[0];
          const lineContent = line.content.slice(1);

          // Determine the color for the symbol
          const symbolColor =
            firstChar === "+"
              ? "text-green-700"
              : firstChar === "-"
              ? "text-red-700"
              : "text-gray-400";

          // Render line with GitHub-style line numbers
          return (
            <div key={index} className={`flex ${bgClass} hover:bg-green-100`}>
              {/* Line number column */}
              <div
                className={`w-12 text-right pr-1 shrink-0 text-gray-500 select-none flex items-start justify-end`}
              >
                {lineNumber}
              </div>

              {/* Color indicator */}
              <div className={`shrink-0 ${indicatorClass}`}></div>

              {/* Line prefix (+ or -) */}
              <div className={` flex-shrink-0 px-2 ${symbolColor} font-meidum`}>
                {firstChar}
              </div>

              {/* Line content without the prefix */}
              <div className="grow">{lineContent}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
