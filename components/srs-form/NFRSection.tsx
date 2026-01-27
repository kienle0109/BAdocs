'use client';

import { type NonFunctionalRequirement, createEmptyNFR, generateNFRId } from '@/lib/srs-form-utils';

interface NFRSectionProps {
    nfrs: NonFunctionalRequirement[];
    onChange: (nfrs: NonFunctionalRequirement[]) => void;
}

const categories = [
    'Performance',
    'Security',
    'Usability',
    'Reliability',
    'Scalability',
    'Maintainability',
    'Compatibility',
] as const;

export function NFRSection({ nfrs, onChange }: NFRSectionProps) {
    const addNFR = () => {
        const newNFR = createEmptyNFR();
        newNFR.id = generateNFRId(nfrs);
        onChange([...nfrs, newNFR]);
    };

    const updateNFR = (index: number, updates: Partial<NonFunctionalRequirement>) => {
        const updated = [...nfrs];
        updated[index] = { ...updated[index], ...updates };
        onChange(updated);
    };

    const removeNFR = (index: number) => {
        onChange(nfrs.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Non-Functional Requirements
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        Define quality attributes like performance, security, and usability
                    </p>
                </div>
                <button
                    onClick={addNFR}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add NFR
                </button>
            </div>

            {nfrs.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10 border-dashed">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h4 className="text-white font-medium mb-2">No NFRs defined</h4>
                    <p className="text-gray-400 text-sm mb-4">Add requirements for performance, security, etc.</p>
                    <button
                        onClick={addNFR}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 cursor-pointer"
                    >
                        Add First NFR
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {nfrs.map((nfr, index) => (
                        <div key={nfr.id} className="bg-white/5 rounded-lg p-5 border border-white/10 hover:border-white/20 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-xs text-gray-500 font-mono">{nfr.id}</span>
                                <button
                                    onClick={() => removeNFR(index)}
                                    className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer p-1"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={nfr.category}
                                        onChange={(e) => updateNFR(index, { category: e.target.value as NonFunctionalRequirement['category'] })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                    <select
                                        value={nfr.priority}
                                        onChange={(e) => updateNFR(index, { priority: e.target.value as NonFunctionalRequirement['priority'] })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        <option value="High" className="bg-slate-800">High</option>
                                        <option value="Medium" className="bg-slate-800">Medium</option>
                                        <option value="Low" className="bg-slate-800">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Metric</label>
                                    <input
                                        type="text"
                                        value={nfr.metric || ''}
                                        onChange={(e) => updateNFR(index, { metric: e.target.value })}
                                        placeholder="e.g. Response time"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <input
                                        type="text"
                                        value={nfr.description}
                                        onChange={(e) => updateNFR(index, { description: e.target.value })}
                                        placeholder="The system shall..."
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Target</label>
                                    <input
                                        type="text"
                                        value={nfr.target || ''}
                                        onChange={(e) => updateNFR(index, { target: e.target.value })}
                                        placeholder="e.g. < 2 seconds"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Common NFR Templates */}
            {nfrs.length === 0 && (
                <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                    <h4 className="text-blue-300 font-medium text-sm mb-2">Common NFR Templates</h4>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { category: 'Performance', description: 'Response time under 2 seconds', metric: 'Response Time', target: '< 2s' },
                            { category: 'Security', description: 'Data encryption at rest and in transit', metric: 'Encryption', target: 'AES-256' },
                            { category: 'Usability', description: 'Mobile responsive design', metric: 'Device Support', target: '320px+' },
                            { category: 'Reliability', description: 'System uptime 99.9%', metric: 'Availability', target: '99.9%' },
                        ].map((template) => (
                            <button
                                key={template.description}
                                onClick={() => {
                                    const newNFR = createEmptyNFR();
                                    newNFR.id = generateNFRId(nfrs);
                                    newNFR.category = template.category as NonFunctionalRequirement['category'];
                                    newNFR.description = template.description;
                                    newNFR.metric = template.metric;
                                    newNFR.target = template.target;
                                    onChange([...nfrs, newNFR]);
                                }}
                                className="px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 rounded-full text-sm transition-colors cursor-pointer"
                            >
                                + {template.category}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
