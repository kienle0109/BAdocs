'use client';

import { type BusinessRule, createEmptyBusinessRule, generateBRId } from '@/lib/srs-form-utils';

interface BusinessRulesSectionProps {
    rules: BusinessRule[];
    onChange: (rules: BusinessRule[]) => void;
}

const ruleTypes = ['Validation', 'Calculation', 'Authorization', 'Workflow', 'Constraint'] as const;

export function BusinessRulesSection({ rules, onChange }: BusinessRulesSectionProps) {
    const addRule = () => {
        const newRule = createEmptyBusinessRule();
        newRule.id = generateBRId(rules);
        onChange([...rules, newRule]);
    };

    const updateRule = (index: number, updates: Partial<BusinessRule>) => {
        const updated = [...rules];
        updated[index] = { ...updated[index], ...updates };
        onChange(updated);
    };

    const removeRule = (index: number) => {
        onChange(rules.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Business Rules
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        Define validation, calculation, and workflow rules
                    </p>
                </div>
                <button
                    onClick={addRule}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Rule
                </button>
            </div>

            {rules.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10 border-dashed">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-600/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h4 className="text-white font-medium mb-2">No business rules defined</h4>
                    <p className="text-gray-400 text-sm mb-4">Add rules for validation, calculations, and workflows</p>
                    <button
                        onClick={addRule}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors duration-200 cursor-pointer"
                    >
                        Add First Rule
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {rules.map((rule, index) => (
                        <div key={rule.id} className="bg-white/5 rounded-lg p-5 border border-white/10 hover:border-white/20 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-xs text-gray-500 font-mono">{rule.id}</span>
                                <button
                                    onClick={() => removeRule(index)}
                                    className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer p-1"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Rule Name</label>
                                    <input
                                        type="text"
                                        value={rule.name}
                                        onChange={(e) => updateRule(index, { name: e.target.value })}
                                        placeholder="e.g. Password Validation"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                    <select
                                        value={rule.type}
                                        onChange={(e) => updateRule(index, { type: e.target.value as BusinessRule['type'] })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        {ruleTypes.map((type) => (
                                            <option key={type} value={type} className="bg-slate-800">{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
                                    <input
                                        type="text"
                                        value={rule.source || ''}
                                        onChange={(e) => updateRule(index, { source: e.target.value })}
                                        placeholder="e.g. Legal Requirement"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={rule.description}
                                    onChange={(e) => updateRule(index, { description: e.target.value })}
                                    placeholder="Describe the business rule in detail..."
                                    rows={2}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Common Rules Templates */}
            {rules.length === 0 && (
                <div className="p-4 bg-orange-600/10 border border-orange-500/30 rounded-lg">
                    <h4 className="text-orange-300 font-medium text-sm mb-2">Common Business Rules</h4>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { name: 'Password Complexity', type: 'Validation', description: 'Password must be at least 8 characters with uppercase, lowercase, and number' },
                            { name: 'Session Timeout', type: 'Constraint', description: 'User session expires after 30 minutes of inactivity' },
                            { name: 'Admin Access', type: 'Authorization', description: 'Only administrators can access user management' },
                            { name: 'Tax Calculation', type: 'Calculation', description: 'Apply 10% tax on all orders above $100' },
                        ].map((template) => (
                            <button
                                key={template.name}
                                onClick={() => {
                                    const newRule = createEmptyBusinessRule();
                                    newRule.id = generateBRId(rules);
                                    newRule.name = template.name;
                                    newRule.type = template.type as BusinessRule['type'];
                                    newRule.description = template.description;
                                    onChange([...rules, newRule]);
                                }}
                                className="px-3 py-1 bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 rounded-full text-sm transition-colors cursor-pointer"
                            >
                                + {template.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
