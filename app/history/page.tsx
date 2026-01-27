// app/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';

interface Document {
    id: string;
    type: 'BRD' | 'SRS' | 'FRD';
    title: string;
    createdAt: string;
    status: 'Draft' | 'Final';
}

export default function HistoryPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Mock data fetch - replace with actual API
        fetch('/api/documents')
            .then(res => res.json())
            .then(data => {
                if (data.success) setDocuments(data.documents);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'BRD': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'SRS': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'FRD': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="h-screen bg-slate-950 flex flex-col font-sans">
            <Header showBack backHref="/" title="Document History" />

            <main className="flex-1 overflow-y-auto px-6 py-8">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <div>
                            <h1 className="text-xl font-bold text-white">All Documents</h1>
                            <p className="text-slate-400 text-sm">Manage and preview your generated specifications</p>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-slate-800">
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Name</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Created</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-slate-600 border-t-white rounded-full animate-spin"></div>
                                                Loading...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredDocs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">
                                            No documents found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDocs.map((doc) => (
                                        <tr key={doc.id} className="group hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4">
                                                <Link href={`/preview/${doc.id}`} className="font-medium text-slate-200 hover:text-indigo-400 transition-colors block">
                                                    {doc.title}
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs border ${getTypeColor(doc.type)}`}>
                                                    {doc.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-slate-400">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Link
                                                    href={`/preview/${doc.id}`}
                                                    className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                                                >
                                                    View
                                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    );
}
