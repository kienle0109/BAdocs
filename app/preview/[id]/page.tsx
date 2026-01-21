'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface Document {
    id: string;
    type: string;
    title: string;
    markdown: string;
    template: string;
    sourceId: string | null;
    createdAt: string;
    source?: {
        id: string;
        type: string;
        title: string;
    };
    children?: Array<{
        id: string;
        type: string;
        title: string;
    }>;
}

export default function PreviewPage() {
    const params = useParams();
    const router = useRouter();
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [transforming, setTransforming] = useState(false);
    const [aiProvider, setAiProvider] = useState<'ollama' | 'gemini'>('ollama');

    useEffect(() => {
        fetchDocument();
    }, [params.id]);

    const fetchDocument = async () => {
        try {
            const response = await fetch(`/api/documents/${params.id}`);
            const result = await response.json();

            if (result.success) {
                setDocument(result.document);
            }
        } catch (error) {
            console.error('Failed to fetch document:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTransform = async () => {
        if (!document) return;

        setTransforming(true);

        try {
            let endpoint = '';
            let body: any = {
                template: document.template,
                aiProvider,
            };

            if (document.type === 'BRD') {
                endpoint = '/api/transform/brd-to-srs';
                body.brdId = document.id;
            } else if (document.type === 'SRS') {
                endpoint = '/api/transform/srs-to-frd';
                body.srsId = document.id;
            } else {
                alert('Cannot transform FRD further');
                setTransforming(false);
                return;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.success) {
                router.push(`/preview/${result.document.id}`);
            } else {
                alert(`Transformation failed: ${result.error}`);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setTransforming(false);
        }
    };

    const handleExport = () => {
        window.open(`/api/documents/${document?.id}/export`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Document not found</div>
            </div>
        );
    }

    const nextDocType = document.type === 'BRD' ? 'SRS' : document.type === 'SRS' ? 'FRD' : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="inline-block px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium mb-2">
                                {document.type} | {document.template}
                            </span>
                            <h1 className="text-4xl font-bold text-white">
                                {document.title}
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Created: {new Date(document.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        {nextDocType && (
                            <>
                                <select
                                    value={aiProvider}
                                    onChange={(e) => setAiProvider(e.target.value as 'ollama' | 'gemini')}
                                    className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-white/20"
                                >
                                    <option value="ollama">Ollama (Local)</option>
                                    <option value="gemini">Gemini Free</option>
                                </select>
                                <button
                                    onClick={handleTransform}
                                    disabled={transforming}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                                >
                                    {transforming ? 'Transforming...' : `Transform to ${nextDocType}`}
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleExport}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                        >
                            Export Markdown
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>

                {/* Document Chain */}
                {(document.source || (document.children && document.children.length > 0)) && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 mb-6">
                        <h3 className="text-white font-medium mb-2">Document Chain</h3>
                        <div className="flex items-center gap-2 text-sm">
                            {document.source && (
                                <>
                                    <a
                                        href={`/preview/${document.source.id}`}
                                        className="text-blue-400 hover:underline"
                                    >
                                        {document.source.type}
                                    </a>
                                    <span className="text-gray-400">→</span>
                                </>
                            )}
                            <span className="text-purple-400 font-medium">{document.type} (Current)</span>
                            {document.children && document.children.length > 0 && (
                                <>
                                    <span className="text-gray-400">→</span>
                                    {document.children.map((child, i) => (
                                        <a
                                            key={child.id}
                                            href={`/preview/${child.id}`}
                                            className="text-green-400 hover:underline"
                                        >
                                            {child.type}
                                        </a>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Document Content */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/20">
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{document.markdown}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
