import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { TerminalIcon } from "@primer/octicons-react";
import { BaseToolCall } from "./BaseToolCall";
import { TruncatedContent } from "../ui/renderers";

interface BashToolCallProps {
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

export function BashToolCall({
  toolCall,
  displayMode,
  output,
  modelInfo,
  metadata,
}: BashToolCallProps) {
  // Parse the arguments to extract information for the title
  const args = JSON.parse(toolCall.function.arguments);
  const command = args.command || args.cmd || "Unknown command";

  // Function to determine the command type and extract relevant details
  const getCommandDetails = (cmd: string) => {
    // Extract the first part of the command
    const parts = cmd.trim().split(/\s+/);
    const mainCmd = parts[0];

    // Common file listing commands
    if (mainCmd === "ls" || mainCmd === "dir" || cmd.startsWith("ls ")) {
      const path = parts.length > 1 ? parts[parts.length - 1] : ".";
      return { action: "Listed files", target: path };
    }

    // File creation commands
    if (mainCmd === "touch" || cmd.startsWith("touch ")) {
      const file = parts.length > 1 ? parts[parts.length - 1] : "";
      return { action: "Created file", target: file };
    }

    // Directory creation
    if (mainCmd === "mkdir" || cmd.startsWith("mkdir ")) {
      const dir = parts.length > 1 ? parts[parts.length - 1] : "";
      return { action: "Created folder", target: dir };
    }

    // Moving files
    if (mainCmd === "mv" || cmd.startsWith("mv ")) {
      const source = parts.length > 1 ? parts[1] : "";
      const dest = parts.length > 2 ? parts[2] : "";
      return { action: "Moved", target: `${source} to ${dest}` };
    }

    // Copying files
    if (mainCmd === "cp" || cmd.startsWith("cp ")) {
      const source = parts.length > 1 ? parts[1] : "";
      const dest = parts.length > 2 ? parts[2] : "";
      return { action: "Copied", target: `${source} to ${dest}` };
    }

    // File removal
    if (mainCmd === "rm" || cmd.startsWith("rm ")) {
      const file = parts.length > 1 ? parts[parts.length - 1] : "";
      const isRecursive =
        parts.includes("-r") || parts.includes("-rf") || parts.includes("-fr");
      return {
        action: isRecursive ? "Removed directory" : "Removed file",
        target: file,
      };
    }

    // File/directory search
    if (mainCmd === "find" || cmd.startsWith("find ")) {
      const searchPattern = parts.length > 2 ? parts[parts.length - 1] : "";
      return { action: "Found files", target: searchPattern };
    }

    // Git commands
    if (mainCmd === "git") {
      if (parts[1] === "clone") {
        return {
          action: "Cloned repository",
          target: parts.length > 2 ? parts[2] : "",
        };
      }
      if (parts[1] === "pull") {
        return { action: "Pulled changes", target: "" };
      }
      if (parts[1] === "push") {
        return { action: "Pushed changes", target: "" };
      }
      if (parts[1] === "commit") {
        return {
          action: "Committed changes",
          target: parts.includes("-m") ? parts[parts.indexOf("-m") + 1] : "",
        };
      }
      return { action: `Git ${parts[1] || ""}`, target: "" };
    }

    // NPM/Yarn commands
    if (mainCmd === "npm" || mainCmd === "yarn") {
      if (parts[1] === "install" || parts[1] === "add") {
        const pkg = parts.length > 2 ? parts[2] : "dependencies";
        return { action: "Installed package", target: pkg };
      }
      if (parts[1] === "run") {
        return {
          action: "Ran script",
          target: parts.length > 2 ? parts[2] : "",
        };
      }
      return { action: `${mainCmd} ${parts[1] || ""}`, target: "" };
    }

    // Default, unknown command
    return { action: null, target: null };
  };

  // Get command details
  const { action, target } = getCommandDetails(command);

  // Generate a title based on the command type
  let title;
  if (action) {
    title = (
      <div className="flex items-center gap-1">
        <span className="text-gray-500">Ran command</span>
        <TerminalIcon size={16} className="text-gray-500" />
        <span className="text-gray-500">{action}</span>
        <span className="">{target}</span>
      </div>
    );
  } else {
    title = (
      <div className="flex items-center gap-1">
        <span className="font-medium">Ran command:</span>
        <TerminalIcon size={16} className="text-gray-500" />
        <span className="text-gray-700">
          {command.substring(0, 50)}
          {command.length > 50 ? "..." : ""}
        </span>
      </div>
    );
  }

  // Metadata to display in the popover
  const combinedMetadata = {
    ...args,
    functionName: toolCall.function.name,
    timestamp: new Date().toISOString(),
    workingDirectory: args.cwd || args.workingDirectory || "unknown",
    ...(metadata || {}),
  };

  // Custom renderer for the arguments
  const renderArguments = (args: Record<string, any>) => (
    <div className="bg-gray-50 font-mono text-sm px-3 py-2.5 rounded-b-md">
      <TruncatedContent maxHeight={150}>{command}</TruncatedContent>
    </div>
  );

  return (
    <BaseToolCall
      toolCall={toolCall}
      displayMode={displayMode}
      output={output}
      title={title}
      metadata={metadata}
      modelInfo={modelInfo}
      hideInitialIcon={true}
      renderArguments={renderArguments}
    />
  );
}
