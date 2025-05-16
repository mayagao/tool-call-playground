import {
  ToolCallDisplayConfig,
  ToolCallDisplayMode,
  GlobalDisplaySettings,
} from "@/types/tool-calls";
import { useState, useEffect } from "react";
import { CheckIcon, DashIcon } from "@primer/octicons-react";

interface DisplayConfigProps {
  config: ToolCallDisplayConfig;
  onConfigChange: (newConfig: ToolCallDisplayConfig) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  globalSettings: GlobalDisplaySettings;
  onGlobalSettingsChange: (settings: GlobalDisplaySettings) => void;
}

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
    <div className="fixed bottom-4 w-48 right-4 bg-white p-4 rounded-lg shadow-lg border">
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b pb-2 mb-2">
          Expand All
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
            <span className="text-sm text-gray-700">{toolType}</span>
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
