'use client';

import { BusinessContext } from '@/lib/brd-form-utils';

interface BusinessContextSectionProps {
    data: BusinessContext;
    onChange: (data: BusinessContext) => void;
    errors?: { [key: string]: string };
}

const STRATEGIC_ALIGNMENT_OPTIONS = [
    'Cost Reduction',
    'Revenue Growth',
    'Customer Experience Improvement',
    'Digital Transformation',
    'Regulatory Compliance',
    'Market Expansion',
    'Other',
];

export function BusinessContextSection({ data, onChange, errors = {} }: BusinessContextSectionProps) {
    const handleChange = (field: keyof BusinessContext, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💼</span>
                Section 2: Business Context
            </h3>

            <div className="space-y-4">
                {/* Business Problem */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Business Problem/Opportunity <span className="text-red-400">*</span>
                        <span className="text-gray-400 text-xs ml-2">(minimum 50 characters)</span>
                    </label>
                    <textarea
                        value={data.problem}
                        onChange={(e) => handleChange('problem', e.target.value)}
                        placeholder="Describe the business problem or opportunity this project addresses..."
                        rows={4}
                        className={`w-full bg-slate-900/50 text-white border ${errors.problem ? 'border-red-500' : 'border-white/20'
                            } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    <div className="flex justify-between mt-1">
                        {errors.problem && (
                            <p className="text-red-400 text-sm">{errors.problem}</p>
                        )}
                        <p className={`text-sm ml-auto ${data.problem.length >= 50 ? 'text-green-400' : 'text-gray-400'
                            }`}>
                            {data.problem.length}/50 characters
                        </p>
                    </div>
                </div>

                {/* Background */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Project Background
                    </label>
                    <textarea
                        value={data.background || ''}
                        onChange={(e) => handleChange('background', e.target.value)}
                        placeholder="Provide context, history, and why this project is needed now..."
                        rows={3}
                        className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* Strategic Alignment */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Strategic Alignment
                    </label>
                    <div className="space-y-2">
                        <select
                            value={data.strategicAlignment || ''}
                            onChange={(e) => handleChange('strategicAlignment', e.target.value)}
                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select strategic alignment...</option>
                            {STRATEGIC_ALIGNMENT_OPTIONS.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        {data.strategicAlignment === 'Other' && (
                            <input
                                type="text"
                                value={data.alignmentOther || ''}
                                onChange={(e) => handleChange('alignmentOther', e.target.value)}
                                placeholder="Please specify..."
                                className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
