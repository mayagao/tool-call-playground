import React from "react";
import {
  ChevronRightIcon,
  GitPullRequestIcon,
  FileIcon,
} from "@primer/octicons-react";

interface CondensedEndBlockProps {
  content: string;
  finishReason: string;
  onClick: () => void;
}

export function CondensedEndBlock({
  content,
  finishReason,
  onClick,
}: CondensedEndBlockProps) {
  // Detect what type of end block it is
  const isPR =
    content.includes("<pr_title>") && content.includes("</pr_title>");

  // Extract PR title if it's a PR end block
  let title = "Special block detected";
  let icon = <FileIcon className="text-gray-500" />;

  if (isPR) {
    const titleMatch = content.match(/<pr_title>([\s\S]*?)<\/pr_title>/);
    title = titleMatch ? titleMatch[1].trim() : "PR Title Not Found";
    icon = <GitPullRequestIcon className="text-gray-500" />;
  }

  return (
    <div className="border border-gray-300 rounded-md bg-white">
      <div className="flex items-center justify-between pl-2 pr-3 py-2">
        <div
          className="flex items-center space-x-2 cursor-pointer grow"
          onClick={onClick}
        >
          <ChevronRightIcon className="text-gray-400" />
          <span className="text-gray-500 mr-2">
            {isPR ? "Created" : "Generated"}
          </span>
          <span className="mr-2">{icon}</span>
          <span className="text-gray-700 grow">{title}</span>
        </div>
      </div>
    </div>
  );
}
