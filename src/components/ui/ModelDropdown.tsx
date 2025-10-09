"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@primer/octicons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { ModelOption, modelOptions } from "@/data/models";

export interface ModelDropdownProps {
  models?: ModelOption[];
  onChange?: (model: ModelOption) => void;
}

export function ModelDropdown({ models, onChange }: ModelDropdownProps) {
  const availableModels = useMemo(() => {
    if (models && models.length > 0) {
      return models;
    }
    return modelOptions;
  }, [models]);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(
    availableModels[0]
  );
  const [open, setOpen] = useState(false);
  const [hoveredModelId, setHoveredModelId] = useState<string | null>(null);

  useEffect(() => {
    if (!availableModels.length) {
      return;
    }

    const stillExists = availableModels.some(
      (model) => model.id === selectedModel.id
    );

    if (!stillExists) {
      setSelectedModel(availableModels[0]);
    }
  }, [availableModels, selectedModel.id]);

  const handleSelect = (model: ModelOption) => {
    setSelectedModel(model);
    setOpen(false);
    onChange?.(model);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group flex h-[32px] items-center gap-2 rounded-md border border-[rgba(31,35,40,0.15)] bg-white px-3 text-sm font-medium text-gray-700 shadow-[0_1px_0_rgba(31,35,40,0.04)] transition-colors hover:bg-[#f6f8fa]"
        >
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Model
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-700 group-hover:text-[#0969da]">
              {selectedModel.name}
              <ChevronDownIcon size={12} className="text-gray-400" />
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[420px] overflow-visible border border-gray-200 bg-white p-0 shadow-lg"
      >
        <div className="relative flex">
          <ul className="flex-1 py-2">
            {availableModels.map((model) => {
              const isSelected = model.id === selectedModel.id;
              const isHovered = hoveredModelId === model.id;
              const showTooltip = isHovered || isSelected;

              return (
                <li key={model.id} className="relative">
                  <button
                    type="button"
                    onClick={() => handleSelect(model)}
                    onMouseEnter={() => setHoveredModelId(model.id)}
                    onMouseLeave={() => setHoveredModelId(null)}
                    onFocus={() => setHoveredModelId(model.id)}
                    onBlur={() => setHoveredModelId(null)}
                    className={`relative flex w-full items-start gap-3 px-4 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-[#e7f3ff] text-[#0349b4]"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="font-medium leading-tight">
                        {model.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {model.description}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-gray-500 whitespace-nowrap">
                      <span>Input {model.pricing.input}</span>
                      <span>Output {model.pricing.output}</span>
                    </div>
                    {isSelected && (
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0969da]">
                        <CheckIcon size={12} />
                      </span>
                    )}
                  </button>

                  {showTooltip && (
                    <div className="pointer-events-none absolute left-full top-1/2 ml-4 w-64 -translate-y-1/2 rounded-md border border-gray-200 bg-white p-3 text-left shadow-xl">
                      <div className="text-sm font-semibold text-gray-900">
                        {model.title}
                      </div>
                      {(model.tooltipDescription || model.description) && (
                        <div className="mt-1 text-xs text-gray-500">
                          {model.tooltipDescription || model.description}
                        </div>
                      )}
                      <div className="mt-3 grid grid-cols-2 gap-y-1 text-xs text-gray-600">
                        <span>Input</span>
                        <span className="text-right font-medium text-gray-800">
                          {model.pricing.input}
                        </span>
                        <span>Output</span>
                        <span className="text-right font-medium text-gray-800">
                          {model.pricing.output}
                        </span>
                        {model.contextWindow && (
                          <>
                            <span>Context</span>
                            <span className="text-right font-medium text-gray-800">
                              {model.contextWindow}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
