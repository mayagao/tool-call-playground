import React, { memo } from "react";
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

function CondensedEndBlockComponent({
  content,
  finishReason,
  onClick,
}: CondensedEndBlockProps) {
  // Detect what type of end block it is - memoize this for performance
  const blockInfo = React.useMemo(() => {
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

    return { isPR, title, icon };
  }, [content]);

  // Custom click handler for immediate feedback
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Apply a visual feedback before executing the click handler
    const target = e.currentTarget;
    target.classList.add("bg-gray-50");

    // Execute click handler immediately
    onClick();

    // Remove the visual feedback after a short delay
    setTimeout(() => {
      target.classList.remove("bg-gray-50");
    }, 150);
  };

  return (
    <div className="border border-gray-300 rounded-md bg-white">
      <div className="flex items-center justify-between pl-2 pr-3 py-2">
        <div
          className="flex items-center space-x-2 cursor-pointer grow transition-colors duration-150"
          onClick={handleClick}
        >
          <ChevronRightIcon className="text-gray-400" />
          <span className="text-gray-500 mr-2">
            {blockInfo.isPR ? "Created" : "Generated"}
          </span>
          <span className="mr-2">{blockInfo.icon}</span>
          <span className="text-gray-700 grow">{blockInfo.title}</span>
        </div>
      </div>
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
export const CondensedEndBlock = memo(CondensedEndBlockComponent);
