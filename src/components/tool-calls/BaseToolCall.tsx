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
      className="border border-gray-300 rounded-md bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={`flex items-center justify-between pl-2 pr-3 py-2  ${
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
                <div className="flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150">
                  <InfoIcon />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0 border-gray-200 shadow-lg">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <InfoIcon size={16} className="text-gray-600" />
                    Tool Call Metadata
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {/* Core Information */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</label>
                      <p className="text-sm text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded border">
                        {enhancedMetadata.id}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Index</label>
                      <p className="text-sm text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded border">
                        {enhancedMetadata.index}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Function</label>
                    <p className="text-sm text-gray-800 font-mono bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      {enhancedMetadata.functionName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
                    <p className="text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded border">
                      {enhancedMetadata.type}
                    </p>
                  </div>

                  {/* Model Information */}
                  {enhancedMetadata.model && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Model</label>
                      <p className="text-sm text-gray-800 bg-green-50 px-2 py-1 rounded border border-green-200">
                        {enhancedMetadata.model}
                      </p>
                    </div>
                  )}

                  {/* Token Usage */}
                  {enhancedMetadata.tokenUsage && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Token Usage</label>
                      <div className="bg-purple-50 border border-purple-200 rounded p-2 text-sm">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium text-purple-800">Input</div>
                            <div className="text-purple-600">{enhancedMetadata.tokenUsage.prompt_tokens || 0}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-800">Output</div>
                            <div className="text-purple-600">{enhancedMetadata.tokenUsage.completion_tokens || 0}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-800">Total</div>
                            <div className="text-purple-600">{enhancedMetadata.tokenUsage.total_tokens || 0}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Timestamp</label>
                    <p className="text-sm text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded border">
                      {new Date(enhancedMetadata.timestamp).toLocaleString()}
                    </p>
                  </div>

                  {/* Additional Metadata */}
                  {Object.keys(enhancedMetadata).filter(key => 
                    !['id', 'index', 'functionName', 'type', 'timestamp', 'model', 'tokenUsage'].includes(key)
                  ).length > 0 && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Additional Data</label>
                      <details className="bg-gray-50 border rounded">
                        <summary className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded">
                          <span className="text-gray-600">View raw metadata</span>
                        </summary>
                        <pre className="p-2 text-xs overflow-x-auto whitespace-pre-wrap text-gray-700 border-t bg-white">
                          {JSON.stringify(
                            Object.fromEntries(
                              Object.entries(enhancedMetadata).filter(([key]) => 
                                !['id', 'index', 'functionName', 'type', 'timestamp', 'model', 'tokenUsage'].includes(key)
                              )
                            ), 
                            null, 2
                          )}
                        </pre>
                      </details>
                    </div>
                  )}
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
