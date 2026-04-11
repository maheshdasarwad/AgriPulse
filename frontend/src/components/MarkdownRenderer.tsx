import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm sm:prose-base prose-green dark:prose-invert max-w-none prose-headings:font-semibold prose-p:leading-relaxed">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
