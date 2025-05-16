"use client";

import React from "react";
import { KebabHorizontalIcon } from "@primer/octicons-react";

interface ToolCallHeaderProps {
  status?: string;
  duration?: string;
  triggeredInfo?: string;
  triggerUser?: string;
}

export function ToolCallHeader({
  status = "In progress",
  duration = "1s",
  triggeredInfo = "Triggered via issue assignment just now",
  triggerUser = "user",
}: ToolCallHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 rounded-t-lg bg-white ">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-12">
          <div className="w-32">
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <div className="font-medium">{status}</div>
          </div>

          <div className="w-20">
            <div className="text-sm text-gray-500 mb-1">Duration</div>
            <div className="font-medium">{duration}</div>
          </div>

          <div className="flex-grow">
            <div className="text-sm text-gray-500 mb-1">{triggeredInfo}</div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="font-medium">{triggerUser}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 h-[32px] text-sm bg-[#f6f8fa] text-[#24292f] rounded-md hover:bg-[#f3f4f6] border font-medium border-[rgba(31,35,40,0.15)] shadow-[0_1px_0_rgba(31,35,40,0.04)] transition-colors">
            Re-run
          </button>
          <button className="px-2 h-[32px] text-sm bg-[#f6f8fa] text-[#24292f] rounded-md hover:bg-[#f3f4f6] border border-[rgba(31,35,40,0.15)] shadow-[0_1px_0_rgba(31,35,40,0.04)] transition-colors">
            <KebabHorizontalIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
