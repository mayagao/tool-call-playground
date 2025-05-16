"use client";

import React from "react";
import { KebabHorizontalIcon } from "@primer/octicons-react";
import Image from "next/image";

interface ToolCallHeaderProps {
  status?: string;
  duration?: string;
  triggeredInfo?: string;
  triggerUser?: string;
}

export function ToolCallHeader({
  status = "In progress",
  duration = "1s",
  triggeredInfo = "Triggered via issue",
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

          <div className="w-20">
            <div className="text-sm text-gray-500 mb-1">Requests</div>
            <div className="font-medium">37</div>
          </div>

          <div className="flex-grow">
            <div className="text-sm text-gray-500 mb-1">{triggeredInfo}</div>
            <div className="flex items-center space-x-2">
              <a
                href={`https://github.com/${triggerUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-blue-600 group"
              >
                <Image
                  src={`https://avatars.githubusercontent.com/${triggerUser}`}
                  alt={`${triggerUser}'s avatar`}
                  width={20}
                  height={20}
                  className="rounded-full"
                  unoptimized
                />
                <div className="font-medium group-hover:text-[#0969da] transition-colors">
                  {triggerUser}
                </div>
              </a>
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
