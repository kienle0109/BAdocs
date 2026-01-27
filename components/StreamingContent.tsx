import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface StreamingContentProps {
    content: string;
    isStreaming: boolean;
    error?: string | null;
}

export function StreamingContent({ content, isStreaming, error }: StreamingContentProps) {
    const [loadingText, setLoadingText] = useState('AI is thinking');

    useEffect(() => {
        if (!isStreaming || content.length > 0) return;

        const interval = setInterval(() => {
            setLoadingText(prev => {
                if (prev.endsWith('...')) return 'AI is thinking';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(interval);
    }, [isStreaming, content]);

    if (error) {
        return (
            <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200">
                <p className="font-semibold">Generation Error:</p>
                <p>{error}</p>
            </div>
        );
    }

    if (isStreaming && content.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-4"></div>
                <p>{loadingText}</p>
            </div>
        );
    }

    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            >
                {content}
            </ReactMarkdown>
            {isStreaming && (
                <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse" />
            )}
        </div>
    );
}
