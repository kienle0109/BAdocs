'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';
import {
    getInitialFormData,
    formatStructuredData,
    validateBRDForm,
    type BRDFormData
} from '@/lib/brd-form-utils';

// Sections
import { ProjectInfoSection } from './ProjectInfoSection';
import { BusinessContextSection } from './BusinessContextSection';
import { GoalsSection } from './GoalsSection';
import { StakeholdersSection } from './StakeholdersSection';
import { ScopeSection } from './ScopeSection';
import { ConstraintsSection } from './ConstraintsSection';
import { ComplianceSection } from './ComplianceSection';
import { RisksSection } from './RisksSection';

export interface BRDFormHandle {
    submit: () => Promise<void>;
    reset: () => Promise<void>;
}

interface BRDFormProps {
    template?: 'IEEE' | 'IIBA';
    sdlc?: 'waterfall' | 'agile';
    language?: 'en' | 'vi';
    aiProvider?: 'gemini' | 'ollama';
    onGenerateStart?: () => void;
    onGenerateEnd?: () => void;
}

export const BRDForm = forwardRef<BRDFormHandle, BRDFormProps>(({
    template = 'IEEE',
    sdlc = 'waterfall',
    language = 'en',
    aiProvider = 'gemini',
    onGenerateStart,
    onGenerateEnd
}, ref) => {
    const router = useRouter();
    const [formData, setFormData] = useState<BRDFormData>(getInitialFormData());

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('brd_form_draft');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFormData(parsed);
                console.log('Restored form draft from localStorage');
            } catch (e) {
                console.error('Failed to parse saved draft', e);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        // Debounce not strictly needed for small data, but good practice. 
        // For simplicity, strict saving on every render is fine if not huge.
        const handler = setTimeout(() => {
            if (JSON.stringify(formData) !== JSON.stringify(getInitialFormData())) {
                localStorage.setItem('brd_form_draft', JSON.stringify(formData));
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [formData]);

    useImperativeHandle(ref, () => ({
        reset: async () => {
            if (confirm('Are you sure you want to clear the form? This action cannot be undone.')) {
                localStorage.removeItem('brd_form_draft');
                setFormData(getInitialFormData());
            }
        },
        submit: async () => {
            const errors = validateBRDForm(formData);
            if (Object.keys(errors).length > 0) {
                const firstError = Object.values(errors)[0];
                alert(`Validation Error: ${firstError}`);
                return;
            }

            if (onGenerateStart) onGenerateStart();

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputMethod: 'form',
                        data: formData, // Send raw structured object
                        template,
                        aiProvider,
                        language
                    }),
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.error || 'Failed to generate document');
                }

                const result = await response.json();

                // Redirect to preview or list
                router.refresh();
                router.push(`/preview/${result.document.id}`);

            } catch (e: any) {
                console.error(e);
                alert(`Error generating document: ${e.message}`);
            } finally {
                if (onGenerateEnd) onGenerateEnd();
            }
        }
    }));

    return (
        <div className="max-w-4xl mx-auto p-6 sm:p-12 pb-32">

            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">New Business Requirement Document</h1>
                <p className="text-slate-400">Define the business needs, scope, and goals for your project.</p>
            </div>

            <div className="space-y-8">
                <ProjectInfoSection
                    data={formData.projectInfo}
                    onChange={(val) => setFormData({ ...formData, projectInfo: val })}
                />

                <BusinessContextSection
                    data={formData.businessContext}
                    onChange={(val) => setFormData({ ...formData, businessContext: val })}
                />

                <GoalsSection
                    data={formData.goals}
                    onChange={(val) => setFormData({ ...formData, goals: val })}
                />

                <StakeholdersSection
                    stakeholders={formData.stakeholders}
                    onChange={(val) => setFormData({ ...formData, stakeholders: val })}
                />

                <ScopeSection
                    data={formData.scope}
                    onChange={(val) => setFormData({ ...formData, scope: val })}
                />

                <ConstraintsSection
                    data={formData.constraints}
                    onChange={(val) => setFormData({ ...formData, constraints: val })}
                />

                <ComplianceSection
                    data={formData.compliance}
                    onChange={(val) => setFormData({ ...formData, compliance: val })}
                />

                <RisksSection
                    risks={formData.risks}
                    onChange={(val) => setFormData({ ...formData, risks: val })}
                />
            </div>
        </div>
    );
});

BRDForm.displayName = 'BRDForm';
