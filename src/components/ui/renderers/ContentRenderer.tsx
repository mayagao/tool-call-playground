import React from "react";
import { CodeHighlight } from "./CodeHighlight";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { DiffRenderer } from "./DiffRenderer";
import { TruncatedContent } from "../TruncatedContent";
import { useSiteContext } from "@/context/SiteContext";

interface ContentRendererProps {
  content: string;
  contentType?: "code" | "markdown" | "diff" | "auto";
  language?: string;
  className?: string;
  maxHeight?: number; // Optional override for specific components
  defaultExpanded?: boolean;
  enableTruncation?: boolean;
  showMoreEnabled?: boolean;
}

export function ContentRenderer({
  content,
  contentType = "auto",
  language,
  className,
  maxHeight, // This is now optional - will use global setting if not provided
  defaultExpanded = false,
  enableTruncation = true,
  showMoreEnabled = true,
}: ContentRendererProps) {
  // Get global max height setting from context
  const { globalSettings } = useSiteContext();

  // Use provided maxHeight if available, otherwise use global setting
  const effectiveMaxHeight = maxHeight || globalSettings.maxContentHeight;

  // Auto-detect content type if not explicitly provided
  const detectedContentType =
    contentType === "auto" ? detectContentType(content) : contentType;

  // For regular message content (typically text/markdown), never truncate it
  if (detectedContentType === "markdown" && !showMoreEnabled) {
    enableTruncation = false;
  }

  // Detect content type
  function detectContentType(content: string): "code" | "markdown" | "diff" {
    // Simple heuristics to guess content type
    if (
      content.includes("diff --git") ||
      content.includes("@@ ") ||
      content.includes("+++ ") ||
      (content.includes("+ ") && content.includes("- "))
    ) {
      return "diff";
    } else if (
      content.includes("# ") ||
      content.includes("## ") ||
      content.includes("**") ||
      content.includes("![") ||
      (content.includes("[") && content.includes("]("))
    ) {
      return "markdown";
    } else {
      return "code";
    }
  }

  const renderContent = () => {
    switch (detectedContentType) {
      case "markdown":
        return <MarkdownRenderer content={content} className={className} />;

      case "diff":
        return <DiffRenderer content={content} className={className} />;

      case "code":
        return (
          <CodeHighlight
            code={content}
            language={language}
            className={className}
          />
        );
    }
  };

  // Wrap with TruncatedContent if enabled
  if (enableTruncation) {
    return (
      <TruncatedContent
        maxHeight={effectiveMaxHeight}
        defaultExpanded={defaultExpanded}
        className={className}
      >
        {renderContent()}
      </TruncatedContent>
    );
  }

  // Otherwise render directly
  return renderContent();
}
