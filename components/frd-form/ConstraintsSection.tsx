import { ConstraintsData } from '@/lib/frd-form-utils';

interface ConstraintsSectionProps {
    data: ConstraintsData;
    onChange: (data: ConstraintsData) => void;
}

export function ConstraintsSection({ data, onChange }: ConstraintsSectionProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Constraints & Assumptions</h2>
                <p className="text-gray-400 text-sm">Define technical constraints, business rules, assumptions, and dependencies</p>
            </div>

            {/* Technical Constraints */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Technical Constraints</label>
                <p className="text-xs text-gray-400 mb-2">Platform limitations, technology restrictions, performance requirements</p>
                <div className="space-y-2">
                    {data.technical.map((constraint, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={constraint}
                                onChange={(e) => {
                                    const newConstraints = [...data.technical];
                                    newConstraints[index] = e.target.value;
                                    onChange({ ...data, technical: newConstraints });
                                }}
                                placeholder="e.g., Must support IE 11+"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                onClick={() => onChange({ ...data, technical: data.technical.filter((_, i) => i !== index) })}
                                className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => onChange({ ...data, technical: [...data.technical, ''] })}
                        className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Constraint
                    </button>
                </div>
            </div>

            {/* Business Rules */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Business Rules</label>
                <p className="text-xs text-gray-400 mb-2">Policies, regulations, and business logic that must be enforced</p>
                <div className="space-y-2">
                    {data.businessRules.map((rule, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={rule}
                                onChange={(e) => {
                                    const newRules = [...data.businessRules];
                                    newRules[index] = e.target.value;
                                    onChange({ ...data, businessRules: newRules });
                                }}
                                placeholder="e.g., Users must be 18+ to register"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                onClick={() => onChange({ ...data, businessRules: data.businessRules.filter((_, i) => i !== index) })}
                                className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => onChange({ ...data, businessRules: [...data.businessRules, ''] })}
                        className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Rule
                    </button>
                </div>
            </div>

            {/* Assumptions */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Assumptions</label>
                <p className="text-xs text-gray-400 mb-2">Things assumed to be true for the project</p>
                <div className="space-y-2">
                    {data.assumptions.map((assumption, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={assumption}
                                onChange={(e) => {
                                    const newAssumptions = [...data.assumptions];
                                    newAssumptions[index] = e.target.value;
                                    onChange({ ...data, assumptions: newAssumptions });
                                }}
                                placeholder="e.g., Users have stable internet connection"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                onClick={() => onChange({ ...data, assumptions: data.assumptions.filter((_, i) => i !== index) })}
                                className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => onChange({ ...data, assumptions: [...data.assumptions, ''] })}
                        className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Assumption
                    </button>
                </div>
            </div>

            {/* Dependencies */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Dependencies</label>
                <p className="text-xs text-gray-400 mb-2">External dependencies and prerequis ites</p>
                <div className="space-y-2">
                    {data.dependencies.map((dependency, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={dependency}
                                onChange={(e) => {
                                    const newDeps = [...data.dependencies];
                                    newDeps[index] = e.target.value;
                                    onChange({ ...data, dependencies: newDeps });
                                }}
                                placeholder="e.g., Payment gateway API must be available"
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                onClick={() => onChange({ ...data, dependencies: data.dependencies.filter((_, i) => i !== index) })}
                                className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => onChange({ ...data, dependencies: [...data.dependencies, ''] })}
                        className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Dependency
                    </button>
                </div>
            </div>
        </div>
    );
}
