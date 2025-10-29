"use client";

import ReactMarkdown from "react-markdown";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      className="prose prose-sm max-w-none dark:prose-invert"
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        code: ({ children, className }) => {
          const isInline = !className;
          return isInline ? (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
              {children}
            </code>
          ) : (
            <code className={className}>{children}</code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
