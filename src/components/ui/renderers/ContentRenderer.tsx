import React from "react";
import { CodeHighlight } from "./CodeHighlight";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { DiffRenderer } from "./DiffRenderer";

interface ContentRendererProps {
  content: string;
  contentType?: "code" | "markdown" | "diff" | "auto";
  language?: string;
  className?: string;
}

export function ContentRenderer({
  content,
  contentType = "auto",
  language,
  className,
}: ContentRendererProps) {
  // Auto-detect content type if not specified
  if (contentType === "auto") {
    // Check for diff indicators
    if (
      content.includes("diff --git") ||
      content.includes("@@ ") ||
      content.includes("+++ ") ||
      (content.includes("+ ") && content.includes("- "))
    ) {
      contentType = "diff";
    }
    // Check for markdown indicators
    else if (
      content.includes("# ") ||
      content.includes("## ") ||
      content.includes("**") ||
      content.includes("![") ||
      (content.includes("[") && content.includes("]("))
    ) {
      contentType = "markdown";
    }
    // Default to code for other content
    else {
      contentType = "code";
    }
  }

  // Render based on content type
  switch (contentType) {
    case "markdown":
      return <MarkdownRenderer content={content} className={className} />;

    case "diff":
      return <DiffRenderer content={content} className={className} />;

    case "code":
    default:
      return (
        <CodeHighlight
          code={content}
          language={language}
          className={className}
        />
      );
  }
}
