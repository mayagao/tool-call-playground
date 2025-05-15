import { ReactNode, useState } from "react";
import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  InfoIcon,
} from "@primer/octicons-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface BaseToolCallProps {
  toolCall: ToolCall;
  displayMode: ToolCallDisplayMode;
  output?: string;
  icon: ReactNode;
  title: ReactNode;
  metadata?: Record<string, any>;
  defaultCollapsed?: boolean;
  hideInitialIcon?: boolean;
  renderArguments?: (args: Record<string, any>) => ReactNode;
  modelInfo?: {
    name?: string;
    usage?: {
      completion_tokens?: number;
      prompt_tokens?: number;
      total_tokens?: number;
    };
  };
}

export function BaseToolCall({
  toolCall,
  displayMode,
  output,
  icon,
  title,
  metadata,
  defaultCollapsed = false,
  modelInfo,
  hideInitialIcon = false,
}: BaseToolCallProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [localDisplayMode, setLocalDisplayMode] =
    useState<ToolCallDisplayMode>(displayMode);
  const [isHovering, setIsHovering] = useState(false);
  const isCondensed = localDisplayMode === "condensed";

  // Enhance metadata with standard information
  const enhancedMetadata = {
    id: toolCall.id,
    index: toolCall.index,
    functionName: toolCall.function.name,
    type: toolCall.type,
    timestamp: new Date().toISOString(),
    ...(modelInfo && {
      model: modelInfo.name,
      tokenUsage: modelInfo.usage,
    }),
    ...(metadata || {}),
  };

  // Handler for expanding from condensed mode
  const handleExpandClick = () => {
    if (isCondensed) {
      setLocalDisplayMode("expanded");
    }
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className="border rounded-md pl-2 pr-3 py-2.5 bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleExpandClick}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="text-gray-400" />
          ) : (
            <ChevronDownIcon className="text-gray-400" />
          )}
          {!hideInitialIcon && <span className="mr-2">{icon}</span>}
          <span className="font-medium text-gray-700">{title}</span>
        </div>

        <div className="flex items-center space-x-2">
          {isHovering && (
            <Popover>
              <PopoverTrigger>
                <div className="flex items-center text-gray-400 hover:text-gray-700">
                  <InfoIcon />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-2">
                  <h3 className="font-medium">Metadata</h3>
                  <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(enhancedMetadata, null, 2)}
                  </pre>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {!isCollapsed && !isCondensed && (
        <>
          <div className="mt-2">
            <div className="text-sm text-gray-600 mb-2">Arguments:</div>
            <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(JSON.parse(toolCall.function.arguments), null, 2)}
            </pre>
          </div>

          {output && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Output:</div>
              <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                {output}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
