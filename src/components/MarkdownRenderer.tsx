'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const processLine = (line: string) => {
    let html = line;
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    // Italic: *text* or _text_
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    // Inline code: `code`
    html = html.replace(/`(.*?)`/g, '<code class="font-code bg-muted text-foreground px-1.5 py-0.5 rounded text-sm">$1</code>');
    // Links: [text](url)
    html = html.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="text-accent-foreground hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return html;
  };
  
  const htmlContent = content
    .split('\n\n') // Split by double newlines for paragraphs
    .map(paragraph => `<p>${paragraph.split('\n').map(processLine).join('<br />')}</p>`) // Process lines within paragraphs
    .join('');


  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default MarkdownRenderer;
