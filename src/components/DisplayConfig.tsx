import {
  ToolCallDisplayConfig,
  ToolCallDisplayMode,
  GlobalDisplaySettings,
} from "@/types/tool-calls";
import { useState, useEffect } from "react";
import {
  CheckIcon,
  DashIcon,
  FileIcon,
  TerminalIcon,
  IssueOpenedIcon,
  ChecklistIcon,
} from "@primer/octicons-react";
import { Figma, Brain } from "lucide-react";
import { ReactNode } from "react";

interface DisplayConfigProps {
  config: ToolCallDisplayConfig;
  onConfigChange: (newConfig: ToolCallDisplayConfig) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  globalSettings: GlobalDisplaySettings;
  onGlobalSettingsChange: (settings: GlobalDisplaySettings) => void;
}

// Map of tool types to their icons
const toolIcons: Record<string, ReactNode> = {
  str_replace_editor: <FileIcon className="text-gray-500" size={14} />,
  get_figma_data: <Figma className="text-gray-500" size={14} />,
  think: <Brain className="text-gray-500" size={14} />,
  bash: <TerminalIcon className="text-gray-500" size={14} />,
  create_issue: <IssueOpenedIcon className="text-gray-500" size={14} />,
  report_progress: <ChecklistIcon className="text-gray-500" size={14} />,
  endBlocks: <FileIcon className="text-gray-500" size={14} />,
};

export function DisplayConfig({
  config,
  onConfigChange,
  onFileUpload,
  globalSettings,
  onGlobalSettingsChange,
}: DisplayConfigProps) {
  const [selectAllState, setSelectAllState] = useState<
    "checked" | "unchecked" | "indeterminate"
  >("unchecked");

  // Handle individual checkbox change
  const handleCheckboxChange = (toolType: string) => {
    const currentMode = config[toolType];
    const newMode = currentMode === "expanded" ? "condensed" : "expanded";

    onConfigChange({
      ...config,
      [toolType]: newMode,
    });
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = () => {
    const newMode: ToolCallDisplayMode =
      selectAllState === "checked" ? "condensed" : "expanded";

    const updatedConfig = Object.keys(config).reduce((acc, toolType) => {
      acc[toolType] = newMode;
      return acc;
    }, {} as ToolCallDisplayConfig);

    onConfigChange(updatedConfig);
  };

  // Handle max height change
  const handleMaxHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onGlobalSettingsChange({
        ...globalSettings,
        maxContentHeight: value,
      });
    }
  };

  // Update select all state based on individual checkboxes
  useEffect(() => {
    const expandedCount = Object.values(config).filter(
      (mode) => mode === "expanded"
    ).length;
    const totalCount = Object.keys(config).length;

    if (expandedCount === 0) {
      setSelectAllState("unchecked");
    } else if (expandedCount === totalCount) {
      setSelectAllState("checked");
    } else {
      setSelectAllState("indeterminate");
    }
  }, [config]);

  return (
    <div className="fixed bottom-4 w-52 right-4 bg-white p-4 rounded-lg shadow-md border">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex text-xs text-gray-500 items-center gap-2">
            <span>Expand All</span>
          </div>
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <div
              className="w-5 h-5 border rounded flex items-center justify-center cursor-pointer"
              onClick={handleSelectAllChange}
            >
              {selectAllState === "checked" && <CheckIcon size={12} />}
              {selectAllState === "indeterminate" && <DashIcon size={12} />}
            </div>
          </label>
        </div>

        {Object.entries(config).map(([toolType, mode]) => (
          <div key={toolType} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {toolIcons[toolType]}
              <span className="text-sm text-gray-700">{toolType}</span>
            </div>
            <div
              className="w-5 h-5 border rounded flex items-center justify-center cursor-pointer"
              onClick={() => handleCheckboxChange(toolType)}
            >
              {mode === "expanded" && <CheckIcon size={12} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
