import React, { useState } from "react";
import { ContentRenderer } from "../ui/renderers";
import {
  GitPullRequestIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@primer/octicons-react";

interface PREndBlockProps {
  content: string;
  descriptionMaxHeight?: number;
}

export function PREndBlock({
  content,
  descriptionMaxHeight = 200,
}: PREndBlockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Extract PR title and description from the content
  const titleMatch = content.match(/<pr_title>([\s\S]*?)<\/pr_title>/);
  const descriptionMatch = content.match(
    /<pr_description>([\s\S]*?)<\/pr_description>/
  );

  const title = titleMatch ? titleMatch[1].trim() : "PR Title Not Found";
  const description = descriptionMatch ? descriptionMatch[1].trim() : "";

  return (
    <div className="border rounded-md bg-white shadow-sm">
      <div
        className="flex items-center border-b border-gray-200 rounded-t-md px-4 py-2 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="text-gray-400 mr-2" />
        ) : (
          <ChevronDownIcon className="text-gray-400 mr-2" />
        )}
        <span className="text-gray-500 mr-2">Task completed</span>
        <GitPullRequestIcon className="text-gray-500 mr-2" />
        <span className="text-gray-800">{title}</span>
      </div>
      {!isCollapsed && (
        <div className="px-3">
          <ContentRenderer
            content={description}
            contentType="markdown"
            enableTruncation={true}
            maxHeight={descriptionMaxHeight}
          />
        </div>
      )}
    </div>
  );
}
