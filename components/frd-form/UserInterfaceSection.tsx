import { UIScreen, getNextUIId } from '@/lib/frd-form-utils';

interface UISectionProps {
    screens: UIScreen[];
    onChange: (screens: UIScreen[]) => void;
}

export function UserInterfaceSection({ screens, onChange }: UISectionProps) {
    const addScreen = () => {
        const newScreen: UIScreen = {
            id: getNextUIId(screens),
            name: '',
            layout: '',
            flowDescription: '',
        };
        onChange([...screens, newScreen]);
    };

    const updateScreen = (index: number, updated: UIScreen) => {
        const newScreens = [...screens];
        newScreens[index] = updated;
        onChange(newScreens);
    };

    const removeScreen = (index: number) => {
        onChange(screens.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">User Interface</h2>
                    <p className="text-gray-400 text-sm">Define screen layouts and user flows</p>
                </div>
                <button
                    onClick={addScreen}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Screen
                </button>
            </div>

            {screens.length === 0 && (
                <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400">No UI screens defined yet. Click "Add Screen" to get started.</p>
                </div>
            )}

            {screens.map((screen, index) => (
                <div key={screen.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-orange-400 font-mono font-semibold text-lg">{screen.id}</span>
                        <button
                            onClick={() => removeScreen(index)}
                            className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Screen Name</label>
                        <input
                            type="text"
                            value={screen.name}
                            onChange={(e) => updateScreen(index, { ...screen, name: e.target.value })}
                            placeholder="e.g., Login Screen"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Layout</label>
                        <input
                            type="text"
                            value={screen.layout}
                            onChange={(e) => updateScreen(index, { ...screen, layout: e.target.value })}
                            placeholder="e.g., Two-column layout with sidebar"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Flow Description</label>
                        <textarea
                            value={screen.flowDescription}
                            onChange={(e) => updateScreen(index, { ...screen, flowDescription: e.target.value })}
                            placeholder="Describe the user flow and interactions..."
                            rows={2}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
