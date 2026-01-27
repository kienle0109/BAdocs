'use client';

import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { BRDForm, type BRDFormHandle } from '@/components/brd-form/BRDForm';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';

export default function NewBRDPage() {
    // Shared state for configuration
    const [template, setTemplate] = useState<'IEEE' | 'IIBA'>('IEEE');
    const [sdlc, setSdlc] = useState<'waterfall' | 'agile'>('waterfall');
    const [aiProvider, setAiProvider] = useState<'gemini' | 'ollama'>('gemini');
    const [language, setLanguage] = useState<'en' | 'vi'>('en');

    // Generation state
    const [isGenerating, setIsGenerating] = useState(false);
    const formRef = useRef<BRDFormHandle>(null);

    const handleGenerate = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const handleReset = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    return (
        <div className="h-screen bg-slate-950 flex flex-col font-sans">
            <Header showBack backHref="/" title="Create New BRD" />

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content - Form */}
                <main className="flex-1 overflow-y-auto w-full relative">
                    <BRDForm
                        ref={formRef}
                        template={template}
                        sdlc={sdlc}
                        language={language}
                        aiProvider={aiProvider}
                        onGenerateStart={() => setIsGenerating(true)}
                        onGenerateEnd={() => setIsGenerating(false)}
                    />
                </main>

                {/* Right Sidebar - Configuration */}
                <aside className="w-80 border-l border-slate-800 bg-slate-900/30 overflow-y-auto custom-scrollbar hidden lg:block">
                    <div className="p-4 h-full">
                        <ConfigurationPanel
                            template={template} setTemplate={setTemplate}
                            sdlc={sdlc} setSdlc={setSdlc}
                            aiProvider={aiProvider} setAiProvider={setAiProvider}
                            language={language} setLanguage={setLanguage}
                            isGenerateEnabled={true}
                            isGenerating={isGenerating}
                            onGenerate={handleGenerate}
                            onReset={handleReset}
                            generateLabel="Generate BRD"
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
}
