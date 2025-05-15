import React from "react";
import ReactMarkdown from "react-markdown";
import { CodeHighlight } from "./CodeHighlight";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-renderer ${className || ""}`}>
      <ReactMarkdown
        components={{
          // Override code blocks to use our syntax highlighter
          code: ({ className, children, ...props }) => {
            // Extract language from className (format: language-js)
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "text";

            // In React Markdown v10, we need an alternative way to detect inline code
            // For simplicity, let's check content length as a heuristic
            const code = String(children).replace(/\n$/, "");
            const isInline = !code.includes("\n") && code.length < 100;

            // Handle inline code differently than code blocks
            if (isInline) {
              return (
                <code
                  className="bg-gray-100 text-sm px-1 py-0.5 rounded font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // For code blocks, use our highlighter
            return <CodeHighlight code={code} language={language} />;
          },
          // Style for headings
          h1: ({ children }) => (
            <h1 className="text-xl font-semibold my-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold my-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-semibold my-2">{children}</h3>
          ),
          // Style for paragraphs
          p: ({ children }) => <p className="my-2">{children}</p>,
          // Style for lists
          ul: ({ children }) => (
            <ul className="list-disc ml-6 my-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-6 my-2">{children}</ol>
          ),
          // Style for links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
