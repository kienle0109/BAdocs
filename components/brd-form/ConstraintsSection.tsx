'use client';

import { Constraints } from '@/lib/brd-form-utils';

interface ConstraintsSectionProps {
    data: Constraints;
    onChange: (data: Constraints) => void;
    errors?: { [key: string]: string };
}

export function ConstraintsSection({ data, onChange, errors = {} }: ConstraintsSectionProps) {
    const handleChange = (field: keyof Constraints, value: string | string[]) => {
        onChange({ ...data, [field]: value });
    };

    const handleListChange = (field: 'assumptions' | 'dependencies', index: number, value: string) => {
        const list = data[field] || [];
        const newList = [...list];
        newList[index] = value;
        onChange({ ...data, [field]: newList });
    };

    const addListItem = (field: 'assumptions' | 'dependencies') => {
        const list = data[field] || [];
        onChange({ ...data, [field]: [...list, ''] });
    };

    const removeListItem = (field: 'assumptions' | 'dependencies', index: number) => {
        const list = data[field] || [];
        const newList = list.filter((_, i) => i !== index);
        onChange({ ...data, [field]: newList });
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Section 6: Constraints & Assumptions
            </h3>

            <div className="space-y-4">
                {/* Budget */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Budget Constraints <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.budget}
                        onChange={(e) => handleChange('budget', e.target.value)}
                        placeholder="e.g., $500,000 maximum or Budget range: $300K - $500K"
                        className={`w-full bg-slate-900/50 text-white border ${errors.budget ? 'border-red-500' : 'border-white/20'
                            } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    {errors.budget && (
                        <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
                    )}
                </div>

                {/* Timeline */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Timeline Constraints <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.timeline}
                        onChange={(e) => handleChange('timeline', e.target.value)}
                        placeholder="e.g., Must launch by Q3 2026 or 6 months from approval"
                        className={`w-full bg-slate-900/50 text-white border ${errors.timeline ? 'border-red-500' : 'border-white/20'
                            } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    {errors.timeline && (
                        <p className="text-red-400 text-sm mt-1">{errors.timeline}</p>
                    )}
                </div>

                {/* Technical Constraints */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Technical Constraints
                    </label>
                    <textarea
                        value={data.technical || ''}
                        onChange={(e) => handleChange('technical', e.target.value)}
                        placeholder="e.g., Must integrate with existing Oracle database, Must support IE11"
                        rows={3}
                        className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* Resource Constraints */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Resource Constraints
                    </label>
                    <textarea
                        value={data.resources || ''}
                        onChange={(e) => handleChange('resources', e.target.value)}
                        placeholder="e.g., Limited to 3 developers, No access to production until testing complete"
                        rows={3}
                        className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* Key Assumptions */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Key Assumptions
                    </label>
                    {(data.assumptions || []).map((assumption, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={assumption}
                                onChange={(e) => handleListChange('assumptions', index, e.target.value)}
                                placeholder={`Assumption ${index + 1}`}
                                className="flex-1 bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={() => removeListItem('assumptions', index)}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => addListItem('assumptions')}
                        className="mt-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm"
                    >
                        + Add Assumption
                    </button>
                </div>

                {/* Dependencies */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Dependencies
                    </label>
                    {(data.dependencies || []).map((dependency, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={dependency}
                                onChange={(e) => handleListChange('dependencies', index, e.target.value)}
                                placeholder={`Dependency ${index + 1}`}
                                className="flex-1 bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={() => removeListItem('dependencies', index)}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => addListItem('dependencies')}
                        className="mt-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm"
                    >
                        + Add Dependency
                    </button>
                </div>
            </div>
        </div>
    );
}
