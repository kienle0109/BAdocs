import React from 'react';
import { SDLCSelection } from '@/components/SDLCSelection';

interface ConfigurationPanelProps {
    template: 'IEEE' | 'IIBA';
    setTemplate: (value: 'IEEE' | 'IIBA') => void;
    sdlc: 'waterfall' | 'agile';
    setSdlc: (value: 'waterfall' | 'agile') => void;
    aiProvider: 'gemini' | 'ollama';
    setAiProvider: (value: 'gemini' | 'ollama') => void;
    language: 'en' | 'vi';
    setLanguage: (value: 'en' | 'vi') => void;

    onGenerate?: () => void;
    onReset?: () => void;
    isGenerating?: boolean;
    isGenerateEnabled?: boolean;
    generateLabel?: string;
}

export function ConfigurationPanel({
    template,
    setTemplate,
    sdlc,
    setSdlc,
    aiProvider,
    setAiProvider,
    language,
    setLanguage,
    onGenerate,
    onReset,
    isGenerating = false,
    isGenerateEnabled = true,
    generateLabel = 'Generate Document'
}: ConfigurationPanelProps) {
    return (
        <div className="h-full flex flex-col gap-6 p-1">

            {/* AI Provider */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                    Intelligence
                </h3>
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                    <SettingItem
                        active={aiProvider === 'gemini'}
                        onClick={() => setAiProvider('gemini')}
                        label="Gemini 1.5 Pro"
                        icon={<SparklesIcon className="w-4 h-4" />}
                    />
                    <div className="h-px bg-slate-800" />
                    <SettingItem
                        active={aiProvider === 'ollama'}
                        onClick={() => setAiProvider('ollama')}
                        label="Ollama (Local)"
                        icon={<ServerIcon className="w-4 h-4" />}
                    />
                </div>
            </div>

            {/* Standard */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                    Standard
                </h3>
                <div className="flex bg-slate-900/50 rounded-xl border border-slate-800 p-1">
                    <TabItem
                        active={template === 'IEEE'}
                        onClick={() => setTemplate('IEEE')}
                        label="IEEE 830"
                    />
                    <TabItem
                        active={template === 'IIBA'}
                        onClick={() => setTemplate('IIBA')}
                        label="IIBA BABOK"
                    />
                </div>
            </div>

            {/* SDLC */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                    Methodology
                </h3>
                {/* Reusing existing logic but styled for the panel */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                    <SettingItem
                        active={sdlc === 'waterfall'}
                        onClick={() => setSdlc('waterfall')}
                        label="Waterfall"
                        subLabel="Detailed Specs"
                        icon={<WaterfallIcon className="w-4 h-4" />}
                    />
                    <div className="h-px bg-slate-800" />
                    <SettingItem
                        active={sdlc === 'agile'}
                        onClick={() => setSdlc('agile')}
                        label="Agile / Scrum"
                        subLabel="User Stories"
                        icon={<RefreshIcon className="w-4 h-4" />}
                    />
                </div>
            </div>

            {/* Language */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                    Output Language
                </h3>
                <div className="flex bg-slate-900/50 rounded-xl border border-slate-800 p-1">
                    <TabItem
                        active={language === 'en'}
                        onClick={() => setLanguage('en')}
                        label="English"
                    />
                    <TabItem
                        active={language === 'vi'}
                        onClick={() => setLanguage('vi')}
                        label="Tiếng Việt"
                    />
                </div>
            </div>
            {/* Action Button */}
            {onGenerate && (
                <div className="pt-4 mt-auto">
                    <button
                        onClick={onGenerate}
                        disabled={!isGenerateEnabled}
                        className={`
                            w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300
                            ${!isGenerateEnabled
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {isGenerating ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>{generateLabel}</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </>
                        )}
                    </button>

                    {onReset && (
                        <button
                            onClick={onReset}
                            disabled={isGenerating}
                            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            <span>Clear Draft</span>
                        </button>
                    )}
                </div>
            )}

        </div>
    );
}

// Sub-components
function SettingItem({ active, onClick, label, subLabel, icon }: { active: boolean, onClick: () => void, label: string, subLabel?: string, icon: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-200 group ${active ? 'bg-indigo-500/10' : 'hover:bg-slate-800'
                }`}
        >
            <div className="flex items-center gap-3">
                <div className={`transition-colors ${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                    {icon}
                </div>
                <div className="text-left">
                    <div className={`text-sm font-medium transition-colors ${active ? 'text-indigo-200' : 'text-slate-300'}`}>
                        {label}
                    </div>
                    {subLabel && (
                        <div className="text-xs text-slate-500">{subLabel}</div>
                    )}
                </div>
            </div>
            {active && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            )}
        </button>
    );
}

function TabItem({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${active
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
        >
            {label}
        </button>
    );
}


// Icons
function SparklesIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" /></svg>;
}
function ServerIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;
}
function WaterfallIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
}
function RefreshIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
}
