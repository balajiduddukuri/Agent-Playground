import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
  filePath: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>('Loading...');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Failed to load file');
        const text = await response.text();
        setContent(text);
      } catch (error) {
        setContent(`Error loading file: ${filePath}`);
      }
    };
    fetchContent();
  }, [filePath]);

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};
