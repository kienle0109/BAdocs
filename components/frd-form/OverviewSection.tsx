import { OverviewData } from '@/lib/frd-form-utils';

interface OverviewSectionProps {
    data: OverviewData;
    onChange: (data: OverviewData) => void;
    errors?: { [key: string]: string };
}

export function OverviewSection({ data, onChange, errors }: OverviewSectionProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Project Overview</h2>
                <p className="text-gray-400 text-sm">Basic information about the project and FRD document</p>
            </div>

            {/* Project Name & Code */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.projectName}
                        onChange={(e) => onChange({ ...data, projectName: e.target.value })}
                        placeholder="e.g., E-commerce Platform"
                        className={`w-full px-4 py-2 bg-white/10 border ${errors?.['overview.projectName'] ? 'border-red-500' : 'border-white/20'
                            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                    {errors?.['overview.projectName'] && (
                        <p className="mt-1 text-sm text-red-400">{errors['overview.projectName']}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Code <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.projectCode}
                        onChange={(e) => onChange({ ...data, projectCode: e.target.value })}
                        placeholder="e.g., ECOM-2024"
                        className={`w-full px-4 py-2 bg-white/10 border ${errors?.['overview.projectCode'] ? 'border-red-500' : 'border-white/20'
                            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                    {errors?.['overview.projectCode'] && (
                        <p className="mt-1 text-sm text-red-400">{errors['overview.projectCode']}</p>
                    )}
                </div>
            </div>

            {/* Version, Date, Prepared By */}
            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Version</label>
                    <input
                        type="text"
                        value={data.version}
                        onChange={(e) => onChange({ ...data, version: e.target.value })}
                        placeholder="1.0"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input
                        type="date"
                        value={data.date}
                        onChange={(e) => onChange({ ...data, date: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prepared By <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.preparedBy}
                        onChange={(e) => onChange({ ...data, preparedBy: e.target.value })}
                        placeholder="Your name"
                        className={`w-full px-4 py-2 bg-white/10 border ${errors?.['overview.preparedBy'] ? 'border-red-500' : 'border-white/20'
                            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                    {errors?.['overview.preparedBy'] && (
                        <p className="mt-1 text-sm text-red-400">{errors['overview.preparedBy']}</p>
                    )}
                </div>
            </div>

            {/* Purpose */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Purpose <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={data.purpose}
                    onChange={(e) => onChange({ ...data, purpose: e.target.value })}
                    placeholder="Describe the purpose of this FRD document..."
                    rows={3}
                    className={`w-full px-4 py-2 bg-white/10 border ${errors?.['overview.purpose'] ? 'border-red-500' : 'border-white/20'
                        } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none`}
                />
                {errors?.['overview.purpose'] && (
                    <p className="mt-1 text-sm text-red-400">{errors['overview.purpose']}</p>
                )}
            </div>

            {/* Scope */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Scope</label>
                <textarea
                    value={data.scope}
                    onChange={(e) => onChange({ ...data, scope: e.target.value })}
                    placeholder="Define the scope of the system..."
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
            </div>

            {/* Stakeholders */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stakeholders</label>
                <div className="space-y-2">
                    {data.stakeholders.map((stakeholder, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={stakeholder}
                                onChange={(e) => {
                                    const newStakeholders = [...data.stakeholders];
                                    newStakeholders[index] = e.target.value;
                                    onChange({ ...data, stakeholders: newStakeholders });
                                }}
                                placeholder="Stakeholder name"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                onClick={() => {
                                    const newStakeholders = data.stakeholders.filter((_, i) => i !== index);
                                    onChange({ ...data, stakeholders: newStakeholders });
                                }}
                                className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => onChange({ ...data, stakeholders: [...data.stakeholders, ''] })}
                        className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Stakeholder
                    </button>
                </div>
            </div>
        </div>
    );
}
