'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Document {
    id: string;
    type: 'BRD' | 'SRS' | 'FRD';
    title: string;
    template: string;
    sourceId: string | null;
    createdAt: string;
    updatedAt: string;
}

const TYPE_COLORS = {
    BRD: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500/30' },
    SRS: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500/30' },
    FRD: { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-500/30' },
};

export default function HistoryPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'BRD' | 'SRS' | 'FRD'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, [activeFilter, searchQuery]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeFilter !== 'ALL') {
                params.set('type', activeFilter);
            }
            if (searchQuery.trim()) {
                params.set('search', searchQuery.trim());
            }

            const response = await fetch(`/api/documents?${params.toString()}`);
            const result = await response.json();

            if (result.success) {
                setDocuments(result.documents);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filterButtons: Array<{ label: string; value: 'ALL' | 'BRD' | 'SRS' | 'FRD' }> = [
        { label: 'All', value: 'ALL' },
        { label: 'BRD', value: 'BRD' },
        { label: 'SRS', value: 'SRS' },
        { label: 'FRD', value: 'FRD' },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4 cursor-pointer"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </Link>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Document History
                        </h1>
                        <p className="text-gray-400">
                            View and manage your generated documents
                        </p>
                    </div>
                    <Link
                        href="/new"
                        className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all cursor-pointer"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New BRD
                    </Link>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                    {/* Type Filter Tabs */}
                    <div className="flex gap-2">
                        {filterButtons.map((btn) => (
                            <button
                                key={btn.value}
                                onClick={() => setActiveFilter(btn.value)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${activeFilter === btn.value
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Document List */}
                {loading ? (
                    // Loading Skeleton
                    <div className="grid gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 animate-pulse">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-6 bg-white/20 rounded"></div>
                                        <div className="w-64 h-6 bg-white/20 rounded"></div>
                                    </div>
                                    <div className="w-24 h-10 bg-white/20 rounded-lg"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : documents.length === 0 ? (
                    // Empty State
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
                        <p className="text-gray-400 mb-6">
                            {searchQuery || activeFilter !== 'ALL'
                                ? 'Try adjusting your filters or search query'
                                : 'Create your first BRD to get started'}
                        </p>
                        <Link
                            href="/new"
                            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all cursor-pointer"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New BRD
                        </Link>
                    </div>
                ) : (
                    // Document Cards
                    <div className="grid gap-4">
                        {documents.map((doc) => {
                            const colors = TYPE_COLORS[doc.type];
                            return (
                                <div
                                    key={doc.id}
                                    className={`bg-white/10 backdrop-blur-lg rounded-lg p-6 border ${colors.border} hover:bg-white/15 transition-all group`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start md:items-center gap-4">
                                            {/* Type Badge */}
                                            <span className={`px-3 py-1 ${colors.bg} text-white text-sm font-medium rounded-md`}>
                                                {doc.type}
                                            </span>

                                            {/* Document Info */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                                                    {doc.title}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                                    <span className="inline-flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        {doc.template}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="inline-flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDate(doc.createdAt)}
                                                    </span>
                                                    {doc.sourceId && (
                                                        <>
                                                            <span>•</span>
                                                            <span className={colors.text}>Transformed</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* View Button */}
                                        <Link
                                            href={`/preview/${doc.id}`}
                                            className="inline-flex items-center px-5 py-2 bg-white/10 hover:bg-purple-600 text-white rounded-lg font-medium transition-all cursor-pointer"
                                        >
                                            View
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Document Count */}
                {!loading && documents.length > 0 && (
                    <div className="mt-6 text-center text-gray-400 text-sm">
                        Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </main>
    );
}
