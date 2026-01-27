// app/frd/from-srs/page.tsx
'use client';

// Reuse the Focus Mode layout logic from /srs/from-brd
// Note: In a real refactor, we should extract the layout to a reusable component
// For now, I will replicate the structure for the FRD transformation flow

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { StreamingContent } from '@/components/StreamingContent';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';

// Temporary Mock List (would be SRS List)
// We will reuse BRDList style but for SRS documents
// To avoid duplication, I'm inline styling strictly for this file to ensure it works
// without needing a separate 'SRSList' component right now, though one should be made.

interface Document {
    id: string;
    title: string;
    template: string;
    createdAt: string;
}

export default function FromSRSPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Config
    const [template, setTemplate] = useState<'IEEE' | 'IIBA'>('IEEE');
    const [sdlc, setSdlc] = useState<'waterfall' | 'agile'>('waterfall');
    const [aiProvider, setAiProvider] = useState<'gemini' | 'ollama'>('gemini');
    const [language, setLanguage] = useState<'en' | 'vi'>('en');

    // Streaming
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamContent, setStreamContent] = useState('');

    useEffect(() => {
        // Fetch SRS documents
        fetch('/api/documents?type=SRS')
            .then(res => res.json())
            .then(data => {
                if (data.success) setDocuments(data.documents);
            });
    }, []);

    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGenerate = async () => {
        if (!selectedId) return;
        setGenerating(true);
        setIsStreaming(true);
        setStreamContent('');

        // Simulating Stream for now as per previous pattern
        // In real execution, call /api/transform/srs-to-frd/stream
        try {
            const response = await fetch('/api/transform/srs-to-frd/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    srsId: selectedId,
                    template, sdlc, aiProvider, language
                })
            });

            // Handle stream logic (simplified reuse)
            if (!response.body) throw new Error("No stream");
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
                            if (data.content) setStreamContent(prev => prev + data.content);
                            if (data.documentId) documentId = data.documentId;
                        } catch (e) { }
                    }
                }
            }
            if (documentId) router.push(`/preview/${documentId}`);

        } catch (e) {
            console.error(e);
            setIsStreaming(false);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="h-screen bg-slate-950 flex flex-col text-slate-200 overflow-hidden font-sans">
            <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/frd" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <nav className="flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
                        <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <Link href="/frd" className="hover:text-slate-300 transition-colors">FRD</Link>
                        <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-slate-200 font-medium">Transform</span>
                    </nav>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 flex flex-col relative min-w-0 bg-slate-950">
                    <div className="px-8 pt-8 pb-4">
                        <div className="max-w-3xl mx-auto w-full">
                            <h1 className="text-2xl font-bold text-white mb-2">Select Source SRS</h1>
                            <p className="text-slate-400 mb-6">Choose a System Requirement Spec to generate functional details.</p>
                            <div className="relative group">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search SRS..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-32">
                        <div className="max-w-3xl mx-auto w-full grid grid-cols-1 gap-3">
                            {filteredDocuments.map(doc => (
                                <button
                                    key={doc.id}
                                    onClick={() => setSelectedId(doc.id)}
                                    className={`group flex items-center gap-4 w-full p-4 rounded-xl text-left border transition-all duration-200 ${selectedId === doc.id
                                        ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                                        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className={`p-3 rounded-lg transition-colors ${selectedId === doc.id
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                                        }`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-base font-semibold truncate transition-colors ${selectedId === doc.id ? 'text-white' : 'text-slate-200'}`}>{doc.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700">{doc.template}</span>
                                        </div>
                                    </div>
                                    {selectedId === doc.id && (
                                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                </main>

                <aside className="w-80 border-l border-slate-800 bg-slate-900/30 overflow-y-auto custom-scrollbar">
                    <div className="p-5">
                        <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                            Configuration
                        </h2>
                        <ConfigurationPanel
                            template={template} setTemplate={setTemplate}
                            sdlc={sdlc} setSdlc={setSdlc}
                            aiProvider={aiProvider} setAiProvider={setAiProvider}
                            language={language} setLanguage={setLanguage}
                            onGenerate={handleGenerate}
                            isGenerating={generating}
                            isGenerateEnabled={!!selectedId && !generating}
                            generateLabel="Generate FRD Document"
                        />
                    </div>
                </aside>
            </div>

            {isStreaming && (
                <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-white font-semibold">Generating FRD...</h3>
                            <button onClick={() => setIsStreaming(false)} className="text-slate-500 hover:text-white">Close</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <StreamingContent content={streamContent} isStreaming={true} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
