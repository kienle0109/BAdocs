'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getInitialSRSFormData,
    type SRSFormData
} from '@/lib/srs-form-utils';

// Sections
import { SystemOverviewSection } from './SystemOverviewSection';
import { ActorsSection } from './ActorsSection';
import { UseCasesSection } from './UseCasesSection';
import { NFRSection } from './NFRSection';
import { BusinessRulesSection } from './BusinessRulesSection';

export function SRSForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<SRSFormData>(getInitialSRSFormData());
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/frd');
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 sm:p-12 pb-32">

            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">New System Requirements Specification</h1>
                <p className="text-slate-400">Define the system behavior, actors, and use cases.</p>
            </div>

            <div className="space-y-8">

                <SystemOverviewSection
                    data={formData}
                    onChange={setFormData}
                />

                <ActorsSection
                    actors={formData.actors}
                    onChange={(val) => setFormData({ ...formData, actors: val })}
                />

                <UseCasesSection
                    useCases={formData.useCases}
                    actors={formData.actors}
                    onChange={(val) => setFormData({ ...formData, useCases: val })}
                />

                <NFRSection
                    nfrs={formData.nonFunctionalRequirements}
                    onChange={(val) => setFormData({ ...formData, nonFunctionalRequirements: val })}
                />

                <BusinessRulesSection
                    rules={formData.businessRules}
                    onChange={(val) => setFormData({ ...formData, businessRules: val })}
                />
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 z-40 flex justify-center">
                <div className="max-w-4xl w-full flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className={`
                            flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300
                            ${saving
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {saving ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <span>Save SRS</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
}
