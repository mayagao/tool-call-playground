"use client";

import React from "react";

interface ToolCallContainerProps {
  children: React.ReactNode;
}

export function ToolCallContainer({ children }: ToolCallContainerProps) {
  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto mt-8 mb-8 border border-gray-200 rounded-lg">
      {children}
    </div>
  );
}
