import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { FileEdit, Folder, FileText } from "lucide-react";
import { BaseToolCall } from "./BaseToolCall";
import path from "path";

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

  // Generate a title that shows the command and filename/dirname
  const title = (
    <div className="flex sentence-case items-center gap-1">
      <span className="capitalize">{command}ed</span>
      {isDirectory ? (
        <Folder size={14} className="text-gray-500" />
      ) : (
        <FileText size={14} className="text-gray-500" />
      )}
      <span>{basename}</span>
      <span className="text-gray-500 text-xs">({fullPath})</span>
    </div>
  );

  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      hideInitialIcon={true}
      icon={<FileEdit size={16} className="text-orange-500" />}
      title={title}
      metadata={args}
      defaultCollapsed={true}
      modelInfo={modelInfo}
    />
  );
}
