'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getInitialFormData,
    type FRDFormData
} from '@/lib/frd-form-utils';

// Sections
import { OverviewSection } from './OverviewSection';
import { FunctionalRequirementsSection } from './FunctionalRequirementsSection';
import { SystemFeaturesSection } from './SystemFeaturesSection';
import { UserInterfaceSection } from './UserInterfaceSection';
import { DataRequirementsSection } from './DataRequirementsSection';
import { IntegrationPointsSection } from './IntegrationPointsSection';
import { ConstraintsSection } from './ConstraintsSection';

export function FRDForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<FRDFormData>(getInitialFormData());
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/history');
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 sm:p-12 pb-32">

            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">New Functional Requirements Document</h1>
                <p className="text-slate-400">Detail the functional behavior, data, and interfaces.</p>
            </div>

            <div className="space-y-8">

                <OverviewSection
                    data={formData.overview}
                    onChange={(val) => setFormData({ ...formData, overview: val })}
                />

                <FunctionalRequirementsSection
                    requirements={formData.functionalRequirements}
                    onChange={(val) => setFormData({ ...formData, functionalRequirements: val })}
                />

                <SystemFeaturesSection
                    features={formData.systemFeatures}
                    onChange={(val) => setFormData({ ...formData, systemFeatures: val })}
                />

                <UserInterfaceSection
                    screens={formData.userInterface}
                    onChange={(val) => setFormData({ ...formData, userInterface: val })}
                />

                <DataRequirementsSection
                    entities={formData.dataRequirements}
                    onChange={(val) => setFormData({ ...formData, dataRequirements: val })}
                />

                <IntegrationPointsSection
                    integrations={formData.integrationPoints}
                    onChange={(val) => setFormData({ ...formData, integrationPoints: val })}
                />

                <ConstraintsSection
                    data={formData.constraints}
                    onChange={(val) => setFormData({ ...formData, constraints: val })}
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
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5'
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
                                <span>Save FRD</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
}
