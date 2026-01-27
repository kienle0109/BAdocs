import { Integration, PROTOCOLS, DATA_FORMATS } from '@/lib/frd-form-utils';

interface IntegrationSectionProps {
    integrations: Integration[];
    onChange: (integrations: Integration[]) => void;
}

export function IntegrationPointsSection({ integrations, onChange }: IntegrationSectionProps) {
    const addIntegration = () => {
        const newIntegration: Integration = {
            systemName: '',
            apiEndpoint: '',
            protocol: 'REST',
            dataFormat: 'JSON',
            authentication: '',
            description: '',
        };
        onChange([...integrations, newIntegration]);
    };

    const updateIntegration = (index: number, updated: Integration) => {
        const newIntegrations = [...integrations];
        newIntegrations[index] = updated;
        onChange(newIntegrations);
    };

    const removeIntegration = (index: number) => {
        onChange(integrations.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Integration Points</h2>
                    <p className="text-gray-400 text-sm">Define external systems and API integrations</p>
                </div>
                <button
                    onClick={addIntegration}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Integration
                </button>
            </div>

            {integrations.length === 0 && (
                <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <p className="text-gray-400">No integrations defined yet. Click "Add Integration" to get started.</p>
                </div>
            )}

            {integrations.map((integration, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-4">
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            value={integration.systemName}
                            onChange={(e) => updateIntegration(index, { ...integration, systemName: e.target.value })}
                            placeholder="System Name (e.g., Payment Gateway)"
                            className="text-xl font-bold bg-transparent border-none text-white placeholder-gray-500 focus:outline-none flex-1"
                        />
                        <button
                            onClick={() => removeIntegration(index)}
                            className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">API Endpoint</label>
                        <input
                            type="text"
                            value={integration.apiEndpoint}
                            onChange={(e) => updateIntegration(index, { ...integration, apiEndpoint: e.target.value })}
                            placeholder="https://api.example.com/v1"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Protocol</label>
                            <select
                                value={integration.protocol}
                                onChange={(e) => updateIntegration(index, { ...integration, protocol: e.target.value as any })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {PROTOCOLS.map((protocol) => (
                                    <option key={protocol} value={protocol}>{protocol}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Data Format</label>
                            <select
                                value={integration.dataFormat}
                                onChange={(e) => updateIntegration(index, { ...integration, dataFormat: e.target.value as any })}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {DATA_FORMATS.map((format) => (
                                    <option key={format} value={format}>{format}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Authentication</label>
                            <input
                                type="text"
                                value={integration.authentication}
                                onChange={(e) => updateIntegration(index, { ...integration, authentication: e.target.value })}
                                placeholder="e.g., OAuth 2.0"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={integration.description}
                            onChange={(e) => updateIntegration(index, { ...integration, description: e.target.value })}
                            placeholder="Describe the integration purpose and data flow..."
                            rows={2}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
