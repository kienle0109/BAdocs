import { SystemFeature, getNextFeatureId, TEMPLATE_FEATURES } from '@/lib/frd-form-utils';

interface FeaturesSectionProps {
    features: SystemFeature[];
    onChange: (features: SystemFeature[]) => void;
}

export function SystemFeaturesSection({ features, onChange }: FeaturesSectionProps) {
    const addFeature = () => {
        const newFeature: SystemFeature = {
            id: getNextFeatureId(features),
            name: '',
            description: '',
            userStories: [],
            acceptanceCriteria: [],
            relatedFR: [],
        };
        onChange([...features, newFeature]);
    };

    const updateFeature = (index: number, updated: SystemFeature) => {
        const newFeatures = [...features];
        newFeatures[index] = updated;
        onChange(newFeatures);
    };

    const removeFeature = (index: number) => {
        onChange(features.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">System Features</h2>
                    <p className="text-gray-400 text-sm">High-level features grouping related functional requirements</p>
                </div>
                <button
                    onClick={addFeature}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Feature
                </button>
            </div>

            {features.length === 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-3">Quick Start Templates</h3>
                    <div className="space-y-2">
                        {TEMPLATE_FEATURES.map((template, index) => (
                            <button
                                key={index}
                                onClick={() => onChange([...features, { ...template, id: getNextFeatureId(features), relatedFR: [] } as SystemFeature])}
                                className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-left transition-all cursor-pointer"
                            >
                                <div className="font-medium text-white mb-1">{template.name}</div>
                                <div className="text-xs text-gray-400">{template.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {features.map((feature, index) => (
                <div key={feature.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-orange-400 font-mono font-semibold text-lg">{feature.id}</span>
                        <button
                            onClick={() => removeFeature(index)}
                            className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Feature Name</label>
                        <input
                            type="text"
                            value={feature.name}
                            onChange={(e) => updateFeature(index, { ...feature, name: e.target.value })}
                            placeholder="e.g., User Management"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(index, { ...feature, description: e.target.value })}
                            placeholder="Describe this feature..."
                            rows={2}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Related FRs (comma-separated)</label>
                        <input
                            type="text"
                            value={feature.relatedFR.join(', ')}
                            onChange={(e) => updateFeature(index, { ...feature, relatedFR: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            placeholder="e.g., FR-001, FR-002"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
