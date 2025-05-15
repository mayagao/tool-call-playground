import { ReactNode, useState } from "react";
import { ToolCall, ToolCallDisplayMode } from "@/types/tool-calls";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
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
  const isCondensed = displayMode === "condensed";

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

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          {!hideInitialIcon && <span className="mr-2">{icon}</span>}
          <span className="font-medium text-gray-700">{title}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger>
              <div className="flex items-center text-gray-400 hover:text-gray-700">
                <Info size={16} />
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
