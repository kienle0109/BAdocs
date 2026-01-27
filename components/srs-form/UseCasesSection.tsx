'use client';

import { useState } from 'react';
import {
    type UseCase,
    type Actor,
    type FlowStep,
    createEmptyUseCase,
    createEmptyFlowStep,
    generateUseCaseId,
} from '@/lib/srs-form-utils';

interface UseCasesSectionProps {
    useCases: UseCase[];
    actors: Actor[];
    onChange: (useCases: UseCase[]) => void;
}

export function UseCasesSection({ useCases, actors, onChange }: UseCasesSectionProps) {
    const [expandedUC, setExpandedUC] = useState<string | null>(null);

    const addUseCase = () => {
        const newUC = createEmptyUseCase();
        newUC.id = generateUseCaseId(useCases);
        // Pre-populate with first actor if available
        if (actors.length > 0) {
            newUC.actors = [actors[0].name];
        }
        onChange([...useCases, newUC]);
        setExpandedUC(newUC.id);
    };

    const updateUseCase = (index: number, updates: Partial<UseCase>) => {
        const updated = [...useCases];
        updated[index] = { ...updated[index], ...updates };
        onChange(updated);
    };

    const removeUseCase = (index: number) => {
        const ucToRemove = useCases[index];
        if (expandedUC === ucToRemove.id) {
            setExpandedUC(null);
        }
        onChange(useCases.filter((_, i) => i !== index));
    };

    const duplicateUseCase = (index: number) => {
        const original = useCases[index];
        const newUC: UseCase = {
            ...original,
            id: generateUseCaseId(useCases),
            name: `${original.name} (Copy)`,
            status: 'Draft',
        };
        onChange([...useCases, newUC]);
        setExpandedUC(newUC.id);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Use Case Specifications
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        Define detailed use cases with actors, flows, and conditions
                    </p>
                </div>
                <button
                    onClick={addUseCase}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Use Case
                </button>
            </div>

            {useCases.length === 0 ? (
                <EmptyState onAdd={addUseCase} />
            ) : (
                <div className="space-y-4">
                    {useCases.map((uc, index) => (
                        <UseCaseCard
                            key={uc.id}
                            useCase={uc}
                            index={index}
                            isExpanded={expandedUC === uc.id}
                            actors={actors}
                            onToggle={() => setExpandedUC(expandedUC === uc.id ? null : uc.id)}
                            onUpdate={(updates) => updateUseCase(index, updates)}
                            onRemove={() => removeUseCase(index)}
                            onDuplicate={() => duplicateUseCase(index)}
                        />
                    ))}
                </div>
            )}

            {/* Quick Add Templates */}
            {useCases.length === 0 && (
                <div className="p-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
                    <h4 className="text-yellow-300 font-medium text-sm mb-2">Common Use Case Templates</h4>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { name: 'User Login', actors: ['End User'] },
                            { name: 'User Registration', actors: ['Guest'] },
                            { name: 'View Dashboard', actors: ['End User'] },
                            { name: 'Manage Users', actors: ['Administrator'] },
                            { name: 'Process Payment', actors: ['End User', 'Payment Gateway'] },
                        ].map((template) => (
                            <button
                                key={template.name}
                                onClick={() => {
                                    const newUC = createEmptyUseCase();
                                    newUC.id = generateUseCaseId(useCases);
                                    newUC.name = template.name;
                                    newUC.actors = template.actors;
                                    onChange([...useCases, newUC]);
                                    setExpandedUC(newUC.id);
                                }}
                                className="px-3 py-1 bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-200 rounded-full text-sm transition-colors cursor-pointer"
                            >
                                + {template.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Empty State
function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10 border-dashed">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-600/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <h4 className="text-white font-medium mb-2">No use cases defined</h4>
            <p className="text-gray-400 text-sm mb-4">
                Use cases describe how actors interact with the system to achieve goals
            </p>
            <button
                onClick={onAdd}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors duration-200 cursor-pointer"
            >
                Add First Use Case
            </button>
        </div>
    );
}

// Use Case Card
function UseCaseCard({
    useCase,
    index,
    isExpanded,
    actors,
    onToggle,
    onUpdate,
    onRemove,
    onDuplicate,
}: {
    useCase: UseCase;
    index: number;
    isExpanded: boolean;
    actors: Actor[];
    onToggle: () => void;
    onUpdate: (updates: Partial<UseCase>) => void;
    onRemove: () => void;
    onDuplicate: () => void;
}) {
    const priorityColors = {
        High: 'bg-red-600/30 text-red-300 border-red-500/30',
        Medium: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/30',
        Low: 'bg-green-600/30 text-green-300 border-green-500/30',
    };

    const statusColors = {
        Draft: 'bg-gray-600/30 text-gray-300',
        Review: 'bg-blue-600/30 text-blue-300',
        Approved: 'bg-green-600/30 text-green-300',
    };

    const addFlowStep = () => {
        const newStep = createEmptyFlowStep(useCase.basicPath.length + 1);
        if (actors.length > 0) {
            newStep.actor = actors[0].name;
        }
        onUpdate({ basicPath: [...useCase.basicPath, newStep] });
    };

    const updateFlowStep = (stepIndex: number, updates: Partial<FlowStep>) => {
        const updated = [...useCase.basicPath];
        updated[stepIndex] = { ...updated[stepIndex], ...updates };
        onUpdate({ basicPath: updated });
    };

    const removeFlowStep = (stepIndex: number) => {
        const updated = useCase.basicPath
            .filter((_, i) => i !== stepIndex)
            .map((step, i) => ({ ...step, stepNumber: i + 1 }));
        onUpdate({ basicPath: updated });
    };

    return (
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all">
            {/* Card Header */}
            <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isExpanded ? 'bg-yellow-600' : 'bg-yellow-600/20'}`}>
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-gray-500">{useCase.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[useCase.priority]}`}>
                                {useCase.priority}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${statusColors[useCase.status]}`}>
                                {useCase.status}
                            </span>
                        </div>
                        <h4 className="text-white font-medium mt-1">
                            {useCase.name || <span className="text-gray-500 italic">Untitled Use Case</span>}
                        </h4>
                        {useCase.actors.length > 0 && (
                            <p className="text-gray-400 text-sm mt-0.5">
                                Actors: {useCase.actors.join(', ')}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">{useCase.basicPath.length} steps</span>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-white/10 p-5 space-y-6">
                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                            className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer text-sm flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Duplicate
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer text-sm flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    </div>

                    {/* Basic Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Use Case Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={useCase.name}
                                onChange={(e) => onUpdate({ name: e.target.value })}
                                placeholder="e.g. User Login"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Actors <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={useCase.actors.join(', ')}
                                onChange={(e) => onUpdate({ actors: e.target.value.split(',').map(a => a.trim()).filter(Boolean) })}
                                placeholder="e.g. End User, Admin"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                            <select
                                value={useCase.priority}
                                onChange={(e) => onUpdate({ priority: e.target.value as UseCase['priority'] })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all cursor-pointer"
                            >
                                <option value="High" className="bg-slate-800">High</option>
                                <option value="Medium" className="bg-slate-800">Medium</option>
                                <option value="Low" className="bg-slate-800">Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                            <select
                                value={useCase.status}
                                onChange={(e) => onUpdate({ status: e.target.value as UseCase['status'] })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all cursor-pointer"
                            >
                                <option value="Draft" className="bg-slate-800">Draft</option>
                                <option value="Review" className="bg-slate-800">Review</option>
                                <option value="Approved" className="bg-slate-800">Approved</option>
                            </select>
                        </div>
                    </div>

                    {/* Summary */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Summary Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={useCase.summary}
                            onChange={(e) => onUpdate({ summary: e.target.value })}
                            placeholder="Describe what this use case accomplishes..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Pre/Post Conditions */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Pre-Conditions</label>
                            <textarea
                                value={useCase.preconditions.join('\n')}
                                onChange={(e) => onUpdate({ preconditions: e.target.value.split('\n').filter(Boolean) })}
                                placeholder="One condition per line..."
                                rows={3}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Post-Conditions</label>
                            <textarea
                                value={useCase.postconditions.join('\n')}
                                onChange={(e) => onUpdate({ postconditions: e.target.value.split('\n').filter(Boolean) })}
                                placeholder="One condition per line..."
                                rows={3}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Basic Path */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Basic Path (Main Flow) <span className="text-red-400">*</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1">Describe the happy path scenario step by step</p>
                            </div>
                            <button
                                onClick={addFlowStep}
                                className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer text-sm flex items-center gap-1 bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Step
                            </button>
                        </div>

                        {useCase.basicPath.length === 0 ? (
                            <div className="p-6 bg-white/5 rounded-lg border border-white/10 border-dashed text-center">
                                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-sm">No steps defined yet.</p>
                                <p className="text-gray-500 text-xs mt-1">Add steps to describe how the actor interacts with the system.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {/* Column Headers */}
                                <div className="grid sm:grid-cols-12 gap-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    <div className="sm:col-span-1 text-center">#</div>
                                    <div className="sm:col-span-3">Actor</div>
                                    <div className="sm:col-span-4">Action</div>
                                    <div className="sm:col-span-4 pl-1">System Response</div>
                                </div>

                                {useCase.basicPath.map((step, stepIndex) => (
                                    <div key={stepIndex} className="flex items-start gap-2 p-2 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className="w-8 flex-shrink-0 flex items-center justify-center pt-2">
                                            <span className="w-6 h-6 rounded-full bg-yellow-600/20 text-yellow-300 flex items-center justify-center text-xs font-medium">
                                                {step.stepNumber}
                                            </span>
                                        </div>
                                        <div className="flex-1 grid sm:grid-cols-11 gap-2">
                                            <div className="sm:col-span-3">
                                                <input
                                                    type="text"
                                                    value={step.actor}
                                                    onChange={(e) => updateFlowStep(stepIndex, { actor: e.target.value })}
                                                    placeholder="Actor"
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="sm:col-span-4">
                                                <input
                                                    type="text"
                                                    value={step.action}
                                                    onChange={(e) => updateFlowStep(stepIndex, { action: e.target.value })}
                                                    placeholder="Action taken"
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="sm:col-span-4">
                                                <input
                                                    type="text"
                                                    value={step.systemResponse || ''}
                                                    onChange={(e) => updateFlowStep(stepIndex, { systemResponse: e.target.value })}
                                                    placeholder="Optional response"
                                                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-md text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFlowStep(stepIndex)}
                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove step"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Business Rules & NFR References */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Business Rules</label>
                            <input
                                type="text"
                                value={useCase.businessRules.join(', ')}
                                onChange={(e) => onUpdate({ businessRules: e.target.value.split(',').map(r => r.trim()).filter(Boolean) })}
                                placeholder="e.g. BR-001, BR-002"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">NFR References</label>
                            <input
                                type="text"
                                value={useCase.nfrReferences.join(', ')}
                                onChange={(e) => onUpdate({ nfrReferences: e.target.value.split(',').map(r => r.trim()).filter(Boolean) })}
                                placeholder="e.g. NFR-001, NFR-002"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
