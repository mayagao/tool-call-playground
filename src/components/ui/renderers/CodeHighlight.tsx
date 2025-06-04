import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeHighlightProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeHighlight({
  code,
  language = "javascript",
  className,
}: CodeHighlightProps) {
  // Try to auto-detect language if not provided explicitly
  const detectedLanguage = detectLanguage(code, language);

  return (
    <div className={`rounded overflow-hidden ${className || ""}`}>
      <SyntaxHighlighter
        language={detectedLanguage}
        style={vs}
        customStyle={{ margin: 0, borderRadius: "4px" }}
        codeTagProps={{ className: "text-sm" }}
        showLineNumbers
        lineNumberStyle={{
          color: "#6b7280",
          marginRight: "16px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// Function to detect language from code if not specified
function detectLanguage(code: string, fallback: string): string {
  // Check for common language markers
  if (code.includes("<html") || code.includes("<!DOCTYPE html")) return "html";
  if (code.includes("<?php")) return "php";
  if (
    code.includes("import React") ||
    code.includes("import { ") ||
    code.includes("export default")
  )
    return "jsx";
  if (
    code.includes("def ") &&
    code.includes("end") &&
    !code.includes("function")
  )
    return "ruby";
  if (code.includes("package ") && code.includes("public class")) return "java";
  if (code.includes("using System;") || code.includes("namespace "))
    return "csharp";
  if (code.includes("func ") && code.includes("package main")) return "go";
  if (
    code.includes("#include <") &&
    (code.includes("int main(") || code.includes("void main("))
  )
    return "cpp";

  // Check for shell commands
  if (
    code.startsWith("$ ") ||
    code.startsWith("# ") ||
    code.includes("\n$ ") ||
    code.includes("\n# ")
  )
    return "bash";

  // Return the fallback language if no detection
  return fallback;
}
