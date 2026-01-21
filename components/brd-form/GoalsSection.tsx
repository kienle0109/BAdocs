'use client';

import { BusinessGoals, SuccessMetric, generateId } from '@/lib/brd-form-utils';

interface GoalsSectionProps {
    data: BusinessGoals;
    onChange: (data: BusinessGoals) => void;
    errors?: { [key: string]: string };
}

export function GoalsSection({ data, onChange, errors = {} }: GoalsSectionProps) {
    const handleGoalChange = (index: number, value: string) => {
        const newGoals = [...data.primary];
        newGoals[index] = value;
        onChange({ ...data, primary: newGoals });
    };

    const addGoal = () => {
        onChange({ ...data, primary: [...data.primary, ''] });
    };

    const removeGoal = (index: number) => {
        const newGoals = data.primary.filter((_, i) => i !== index);
        onChange({ ...data, primary: newGoals.length > 0 ? newGoals : [''] });
    };

    const addMetric = () => {
        const newMetric: SuccessMetric = {
            id: generateId(),
            name: '',
            baseline: '',
            target: '',
            method: '',
        };
        onChange({ ...data, metrics: [...data.metrics, newMetric] });
    };

    const updateMetric = (id: string, field: keyof SuccessMetric, value: string) => {
        const newMetrics = data.metrics.map(m =>
            m.id === id ? { ...m, [field]: value } : m
        );
        onChange({ ...data, metrics: newMetrics });
    };

    const removeMetric = (id: string) => {
        const newMetrics = data.metrics.filter(m => m.id !== id);
        onChange({ ...data, metrics: newMetrics });
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Section 3: Business Goals & Objectives
            </h3>

            <div className="space-y-6">
                {/* Primary Goals */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Primary Goals <span className="text-red-400">*</span>
                        <span className="text-gray-400 text-xs ml-2">(one per line)</span>
                    </label>
                    {data.primary.map((goal, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={goal}
                                onChange={(e) => handleGoalChange(index, e.target.value)}
                                placeholder={`Goal ${index + 1}: e.g., Increase online sales by 30%`}
                                className="flex-1 bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {data.primary.length > 1 && (
                                <button
                                    onClick={() => removeGoal(index)}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={addGoal}
                        className="mt-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm"
                    >
                        + Add Goal
                    </button>
                    {errors.goals && (
                        <p className="text-red-400 text-sm mt-2">{errors.goals}</p>
                    )}
                </div>

                {/* Success Metrics Table */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Success Metrics (KPIs) <span className="text-red-400">*</span>
                    </label>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-white/20 rounded-lg">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="text-left text-white text-sm p-3 border-b border-white/20">Metric Name</th>
                                    <th className="text-left text-white text-sm p-3 border-b border-white/20">Baseline</th>
                                    <th className="text-left text-white text-sm p-3 border-b border-white/20">Target</th>
                                    <th className="text-left text-white text-sm p-3 border-b border-white/20">Measurement</th>
                                    <th className="text-left text-white text-sm p-3 border-b border-white/20 w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.metrics.map((metric) => (
                                    <tr key={metric.id}>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={metric.name}
                                                onChange={(e) => updateMetric(metric.id, 'name', e.target.value)}
                                                placeholder="e.g., Cart abandonment rate"
                                                className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={metric.baseline}
                                                onChange={(e) => updateMetric(metric.id, 'baseline', e.target.value)}
                                                placeholder="35%"
                                                className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={metric.target}
                                                onChange={(e) => updateMetric(metric.id, 'target', e.target.value)}
                                                placeholder="20%"
                                                className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={metric.method}
                                                onChange={(e) => updateMetric(metric.id, 'method', e.target.value)}
                                                placeholder="Analytics tracking"
                                                className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <button
                                                onClick={() => removeMetric(metric.id)}
                                                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition text-sm"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        onClick={addMetric}
                        className="mt-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm"
                    >
                        + Add Metric
                    </button>
                    {errors.metrics && (
                        <p className="text-red-400 text-sm mt-2">{errors.metrics}</p>
                    )}
                </div>

                {/* Target Timeline */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Target Timeline
                    </label>
                    <input
                        type="text"
                        value={data.timeline || ''}
                        onChange={(e) => onChange({ ...data, timeline: e.target.value })}
                        placeholder="e.g., 6 months from approval"
                        className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>
        </div>
    );
}
