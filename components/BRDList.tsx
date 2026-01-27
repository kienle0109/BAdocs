import React from 'react';

interface BRDDocument {
    id: string;
    title: string;
    template: string;
    createdAt: string;
}

interface BRDListProps {
    documents: BRDDocument[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    loading: boolean;
    searchQuery: string;
}

export function BRDList({ documents, selectedId, onSelect, loading, searchQuery }: BRDListProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-slate-500 animate-pulse text-sm">Loading documents...</p>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-800 mx-auto max-w-md m-auto">
                <div className="w-16 h-16 mb-4 rounded-xl bg-slate-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Documents Found</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    {searchQuery ? 'We couldn\'t find any BRDs matching your search.' : 'You haven\'t created any Business Requirement Documents yet.'}
                </p>
                <a
                    href="/new"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors text-sm"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New BRD
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            {documents.map((doc) => {
                const isSelected = selectedId === doc.id;
                return (
                    <button
                        key={doc.id}
                        onClick={() => onSelect(doc.id)}
                        className={`group flex items-center gap-4 w-full p-4 rounded-xl text-left border transition-all duration-200 ${isSelected
                                ? 'bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                            }`}
                    >
                        {/* Icon */}
                        <div className={`p-3 rounded-lg transition-colors ${isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                            }`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-base font-semibold truncate transition-colors ${isSelected ? 'text-white' : 'text-slate-200'
                                }`}>
                                {doc.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {formatDate(doc.createdAt)}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${isSelected
                                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                                        : 'bg-slate-800 border-slate-700 text-slate-500'
                                    }`}>
                                    {doc.template}
                                </span>
                            </div>
                        </div>

                        {/* Indication Arrow */}
                        <div className={`transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                            <svg className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
