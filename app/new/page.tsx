'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    const [aiProvider, setAiProvider] = useState<'ollama' | 'gemini'>('gemini');
    const [language, setLanguage] = useState<'en' | 'vi'>('en');
    const [inputMode, setInputMode] = useState<'quick' | 'guided'>('guided');

    // Quick mode state
    const [quickInput, setQuickInput] = useState('');

    // Guided mode state
    const [formData, setFormData] = useState<BRDFormData>(getInitialFormData());
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Calculate form completion percentage
    const formCompletion = useMemo(() => {
        if (inputMode === 'quick') {
            return quickInput.trim().length > 50 ? 100 : Math.min((quickInput.trim().length / 50) * 100, 100);
        }

        const sections = [
            { name: 'Project Info', filled: !!(formData.projectInfo.projectName && formData.projectInfo.preparedBy) },
            { name: 'Business Context', filled: !!(formData.businessContext.problem) },
            { name: 'Goals', filled: formData.goals.primary.filter(g => g.trim()).length > 0 },
            { name: 'Stakeholders', filled: formData.stakeholders.length > 0 },
            { name: 'Scope', filled: formData.scope.inScope.filter(s => s.trim()).length > 0 },
            { name: 'Constraints', filled: !!(formData.constraints.budget || formData.constraints.timeline) },
            { name: 'Compliance', filled: false }, // Optional
            { name: 'Risks', filled: formData.risks.length > 0 },
        ];

        const filledCount = sections.filter(s => s.filled).length;
        const requiredSections = sections.filter(s => s.name !== 'Compliance').length;
        return Math.round((filledCount / requiredSections) * 100);
    }, [inputMode, quickInput, formData]);

    const handleGenerate = async () => {
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
            const errors = validateBRDForm(formData);
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                setError('Please fill in all required fields');
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputMethod, data: inputData, template, aiProvider, language }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate BRD');
            }

            router.push(`/preview/${result.document.id}`);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="inline-flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </Link>
                        <div className="h-6 w-px bg-white/20"></div>
                        <h1 className="text-xl font-semibold text-white">Create New BRD</h1>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || formCompletion < 30}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                Generate BRD
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content - Split Layout */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Settings */}
                    <aside className="lg:w-80 flex-shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* AI Provider */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-white font-medium">AI Provider</h3>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setAiProvider('gemini')}
                                        className={`w-full p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${aiProvider === 'gemini'
                                            ? 'border-blue-500 bg-blue-500/20'
                                            : 'border-white/20 hover:border-white/40'
                                            }`}
                                    >
                                        <div className="text-white font-medium text-sm">Gemini Free</div>
                                        <div className="text-xs text-gray-400">Fast, Cloud-based</div>
                                    </button>
                                    <button
                                        onClick={() => setAiProvider('ollama')}
                                        className={`w-full p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${aiProvider === 'ollama'
                                            ? 'border-purple-500 bg-purple-500/20'
                                            : 'border-white/20 hover:border-white/40'
                                            }`}
                                    >
                                        <div className="text-white font-medium text-sm">Ollama (Local)</div>
                                        <div className="text-xs text-gray-400">Offline, Private</div>
                                    </button>
                                </div>
                            </div>

                            {/* Document Standard */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-white font-medium">Document Standard</h3>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setTemplate('IEEE')}
                                        className={`w-full p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${template === 'IEEE'
                                            ? 'border-green-500 bg-green-500/20'
                                            : 'border-white/20 hover:border-white/40'
                                            }`}
                                    >
                                        <div className="text-white font-medium text-sm">IEEE 29148</div>
                                        <div className="text-xs text-gray-400">International Standard</div>
                                    </button>
                                    <button
                                        onClick={() => setTemplate('IIBA')}
                                        className={`w-full p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${template === 'IIBA'
                                            ? 'border-green-500 bg-green-500/20'
                                            : 'border-white/20 hover:border-white/40'
                                            }`}
                                    >
                                        <div className="text-white font-medium text-sm">IIBA BABOK v3</div>
                                        <div className="text-xs text-gray-400">Business Analysis Standard</div>
                                    </button>
                                </div>
                            </div>

                            {/* Document Language */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                    <h3 className="text-white font-medium">Document Language</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setLanguage('en')}
                                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${language === 'en'
                                            ? 'border-cyan-500 bg-cyan-500/20'
                                            : 'border-white/20 hover:border-white/40'
                                            }`}
                                    >
                                        <div className="text-white font-medium text-sm">English</div>
                                    </button>
                                    <button
                                        onClick={() => setLanguage('vi')}
                                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${language === 'vi'
                                            ? 'border-cyan-500 bg-cyan-500/20'
                                            : 'border-white/20 hover:border-white/40'
                                            }`}
                                    >
                                        <div className="text-white font-medium text-sm">Tiếng Việt</div>
                                    </button>
                                </div>
                            </div>

                            {/* Input Mode */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <h3 className="text-white font-medium">Input Mode</h3>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setInputMode('quick')}
                                        className={`w-full p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${inputMode === 'quick'
                                            ? 'border-orange-500 bg-orange-500/20'
                                            : 'border-white/20 hover:border-white/40'
                                            }`}
                                    >
                                        <div className="text-white font-medium text-sm">Quick Mode</div>
                                        <div className="text-xs text-gray-400">Free-text input</div>
                                    </button>
                                    <button
                                        onClick={() => setInputMode('guided')}
                                        className={`w-full p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${inputMode === 'guided'
                                            ? 'border-orange-500 bg-orange-500/20'
                                            : 'border-white/20 hover:border-white/40'
                                            }`}
                                    >
                                        <div className="text-white font-medium text-sm">Guided Mode</div>
                                        <div className="text-xs text-gray-400">Structured form</div>
                                    </button>
                                </div>
                            </div>

                            {/* Form Completion */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <h3 className="text-white font-medium">Form Completion</h3>
                                    </div>
                                    <span className={`text-sm font-bold ${formCompletion >= 80 ? 'text-emerald-400' :
                                        formCompletion >= 50 ? 'text-yellow-400' : 'text-gray-400'
                                        }`}>
                                        {formCompletion}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 rounded-full ${formCompletion >= 80 ? 'bg-emerald-500' :
                                            formCompletion >= 50 ? 'bg-yellow-500' : 'bg-gray-500'
                                            }`}
                                        style={{ width: `${formCompletion}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    {formCompletion < 30
                                        ? 'Add more details to enable generation'
                                        : formCompletion < 80
                                            ? 'Good progress! Keep adding details'
                                            : 'Ready to generate!'}
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Right Main Area - Form */}
                    <main className="flex-1 min-w-0">
                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-200">{error}</p>
                            </div>
                        )}

                        {/* Loading Overlay */}
                        {loading && (
                            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
                                    <div>
                                        <p className="text-blue-200 font-medium">AI is generating your BRD...</p>
                                        <p className="text-blue-300/70 text-sm">This may take 30-60 seconds depending on the provider.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Validation Summary (Guided Mode Only) */}
                        {inputMode === 'guided' && Object.keys(validationErrors).length > 0 && (
                            <ValidationSummary errors={validationErrors} formData={formData} />
                        )}

                        {/* Quick Mode - Free Text Input */}
                        {inputMode === 'quick' && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <h2 className="text-lg font-semibold text-white">Quick Mode Input</h2>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">
                                    Describe your business requirements in free text. Include project goals, stakeholders, scope, and constraints.
                                </p>
                                <textarea
                                    value={quickInput}
                                    onChange={(e) => setQuickInput(e.target.value)}
                                    placeholder={`Example:

Project: E-commerce Platform Modernization

Business Goals:
- Increase online sales by 30%
- Improve customer satisfaction score to 4.5/5

Stakeholders:
- Marketing Team
- Sales Team
- IT Department

Scope:
- Web application rebuild
- Mobile app (iOS & Android)
- Integration with existing ERP`}
                                    rows={20}
                                    className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm resize-none"
                                />
                            </div>
                        )}

                        {/* Guided Mode - Structured Form */}
                        {inputMode === 'guided' && (
                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
                                    <p className="text-gray-300 text-sm">
                                        Fill in the structured form below. Fields marked with <span className="text-red-400">*</span> are required.
                                    </p>
                                </div>

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

                        {/* Mobile Generate Button */}
                        <div className="lg:hidden mt-6">
                            <button
                                onClick={handleGenerate}
                                disabled={loading || formCompletion < 30}
                                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? 'Generating BRD...' : 'Generate BRD'}
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
