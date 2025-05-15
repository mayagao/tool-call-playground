import React from "react";
import { MarkdownRenderer } from "../ui/renderers";
import { IssueOpenedIcon } from "@primer/octicons-react";

interface PREndBlockProps {
  content: string;
}

export function PREndBlock({ content }: PREndBlockProps) {
  // Extract PR title and description from the content
  const titleMatch = content.match(/<pr_title>([\s\S]*?)<\/pr_title>/);
  const descriptionMatch = content.match(
    /<pr_description>([\s\S]*?)<\/pr_description>/
  );

  const title = titleMatch ? titleMatch[1].trim() : "PR Title Not Found";
  const description = descriptionMatch ? descriptionMatch[1].trim() : "";

  return (
    <div className="border rounded-md bg-white shadow-sm">
      <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50">
        <IssueOpenedIcon size={16} className="text-green-600 mr-2" />
        <h2 className="font-medium text-gray-800">{title}</h2>
      </div>
      <div className="px-3">
        <MarkdownRenderer content={description} />
      </div>
    </div>
  );
}
