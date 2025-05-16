import React from "react";
import { PREndBlock } from "./PREndBlock";

interface EndBlockDetectorProps {
  content: string;
  finishReason: string;
  descriptionMaxHeight?: number;
}

export function EndBlockDetector({
  content,
  finishReason,
  descriptionMaxHeight,
}: EndBlockDetectorProps) {
  // Only process if finish reason is "stop" and content starts with a recognized tag
  if (finishReason !== "stop" || !content.trim().startsWith("<")) {
    return null;
  }

  // Check for PR end block
  if (content.includes("<pr_title>") && content.includes("</pr_title>")) {
    return (
      <PREndBlock
        content={content}
        descriptionMaxHeight={descriptionMaxHeight}
      />
    );
  }

  // Add more end block type detections here as needed

  // If no matching end block type is found
  return null;
}
