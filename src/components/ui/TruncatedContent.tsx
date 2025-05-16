"use client";

import React, { useLayoutEffect } from "react";
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

  // Use a function that can be called whenever we need to check height
  const checkHeight = React.useCallback(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setNeedsTruncation(contentHeight > maxHeight);
    }
  }, [maxHeight]);

  // Check height on mount and when dependencies change
  React.useEffect(() => {
    checkHeight();

    // Re-check if window is resized
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, [maxHeight, children, checkHeight]);

  // Force immediate update with useLayoutEffect after expansion changes
  React.useLayoutEffect(() => {
    // Small delay to ensure the DOM has updated after state change
    const timer = setTimeout(() => {
      checkHeight();
    }, 10);
    return () => clearTimeout(timer);
  }, [isExpanded, checkHeight]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    // Immediate check will be handled by the useLayoutEffect
  };

  return (
    <div className={`relative truncated-content ${className}`}>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{
          maxHeight: isExpanded ? "none" : `${maxHeight}px`,
        }}
      >
        {children}
      </div>

      {needsTruncation && !isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 pt-40 rounded-b-md bg-gradient-to-t from-white via-white/5 to-transparent flex items-end justify-center">
          <button
            onClick={toggleExpanded}
            className="w-full flex items-center justify-center px-4 py-1 text-xs text-gray-400 hover:text-gray-600 rounded-md transition-colors duration-200"
          >
            <ChevronDownIcon className="" />
          </button>
        </div>
      )}

      {needsTruncation && isExpanded && (
        <div className="flex justify-center mt-1">
          <button
            onClick={toggleExpanded}
            className="flex items-center px-2 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
          >
            <ChevronUpIcon className="mr-1" size={14} />
            Show less
          </button>
        </div>
      )}
    </div>
  );
}
