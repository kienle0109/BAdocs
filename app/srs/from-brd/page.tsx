'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { BRDList } from '@/components/BRDList';
import { StreamingContent } from '@/components/StreamingContent';
import { Header } from '@/components/Header';

interface BRDDocument {
    id: string;
    title: string;
    template: string;
    createdAt: string;
}

export default function FromBRDPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState<BRDDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrd, setSelectedBrd] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Configuration State
    const [template, setTemplate] = useState<'IEEE' | 'IIBA'>('IEEE');
    const [sdlc, setSdlc] = useState<'waterfall' | 'agile'>('waterfall');
    const [aiProvider, setAiProvider] = useState<'gemini' | 'ollama'>('gemini');
    const [language, setLanguage] = useState<'en' | 'vi'>('en');

    // Streaming state
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamContent, setStreamContent] = useState('');

    useEffect(() => {
        fetchBRDs();
    }, []);

    const fetchBRDs = async () => {
        try {
            const response = await fetch('/api/documents?type=BRD');
            const result = await response.json();
            if (result.success) {
                setDocuments(result.documents);
            }
        } catch (error) {
            console.error('Failed to fetch BRDs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGenerate = async () => {
        if (!selectedBrd) return;

        setGenerating(true);
        setIsStreaming(true);
        setStreamContent('');

        try {
            const response = await fetch('/api/transform/brd-to-srs/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brdId: selectedBrd,
                    template,
                    sdlc,
                    aiProvider,
                    language,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Transformation failed');
            }

            if (!response.body) {
                throw new Error('ReadableStream not supported');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let documentId = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));

                            if (data.content) {
                                setStreamContent(prev => prev + data.content);
                            }

                            if (data.error) {
                                throw new Error(data.error);
                            }

                            if (data.completed && data.documentId) {
                                documentId = data.documentId;
                            }
                        } catch (e) {
                            console.error('Error parsing SSE chunk:', e);
                        }
                    }
                }
            }

            if (documentId) {
                setTimeout(() => {
                    router.push(`/preview/${documentId}`);
                }, 1000);
            } else {
                throw new Error('Transformation completed but no document ID returned');
            }

        } catch (error: any) {
            alert(`Error: ${error.message}`);
            setIsStreaming(false);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="h-screen bg-slate-950 flex flex-col text-slate-200 overflow-hidden font-sans">

            {/* 1. Header with Breadcrumbs */}
            <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/srs" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <nav className="flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
                        <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <Link href="/srs" className="hover:text-slate-300 transition-colors">SRS</Link>
                        <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-slate-200 font-medium">Transform</span>
                    </nav>
                </div>
                {/* User Profile or Placeholder */}
                <div className="flex items-center gap-3">
                    {/* <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold ring-1 ring-indigo-500/40">
                        AI
                     </div> */}
                </div>
            </header>

            {/* 2. Main Layout - 2 Columns */}
            <div className="flex-1 flex overflow-hidden">

                {/* Center Content - File Explorer */}
                <main className="flex-1 flex flex-col relative min-w-0 bg-slate-950">

                    {/* Search Bar */}
                    <div className="px-8 pt-8 pb-4">
                        <div className="max-w-3xl mx-auto w-full">
                            <h1 className="text-2xl font-bold text-white mb-2">Select Source BRD</h1>
                            <p className="text-slate-400 mb-6">Choose a document to begin the transformation process.</p>

                            <div className="relative group">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Scrollable File List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-32">
                        <div className="max-w-3xl mx-auto w-full">
                            <BRDList
                                documents={filteredDocuments}
                                selectedId={selectedBrd}
                                onSelect={setSelectedBrd}
                                loading={loading}
                                searchQuery={searchQuery}
                            />
                        </div>
                    </div>

                </main>

                {/* Right Sidebar - Inspector Panel */}
                <aside className="w-80 border-l border-slate-800 bg-slate-900/30 overflow-y-auto custom-scrollbar">
                    <div className="p-5">
                        <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            Configuration
                        </h2>
                        <ConfigurationPanel
                            template={template} setTemplate={setTemplate}
                            sdlc={sdlc} setSdlc={setSdlc}
                            aiProvider={aiProvider} setAiProvider={setAiProvider}
                            language={language} setLanguage={setLanguage}
                            onGenerate={handleGenerate}
                            isGenerating={generating}
                            isGenerateEnabled={!!selectedBrd && !generating}
                            generateLabel="Generate SRS Document"
                        />
                    </div>
                </aside>

            </div>

            {/* Streaming Overlay */}
            {isStreaming && (
                <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                </span>
                                <h3 className="text-white font-semibold">Generating Requirement Specifications...</h3>
                            </div>
                            <button
                                onClick={() => setIsStreaming(false)} // Emergency close
                                className="text-slate-500 hover:text-white"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-950">
                            <StreamingContent content={streamContent} isStreaming={true} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
