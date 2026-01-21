'use client';

import { Risk, generateId } from '@/lib/brd-form-utils';

interface RisksSectionProps {
    risks: Risk[];
    onChange: (risks: Risk[]) => void;
}

const IMPACT_LEVELS = ['High', 'Medium', 'Low'] as const;
const PROBABILITY_LEVELS = ['High', 'Medium', 'Low'] as const;

export function RisksSection({ risks, onChange }: RisksSectionProps) {
    const addRisk = () => {
        const newRisk: Risk = {
            id: generateId(),
            description: '',
            impact: 'Medium',
            probability: 'Medium',
            mitigation: '',
        };
        onChange([...risks, newRisk]);
    };

    const updateRisk = (id: string, field: keyof Risk, value: any) => {
        const updated = risks.map(risk =>
            risk.id === id ? { ...risk, [field]: value } : risk
        );
        onChange(updated);
    };

    const removeRisk = (id: string) => {
        const updated = risks.filter(risk => risk.id !== id);
        onChange(updated);
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Section 8: Identified Risks <span className="text-gray-400 text-sm">(Optional)</span>
            </h3>

            <div>
                <label className="block text-white text-sm font-medium mb-3">
                    Risk Register
                </label>

                {risks.length > 0 && (
                    <div className="space-y-4 mb-4">
                        {risks.map((risk) => (
                            <div key={risk.id} className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                                <div className="space-y-3">
                                    {/* Risk Description */}
                                    <div>
                                        <label className="block text-white text-xs font-medium mb-1">
                                            Risk Description
                                        </label>
                                        <input
                                            type="text"
                                            value={risk.description}
                                            onChange={(e) => updateRisk(risk.id, 'description', e.target.value)}
                                            placeholder="e.g., Third-party API may not be available"
                                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>

                                    {/* Impact & Probability */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-white text-xs font-medium mb-1">
                                                Impact
                                            </label>
                                            <select
                                                value={risk.impact}
                                                onChange={(e) => updateRisk(risk.id, 'impact', e.target.value)}
                                                className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                {IMPACT_LEVELS.map(level => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-white text-xs font-medium mb-1">
                                                Probability
                                            </label>
                                            <select
                                                value={risk.probability}
                                                onChange={(e) => updateRisk(risk.id, 'probability', e.target.value)}
                                                className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                {PROBABILITY_LEVELS.map(level => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Mitigation */}
                                    <div>
                                        <label className="block text-white text-xs font-medium mb-1">
                                            Mitigation Strategy
                                        </label>
                                        <textarea
                                            value={risk.mitigation}
                                            onChange={(e) => updateRisk(risk.id, 'mitigation', e.target.value)}
                                            placeholder="How will we mitigate or respond to this risk?"
                                            rows={2}
                                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>

                                    {/* Remove Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => removeRisk(risk.id)}
                                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition text-sm"
                                        >
                                            Remove Risk
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={addRisk}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm"
                >
                    + Add Risk
                </button>
            </div>
        </div>
    );
}
