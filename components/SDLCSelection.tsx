'use client';

interface SDLCSelectionProps {
    value: 'waterfall' | 'agile';
    onChange: (value: 'waterfall' | 'agile') => void;
}

export function SDLCSelection({ value, onChange }: SDLCSelectionProps) {
    return (

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </span>
                Development Model
            </h3>
            <div className="space-y-2">
                <button
                    onClick={() => onChange('waterfall')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer border flex justify-between items-center group ${value === 'waterfall'
                        ? 'bg-orange-600/20 border-orange-500 text-orange-100 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                        : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <div>
                        <div className="font-medium text-sm">Waterfall</div>
                        <div className="text-xs opacity-60 mt-0.5 group-hover:opacity-80 transition-opacity">Detailed Use Cases & Specs</div>
                    </div>
                    {value === 'waterfall' && (
                        <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_currentColor]"></div>
                    )}
                </button>
                <button
                    onClick={() => onChange('agile')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer border flex justify-between items-center group ${value === 'agile'
                        ? 'bg-orange-600/20 border-orange-500 text-orange-100 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                        : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <div>
                        <div className="font-medium text-sm">Agile / Scrum</div>
                        <div className="text-xs opacity-60 mt-0.5 group-hover:opacity-80 transition-opacity">User Stories & Acceptance Criteria</div>
                    </div>
                    {value === 'agile' && (
                        <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_currentColor]"></div>
                    )}
                </button>
            </div>
        </div>
    );

}
