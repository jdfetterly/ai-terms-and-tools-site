'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeSanitize as any]}
      components={{
        a: ({ node, ...props }) => (
          <a
            {...props}
            className="text-accent-foreground hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
        code: ({ node, inline, className, ...props }: any) => (
          <code
            {...props}
            className={`font-code bg-muted text-foreground rounded text-sm ${inline ? 'px-1.5 py-0.5' : 'p-2 block overflow-x-auto'}`}
          />
        ),
        strong: ({ node, ...props }) => <strong {...props} className="font-semibold" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
