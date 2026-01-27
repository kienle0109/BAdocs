import { useState } from 'react';
import { FunctionalRequirement, getNextFRId, FR_CATEGORIES, PRIORITIES, TEMPLATE_FRS } from '@/lib/frd-form-utils';

interface FRSectionProps {
    requirements: FunctionalRequirement[];
    onChange: (requirements: FunctionalRequirement[]) => void;
    errors?: { [key: string]: string };
}

export function FunctionalRequirementsSection({ requirements, onChange, errors }: FRSectionProps) {
    const [expandedFR, setExpandedFR] = useState<string | null>(null);

    const addRequirement = () => {
        const newFR: FunctionalRequirement = {
            id: getNextFRId(requirements),
            name: '',
            category: 'Core',
            description: '',
            priority: 'High',
            source: '',
            acceptanceCriteria: [],
        };
        onChange([...requirements, newFR]);
        setExpandedFR(newFR.id);
    };

    const updateRequirement = (index: number, updated: FunctionalRequirement) => {
        const newRequirements = [...requirements];
        newRequirements[index] = updated;
        onChange(newRequirements);
    };

    const removeRequirement = (index: number) => {
        onChange(requirements.filter((_, i) => i !== index));
    };

    const addFromTemplate = (template: Partial<FunctionalRequirement>) => {
        const newFR: FunctionalRequirement = {
            id: getNextFRId(requirements),
            name: template.name || '',
            category: template.category || 'Core',
            description: template.description || '',
            priority: template.priority || 'High',
            source: '',
            acceptanceCriteria: template.acceptanceCriteria || [],
        };
        onChange([...requirements, newFR]);
        setExpandedFR(newFR.id);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Functional Requirements</h2>
                    <p className="text-gray-400 text-sm">Define what the system must do (FR-001, FR-002, etc.)</p>
                </div>
                <button
                    onClick={addRequirement}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add FR
                </button>
            </div>

            {/* Templates */}
            {requirements.length === 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Quick Start Templates
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                        {TEMPLATE_FRS.map((template, index) => (
                            <button
                                key={index}
                                onClick={() => addFromTemplate(template)}
                                className="p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-left transition-all cursor-pointer"
                            >
                                <div className="font-medium text-white mb-1">{template.name}</div>
                                <div className="text-xs text-gray-400">{template.description?.substring(0, 60)}...</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Requirements List */}
            {requirements.length > 0 && (
                <div className="space-y-4">
                    {requirements.map((fr, index) => (
                        <div
                            key={fr.id}
                            className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
                        >
                            {/* Header */}
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => setExpandedFR(expandedFR === fr.id ? null : fr.id)}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-orange-400 font-mono font-semibold">{fr.id}</span>
                                    <span className="text-white font-medium">{fr.name || 'Untitled Requirement'}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${fr.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                                            fr.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                'bg-green-500/20 text-green-300'
                                        }`}>
                                        {fr.priority}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeRequirement(index);
                                        }}
                                        className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 transition-colors cursor-pointer"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedFR === fr.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedFR === fr.id && (
                                <div className="p-6 border-t border-white/10 space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Requirement Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={fr.name}
                                            onChange={(e) => updateRequirement(index, { ...fr, name: e.target.value })}
                                            placeholder="e.g., User Authentication"
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    {/* Category & Priority */}
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                            <select
                                                value={fr.category}
                                                onChange={(e) => updateRequirement(index, { ...fr, category: e.target.value as any })}
                                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            >
                                                {FR_CATEGORIES.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                            <select
                                                value={fr.priority}
                                                onChange={(e) => updateRequirement(index, { ...fr, priority: e.target.value as any })}
                                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            >
                                                {PRIORITIES.map((pri) => (
                                                    <option key={pri} value={pri}>{pri}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
                                            <input
                                                type="text"
                                                value={fr.source}
                                                onChange={(e) => updateRequirement(index, { ...fr, source: e.target.value })}
                                                placeholder="e.g., UC-001"
                                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Description <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            value={fr.description}
                                            onChange={(e) => updateRequirement(index, { ...fr, description: e.target.value })}
                                            placeholder="Detailed description of what the system must do..."
                                            rows={3}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                        />
                                    </div>

                                    {/* Acceptance Criteria */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Acceptance Criteria</label>
                                        <div className="space-y-2">
                                            {fr.acceptanceCriteria.map((criteria, cIndex) => (
                                                <div key={cIndex} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={criteria}
                                                        onChange={(e) => {
                                                            const newCriteria = [...fr.acceptanceCriteria];
                                                            newCriteria[cIndex] = e.target.value;
                                                            updateRequirement(index, { ...fr, acceptanceCriteria: newCriteria });
                                                        }}
                                                        placeholder="Acceptance criterion"
                                                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newCriteria = fr.acceptanceCriteria.filter((_, i) => i !== cIndex);
                                                            updateRequirement(index, { ...fr, acceptanceCriteria: newCriteria });
                                                        }}
                                                        className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 transition-colors cursor-pointer"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => updateRequirement(index, { ...fr, acceptanceCriteria: [...fr.acceptanceCriteria, ''] })}
                                                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Criterion
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {errors?.['functionalRequirements'] && (
                <p className="text-sm text-red-400">{errors['functionalRequirements']}</p>
            )}
        </div>
    );
}
