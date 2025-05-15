import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { IssueOpenedIcon } from "@primer/octicons-react";
import { BaseToolCall } from "./BaseToolCall";
import { MarkdownRenderer } from "../ui/renderers";
import Image from "next/image";

interface CreateIssueToolCallProps {
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

// Component to display GitHub avatar
function GitHubAvatar({ username }: { username: string }) {
  return (
    <div className="flex items-center">
      <img
        src={`https://github.com/${username}.png?size=24`}
        alt={`${username} avatar`}
        className="w-5 h-5 rounded-full mr-1"
        onError={(e) => {
          // Fallback if avatar fails to load
          e.currentTarget.src = "https://github.com/github.png?size=24";
        }}
      />
      <span className="text-xs">{username}</span>
    </div>
  );
}

export function CreateIssueToolCall({
  toolCall,
  displayMode,
  output,
  modelInfo,
  metadata,
}: CreateIssueToolCallProps) {
  const args = JSON.parse(toolCall.function.arguments);
  const title = args.title || "";

  // Process body content to remove title if it exists
  const processBodyContent = (body: string) => {
    if (!body) return "";

    // Check if body starts with a title that matches the issue title
    const lines = body.split("\n");
    let processedBody = body;

    // Remove title line and any empty lines after it
    if (
      lines[0] &&
      (lines[0].startsWith("# ") ||
        lines[0] === title ||
        lines[0].toLowerCase() === title.toLowerCase())
    ) {
      let skipLines = 1;
      // Skip empty lines after title
      while (skipLines < lines.length && !lines[skipLines].trim()) {
        skipLines++;
      }
      processedBody = lines.slice(skipLines).join("\n");
    }

    return processedBody;
  };

  // Generate a title with issue title, labels, and assignees
  const componentTitle = (
    <>
      <div className="flex items-center gap-1">
        <span className="text-gray-500 ">Created</span>
        <IssueOpenedIcon size={16} className="ml-0.5 text-green-600" />
        <span>{title}</span>
        <div className="flex flex-col gap-2 ml-2"></div>
      </div>
    </>
  );

  // Custom renderer for the arguments - now only showing description
  const renderArguments = (args: Record<string, any>) => {
    const bodyContent = args.description || args.body || "";
    const processedContent = processBodyContent(bodyContent);

    return (
      <div className="px-3 py-2.5">
        {processedContent && (
          <div className="space-y-2">
            {args.title && (
              <div className="text-xl font-semibold">{args.title}</div>
            )}
            {args.assignees && args.assignees.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-gray-500 text-xs font-medium mr-1">
                  Assigned to:
                </span>
                <span className="">
                  {args.assignees.map((assignee: string, index: number) => (
                    <GitHubAvatar key={index} username={assignee} />
                  ))}
                </span>
              </div>
            )}
            {args.labels && args.labels.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-500 text-xs font-medium">
                  Labels:
                </span>
                {args.labels.map((label: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 border capitalize border-gray-300 text-xs rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
            <div className=" ">
              <MarkdownRenderer content={processedContent} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      hideInitialIcon={true}
      icon={<IssueOpenedIcon size={16} className="text-green-600" />}
      title={componentTitle}
      metadata={{
        ...args,
        ...(metadata || {}),
      }}
      defaultCollapsed={false}
      modelInfo={modelInfo}
      renderArguments={renderArguments}
    />
  );
}
