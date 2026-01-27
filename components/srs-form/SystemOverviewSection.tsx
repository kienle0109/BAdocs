'use client';

import { type SRSFormData } from '@/lib/srs-form-utils';

interface SystemOverviewSectionProps {
    data: SRSFormData;
    onChange: (data: SRSFormData) => void;
}

export function SystemOverviewSection({ data, onChange }: SystemOverviewSectionProps) {
    const updateDocumentInfo = (field: string, value: string) => {
        onChange({
            ...data,
            documentInfo: { ...data.documentInfo, [field]: value },
        });
    };

    const updateSystemOverview = (field: string, value: string) => {
        onChange({
            ...data,
            systemOverview: { ...data.systemOverview, [field]: value },
        });
    };

    return (
        <div className="space-y-8">
            {/* Document Information */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Document Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Project Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.documentInfo.projectName}
                            onChange={(e) => updateDocumentInfo('projectName', e.target.value)}
                            placeholder="e.g. E-Commerce Platform"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Project Code
                        </label>
                        <input
                            type="text"
                            value={data.documentInfo.projectCode || ''}
                            onChange={(e) => updateDocumentInfo('projectCode', e.target.value)}
                            placeholder="e.g. ECOM-2026"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Prepared By <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.documentInfo.preparedBy}
                            onChange={(e) => updateDocumentInfo('preparedBy', e.target.value)}
                            placeholder="Your name"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Version
                            </label>
                            <input
                                type="text"
                                value={data.documentInfo.version}
                                onChange={(e) => updateDocumentInfo('version', e.target.value)}
                                placeholder="1.0"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={data.documentInfo.date}
                                onChange={(e) => updateDocumentInfo('date', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Purpose & Scope */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Purpose & Scope
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Purpose <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={data.systemOverview.purpose}
                            onChange={(e) => updateSystemOverview('purpose', e.target.value)}
                            placeholder="Describe the purpose of this SRS document and the system it specifies..."
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Scope <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={data.systemOverview.scope}
                            onChange={(e) => updateSystemOverview('scope', e.target.value)}
                            placeholder="Define the scope boundary of the system - what it includes and excludes..."
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            System Context
                        </label>
                        <textarea
                            value={data.systemOverview.systemContext || ''}
                            onChange={(e) => updateSystemOverview('systemContext', e.target.value)}
                            placeholder="Describe how the system fits into the larger environment, external systems, and integrations..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Tip Box */}
            <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="text-blue-300 font-medium text-sm">Tip</h4>
                        <p className="text-gray-400 text-sm mt-1">
                            A clear Purpose and Scope help the AI generate more relevant Use Cases. Be specific about what the system should do.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
