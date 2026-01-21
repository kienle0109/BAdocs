'use client';

import { Scope } from '@/lib/brd-form-utils';

interface ScopeSectionProps {
    data: Scope;
    onChange: (data: Scope) => void;
    errors?: { [key: string]: string };
}

const SYSTEM_OPTIONS = [
    'Web Application',
    'Mobile App (iOS)',
    'Mobile App (Android)',
    'Database',
    'API/Integration Layer',
    'Third-party Systems',
    'ERP System',
    'CRM System',
];

export function ScopeSection({ data, onChange, errors = {} }: ScopeSectionProps) {
    const handleListChange = (field: 'inScope' | 'outScope' | 'features', index: number, value: string) => {
        const newList = [...data[field]];
        newList[index] = value;
        onChange({ ...data, [field]: newList });
    };

    const addListItem = (field: 'inScope' | 'outScope' | 'features') => {
        onChange({ ...data, [field]: [...data[field], ''] });
    };

    const removeListItem = (field: 'inScope' | 'outScope' | 'features', index: number) => {
        const newList = data[field].filter((_, i) => i !== index);
        onChange({ ...data, [field]: newList.length > 0 ? newList : [''] });
    };

    const toggleSystem = (system: string) => {
        const newSystems = data.systems.includes(system)
            ? data.systems.filter(s => s !== system)
            : [...data.systems, system];
        onChange({ ...data, systems: newSystems });
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📦</span>
                Section 5: Scope Definition
            </h3>

            <div className="space-y-6">
                {/* In Scope */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        In Scope <span className="text-red-400">*</span>
                        <span className="text-gray-400 text-xs ml-2">(minimum 2 items)</span>
                    </label>
                    {data.inScope.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleListChange('inScope', index, e.target.value)}
                                placeholder={`Item ${index + 1}: e.g., Web application rebuild`}
                                className="flex-1 bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {data.inScope.length > 1 && (
                                <button
                                    onClick={() => removeListItem('inScope', index)}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => addListItem('inScope')}
                        className="mt-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm"
                    >
                        + Add Item
                    </button>
                    {errors.inScope && (
                        <p className="text-red-400 text-sm mt-2">{errors.inScope}</p>
                    )}
                </div>

                {/* Out of Scope */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Out of Scope <span className="text-red-400">*</span>
                        <span className="text-gray-400 text-xs ml-2">(minimum 1 item)</span>
                    </label>
                    {data.outScope.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleListChange('outScope', index, e.target.value)}
                                placeholder={`Item ${index + 1}: e.g., Legacy system migration`}
                                className="flex-1 bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {data.outScope.length > 1 && (
                                <button
                                    onClick={() => removeListItem('outScope', index)}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => addListItem('outScope')}
                        className="mt-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm"
                    >
                        + Add Item
                    </button>
                    {errors.outScope && (
                        <p className="text-red-400 text-sm mt-2">{errors.outScope}</p>
                    )}
                </div>

                {/* Key Features */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Key Features/Capabilities <span className="text-red-400">*</span>
                        <span className="text-gray-400 text-xs ml-2">(minimum 2 features)</span>
                    </label>
                    {data.features.map((feature, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleListChange('features', index, e.target.value)}
                                placeholder={`Feature ${index + 1}: e.g., Product catalog management`}
                                className="flex-1 bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {data.features.length > 1 && (
                                <button
                                    onClick={() => removeListItem('features', index)}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => addListItem('features')}
                        className="mt-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm"
                    >
                        + Add Feature
                    </button>
                    {errors.features && (
                        <p className="text-red-400 text-sm mt-2">{errors.features}</p>
                    )}
                </div>

                {/* Affected Systems */}
                <div>
                    <label className="block text-white text-sm font-medium mb-3">
                        Affected Systems
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {SYSTEM_OPTIONS.map(system => (
                            <button
                                key={system}
                                onClick={() => toggleSystem(system)}
                                className={`p-3 rounded-lg border-2 transition text-sm ${data.systems.includes(system)
                                        ? 'border-purple-500 bg-purple-500/20 text-white'
                                        : 'border-white/20 text-gray-400 hover:border-white/40'
                                    }`}
                            >
                                {system}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
