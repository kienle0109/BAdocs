'use client';

interface InputModeToggleProps {
    mode: 'quick' | 'guided';
    onChange: (mode: 'quick' | 'guided') => void;
}

export function InputModeToggle({ mode, onChange }: InputModeToggleProps) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 mb-6">
            <label className="block text-white font-medium mb-3">
                Input Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => onChange('quick')}
                    className={`p-4 rounded-lg border-2 transition ${mode === 'quick'
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                >
                    <div className="text-white font-medium flex items-center justify-center gap-2">
                        📝 Quick Mode
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                        Free-text input (faster for experienced users)
                    </div>
                </button>
                <button
                    onClick={() => onChange('guided')}
                    className={`p-4 rounded-lg border-2 transition ${mode === 'guided'
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                >
                    <div className="text-white font-medium flex items-center justify-center gap-2">
                        📋 Guided Mode
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                        Structured form (comprehensive & guided)
                    </div>
                </button>
            </div>
        </div>
    );
}
