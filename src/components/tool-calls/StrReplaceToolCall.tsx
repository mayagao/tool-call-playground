import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { FileIcon, FileDirectoryIcon } from "@primer/octicons-react";
import { BaseToolCall } from "./BaseToolCall";
import path from "path";
import { ReactNode } from "react";
import { truncatePath } from "@/utils/fileUtils";

interface StrReplaceToolCallProps {
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
}

export function StrReplaceToolCall({
  toolCall,
  displayMode,
  output,
  modelInfo,
}: StrReplaceToolCallProps) {
  // Parse the arguments to extract information for the title
  const args = JSON.parse(toolCall.function.arguments);
  const command = args.command || "edit";
  const fullPath = args.path || "unknown path";

  // Get just the filename or last directory name
  const basename = path.basename(fullPath);
  const isDirectory = !basename.includes(".");

  // Get truncated path
  const truncatedPath = truncatePath(fullPath);

  // Generate a title that shows the command and filename/dirname
  const title = (
    <div className="flex sentence-case items-center gap-1">
      <span className="capitalize text-gray-500">
        {command.endsWith("e") ? `${command}d` : `${command}ed`}
      </span>
      {isDirectory ? (
        <FileDirectoryIcon className="text-gray-500 ml-0.5 mr-0.5" />
      ) : (
        <FileIcon className="text-gray-500 ml-0.5 mr-0.5" />
      )}
      <span>{basename}</span>
      {truncatedPath && <span className="text-gray-500">{truncatedPath}/</span>}
    </div>
  );

  // Create icon as ReactNode to match the expected type
  const iconElement: ReactNode = isDirectory ? (
    <FileDirectoryIcon />
  ) : (
    <FileIcon />
  );

  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      hideInitialIcon={true}
      hideArguments={true}
      title={title}
      metadata={args}
      modelInfo={modelInfo}
      icon={iconElement}
    />
  );
}
