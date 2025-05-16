import { ReactNode, useState, useEffect } from "react";
import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  InfoIcon,
} from "@primer/octicons-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ContentRenderer } from "../ui/renderers";

export interface BaseToolCallProps {
  toolCall: ToolCall;
  displayMode: ToolCallDisplayMode;
  output?: string;
  icon: ReactNode;
  title: ReactNode;
  metadata?: Record<string, any>;
  defaultCollapsed?: boolean;
  hideInitialIcon?: boolean;
  hideArguments?: boolean;
  renderArguments?: (args: Record<string, any>) => ReactNode;
  modelInfo?: {
    name?: string;
    usage?: {
      completion_tokens?: number;
      prompt_tokens?: number;
      total_tokens?: number;
    };
  };
  argsMaxHeight?: number;
  outputMaxHeight?: number;
}

export function BaseToolCall({
  toolCall,
  displayMode,
  output,
  icon,
  title,
  metadata,
  defaultCollapsed,
  modelInfo,
  hideInitialIcon = false,
  hideArguments = false,
  renderArguments,
  argsMaxHeight = 200,
  outputMaxHeight = 200,
}: BaseToolCallProps) {
  // Initialize isCollapsed based on displayMode first, falling back to defaultCollapsed only if displayMode is "expanded"
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (displayMode === "condensed") {
      return true;
    }
    return defaultCollapsed;
  });

  const [isHovering, setIsHovering] = useState(false);

  // Update isCollapsed when displayMode changes, always prioritizing displayMode
  useEffect(() => {
    if (displayMode === "condensed") {
      setIsCollapsed(true);
    } else if (displayMode === "expanded") {
      setIsCollapsed(false);
    }
  }, [displayMode]);

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

  // Handler for expanding/collapsing
  const handleExpandClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Parse function arguments as JSON
  const parsedArguments = JSON.parse(toolCall.function.arguments);

  return (
    <div
      className="border rounded-md bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={`flex items-center justify-between pl-2 pr-3 py-2.5  ${
          isCollapsed ? "" : "border-b border-gray-200"
        } `}
      >
        <div
          className="flex items-center space-x-2 cursor-pointer grow"
          onClick={handleExpandClick}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="text-gray-400" />
          ) : (
            <ChevronDownIcon className="text-gray-400" />
          )}
          {!hideInitialIcon && <span className="mr-2">{icon}</span>}
          <span className="text-gray-700 grow">{title}</span>
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

      {!isCollapsed && (
        <>
          {!hideArguments && (
            <div className="">
              {renderArguments ? (
                renderArguments(parsedArguments)
              ) : (
                <ContentRenderer
                  content={JSON.stringify(parsedArguments, null, 2)}
                  contentType="code"
                  language="json"
                  enableTruncation={true}
                  maxHeight={argsMaxHeight}
                />
              )}
            </div>
          )}

          {output && (
            <div className="">
              <ContentRenderer
                content={output}
                contentType="auto"
                enableTruncation={true}
                maxHeight={outputMaxHeight}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
