"use client";

import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@primer/octicons-react";

interface TruncatedContentProps {
  children: React.ReactNode;
  maxHeight?: number;
  className?: string;
  defaultExpanded?: boolean;
}

export function TruncatedContent({
  children,
  maxHeight = 200,
  className = "",
  defaultExpanded = false,
}: TruncatedContentProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [needsTruncation, setNeedsTruncation] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Check if content exceeds max height and needs truncation
    const checkHeight = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        setNeedsTruncation(contentHeight > maxHeight);
      }
    };

    checkHeight();

    // Re-check if window is resized
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, [maxHeight, children]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{
          maxHeight: isExpanded ? "none" : `${maxHeight}px`,
        }}
      >
        {children}
      </div>

      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 pt-40 rounded-b-md bg-gradient-to-t from-white via-white/5 to-transparent flex items-end justify-center">
          <button
            onClick={toggleExpanded}
            className="w-full flex items-center justify-center px-4 py-1 text-xs text-gray-400 hover:text-gray-600 rounded-md transition-colors duration-200"
          >
            <ChevronDownIcon className="" />
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="flex justify-center mt-1">
          <button
            onClick={toggleExpanded}
            className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-800 rounded transition-colors duration-200"
          >
            <ChevronUpIcon className="mb-1" />
          </button>
        </div>
      )}
    </div>
  );
}
