'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputModeToggle } from '@/components/brd-form/InputModeToggle';
import { ProjectInfoSection } from '@/components/brd-form/ProjectInfoSection';
import { BusinessContextSection } from '@/components/brd-form/BusinessContextSection';
import { GoalsSection } from '@/components/brd-form/GoalsSection';
import { StakeholdersSection } from '@/components/brd-form/StakeholdersSection';
import { ScopeSection } from '@/components/brd-form/ScopeSection';
import { ConstraintsSection } from '@/components/brd-form/ConstraintsSection';
import { ComplianceSection } from '@/components/brd-form/ComplianceSection';
import { RisksSection } from '@/components/brd-form/RisksSection';
import { ValidationSummary } from '@/components/brd-form/ValidationSummary';
import {
    getInitialFormData,
    validateBRDForm,
    formatStructuredData,
    type BRDFormData
} from '@/lib/brd-form-utils';

export default function NewDocumentPage() {
    const router = useRouter();
    const [template, setTemplate] = useState<'IEEE' | 'IIBA'>('IEEE');
    const [aiProvider, setAiProvider] = useState<'ollama' | 'gemini'>('ollama');
    const [inputMode, setInputMode] = useState<'quick' | 'guided'>('guided');

    // Quick mode state
    const [quickInput, setQuickInput] = useState('');

    // Guided mode state
    const [formData, setFormData] = useState<BRDFormData>(getInitialFormData());
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        // Determine input data based on mode
        let inputData = '';
        let inputMethod = '';

        if (inputMode === 'quick') {
            if (!quickInput.trim()) {
                setError('Please enter some input');
                return;
            }
            inputData = quickInput;
            inputMethod = 'text';
        } else {
            // Validate guided mode
            const errors = validateBRDForm(formData);
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                setError('Please fill in all required fields');
                // Scroll to top to show validation summary
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            inputData = formatStructuredData(formData);
            inputMethod = 'form';
        }

        setLoading(true);
        setError('');
        setValidationErrors({});

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputMethod,
                    data: inputData,
                    template,
                    aiProvider,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate BRD');
            }

            // Redirect to document view
            router.push(`/preview/${result.document.id}`);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Create New BRD
                    </h1>
                    <p className="text-gray-300">
                        {inputMode === 'quick'
                            ? 'Enter your business requirements and let AI generate a professional document'
                            : 'Fill in the structured form below for a comprehensive, guided BRD creation'}
                    </p>
                </div>

                {/* AI Provider Selection */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
                    <label className="block text-white font-medium mb-3">
                        AI Provider
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setAiProvider('ollama')}
                            className={`p-4 rounded-lg border-2 transition ${aiProvider === 'ollama'
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-white/20 hover:border-white/40'
                                }`}
                        >
                            <div className="text-white font-medium">Ollama (Local)</div>
                            <div className="text-sm text-gray-400 mt-1">
                                Offline, Private, Unlimited
                            </div>
                        </button>
                        <button
                            onClick={() => setAiProvider('gemini')}
                            className={`p-4 rounded-lg border-2 transition ${aiProvider === 'gemini'
                                    ? 'border-blue-500 bg-blue-500/20'
                                    : 'border-white/20 hover:border-white/40'
                                }`}
                        >
                            <div className="text-white font-medium">Gemini Free</div>
                            <div className="text-sm text-gray-400 mt-1">
                                Fast, Cloud, 15 req/min
                            </div>
                        </button>
                    </div>
                </div>

                {/* Template Selection */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
                    <label className="block text-white font-medium mb-3">
                        Document Standard
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setTemplate('IEEE')}
                            className={`p-4 rounded-lg borderborder-2 transition ${template === 'IEEE'
                                    ? 'border-green-500 bg-green-500/20'
                                    : 'border-white/20 hover:border-white/40'
                                }`}
                        >
                            <div className="text-white font-medium">IEEE 29148</div>
                            <div className="text-sm text-gray-400 mt-1">
                                International Standard
                            </div>
                        </button>
                        <button
                            onClick={() => setTemplate('IIBA')}
                            className={`p-4 rounded-lg border-2 transition ${template === 'IIBA'
                                    ? 'border-green-500 bg-green-500/20'
                                    : 'border-white/20 hover:border-white/40'
                                }`}
                        >
                            <div className="text-white font-medium">IIBA BABOK v3</div>
                            <div className="text-sm text-gray-400 mt-1">
                                Business Analysis Body of Knowledge
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mode Toggle */}
                <InputModeToggle mode={inputMode} onChange={setInputMode} />

                {/* Validation Summary (Guided Mode Only) */}
                {inputMode === 'guided' && (
                    <ValidationSummary errors={validationErrors} formData={formData} />
                )}

                {/* Quick Mode - Free Text Input */}
                {inputMode === 'quick' && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
                        <label className="block text-white font-medium mb-3">
                            Business Requirements Input
                        </label>
                        <textarea
                            value={quickInput}
                            onChange={(e) => setQuickInput(e.target.value)}
                            placeholder="Example:&#10;&#10;Project: E-commerce Platform Modernization&#10;&#10;Business Goals:&#10;- Increase online sales by 30%&#10;- Improve customer satisfaction score to 4.5/5&#10;&#10;Stakeholders:&#10;- Marketing Team&#10;- Sales Team&#10;- IT Department&#10;&#10;Scope:&#10;- Web application rebuild&#10;- Mobile app (iOS & Android)&#10;- Integration with existing ERP"
                            rows={15}
                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                        />
                        <p className="text-gray-400 text-sm mt-2">
                            Tip: Be as detailed as possible. Include project goals, stakeholders, scope, and constraints.
                        </p>
                    </div>
                )}

                {/* Guided Mode - Structured Form */}
                {inputMode === 'guided' && (
                    <div className="space-y-0">
                        <ProjectInfoSection
                            data={formData.projectInfo}
                            onChange={(data) => setFormData({ ...formData, projectInfo: data })}
                            errors={validationErrors}
                        />

                        <BusinessContextSection
                            data={formData.businessContext}
                            onChange={(data) => setFormData({ ...formData, businessContext: data })}
                            errors={validationErrors}
                        />

                        <GoalsSection
                            data={formData.goals}
                            onChange={(data) => setFormData({ ...formData, goals: data })}
                            errors={validationErrors}
                        />

                        <StakeholdersSection
                            stakeholders={formData.stakeholders}
                            onChange={(data) => setFormData({ ...formData, stakeholders: data })}
                            errors={validationErrors}
                        />

                        <ScopeSection
                            data={formData.scope}
                            onChange={(data) => setFormData({ ...formData, scope: data })}
                            errors={validationErrors}
                        />

                        <ConstraintsSection
                            data={formData.constraints}
                            onChange={(data) => setFormData({ ...formData, constraints: data })}
                            errors={validationErrors}
                        />

                        <ComplianceSection
                            data={formData.compliance}
                            onChange={(data) => setFormData({ ...formData, compliance: data })}
                        />

                        <RisksSection
                            risks={formData.risks}
                            onChange={(data) => setFormData({ ...formData, risks: data })}
                        />
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Generating BRD...' : 'Generate BRD'}
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition"
                    >
                        Cancel
                    </button>
                </div>

                {loading && (
                    <div className="mt-6 bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                        <p className="text-blue-200">
                            ⏳ AI is generating your BRD... This may take 30-60 seconds depending on the provider.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
