'use client';

import { Compliance } from '@/lib/brd-form-utils';

interface ComplianceSectionProps {
    data: Compliance;
    onChange: (data: Compliance) => void;
}

const COMPLIANCE_OPTIONS = [
    'GDPR',
    'SOC 2',
    'ISO 27001',
    'HIPAA',
    'PCI-DSS',
    'Industry-specific regulations',
    'None',
];

export function ComplianceSection({ data, onChange }: ComplianceSectionProps) {
    const toggleRequirement = (req: string) => {
        const newReqs = data.requirements.includes(req)
            ? data.requirements.filter(r => r !== req)
            : [...data.requirements, req];
        onChange({ ...data, requirements: newReqs });
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Section 7: Regulatory & Compliance <span className="text-gray-400 text-sm">(Optional)</span>
            </h3>

            <div className="space-y-4">
                {/* Compliance Requirements */}
                <div>
                    <label className="block text-white text-sm font-medium mb-3">
                        Compliance Requirements
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {COMPLIANCE_OPTIONS.map(req => (
                            <button
                                key={req}
                                onClick={() => toggleRequirement(req)}
                                className={`p-3 rounded-lg border-2 transition text-sm ${data.requirements.includes(req)
                                        ? 'border-blue-500 bg-blue-500/20 text-white'
                                        : 'border-white/20 text-gray-400 hover:border-white/40'
                                    }`}
                            >
                                {req}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Privacy */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Data Privacy Considerations
                    </label>
                    <textarea
                        value={data.dataPrivacy || ''}
                        onChange={(e) => onChange({ ...data, dataPrivacy: e.target.value })}
                        placeholder="Describe any data privacy requirements, PII handling, data retention policies, etc."
                        rows={4}
                        className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>
        </div>
    );
}
