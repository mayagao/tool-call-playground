import { ToolCallDisplayConfig, ToolCallDisplayMode } from "@/types/tool-calls";

interface DisplayConfigProps {
  config: ToolCallDisplayConfig;
  onConfigChange: (newConfig: ToolCallDisplayConfig) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DisplayConfig({
  config,
  onConfigChange,
  onFileUpload,
}: DisplayConfigProps) {
  const handleModeChange = (toolType: string, mode: ToolCallDisplayMode) => {
    onConfigChange({
      ...config,
      [toolType]: mode,
    });
  };

  // Helper to determine if a tool type should default to expanded
  const isExpandedByDefault = (toolType: string) => {
    const expandedDefaults = [
      "str_replace_editor",
      "think",
      "create_issue",
      "report_progress",
    ];
    return expandedDefaults.includes(toolType);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-lg font-medium mb-3">Display Configuration</h3>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          Upload Ruby File
        </label>
        <input
          type="file"
          accept=".rb"
          onChange={onFileUpload}
          className="text-sm w-full"
        />
      </div>

      <div className="space-y-2">
        {Object.entries(config).map(([toolType, mode]) => (
          <div key={toolType} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{toolType}</span>
            <select
              value={mode}
              onChange={(e) =>
                handleModeChange(
                  toolType,
                  e.target.value as ToolCallDisplayMode
                )
              }
              className="ml-2 text-sm border rounded px-2 py-1"
            >
              {isExpandedByDefault(toolType) ? (
                <>
                  <option value="expanded">Expanded</option>
                  <option value="condensed">Condensed</option>
                </>
              ) : (
                <>
                  <option value="condensed">Condensed</option>
                  <option value="expanded">Expanded</option>
                </>
              )}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
