'use client';

import { Stakeholder, generateId } from '@/lib/brd-form-utils';

interface StakeholdersSectionProps {
    stakeholders: Stakeholder[];
    onChange: (stakeholders: Stakeholder[]) => void;
    errors?: { [key: string]: string };
}

const INTEREST_LEVELS = ['High', 'Medium', 'Low'] as const;
const INFLUENCE_LEVELS = ['High', 'Medium', 'Low'] as const;
const ROLES = ['Sponsor', 'Approver', 'Contributor', 'Informed'] as const;

export function StakeholdersSection({ stakeholders, onChange, errors = {} }: StakeholdersSectionProps) {
    const addStakeholder = () => {
        const newStakeholder: Stakeholder = {
            id: generateId(),
            name: '',
            department: '',
            interest: 'Medium',
            influence: 'Medium',
            role: 'Contributor',
        };
        onChange([...stakeholders, newStakeholder]);
    };

    const updateStakeholder = (id: string, field: keyof Stakeholder, value: any) => {
        const updated = stakeholders.map(sh =>
            sh.id === id ? { ...sh, [field]: value } : sh
        );
        onChange(updated);
    };

    const removeStakeholder = (id: string) => {
        const updated = stakeholders.filter(sh => sh.id !== id);
        onChange(updated);
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Section 4: Stakeholders
            </h3>

            <div>
                <label className="block text-white text-sm font-medium mb-3">
                    Stakeholder List <span className="text-red-400">*</span>
                    <span className="text-gray-400 text-xs ml-2">(minimum 2 stakeholders)</span>
                </label>

                <div className="overflow-x-auto">
                    <table className="w-full border border-white/20 rounded-lg">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="text-left text-white text-sm p-3 border-b border-white/20">Name/Role</th>
                                <th className="text-left text-white text-sm p-3 border-b border-white/20">Department</th>
                                <th className="text-left text-white text-sm p-3 border-b border-white/20">Interest</th>
                                <th className="text-left text-white text-sm p-3 border-b border-white/20">Influence</th>
                                <th className="text-left text-white text-sm p-3 border-b border-white/20">Role</th>
                                <th className="text-left text-white text-sm p-3 border-b border-white/20 w-16"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {stakeholders.map((sh) => (
                                <tr key={sh.id}>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={sh.name}
                                            onChange={(e) => updateStakeholder(sh.id, 'name', e.target.value)}
                                            placeholder="e.g., Sarah Johnson (CTO)"
                                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={sh.department}
                                            onChange={(e) => updateStakeholder(sh.id, 'department', e.target.value)}
                                            placeholder="IT"
                                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <select
                                            value={sh.interest}
                                            onChange={(e) => updateStakeholder(sh.id, 'interest', e.target.value)}
                                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            {INTEREST_LEVELS.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <select
                                            value={sh.influence}
                                            onChange={(e) => updateStakeholder(sh.id, 'influence', e.target.value)}
                                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            {INFLUENCE_LEVELS.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <select
                                            value={sh.role}
                                            onChange={(e) => updateStakeholder(sh.id, 'role', e.target.value)}
                                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            {ROLES.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => removeStakeholder(sh.id)}
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
                    onClick={addStakeholder}
                    className="mt-3 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm"
                >
                    + Add Stakeholder
                </button>

                {errors.stakeholders && (
                    <p className="text-red-400 text-sm mt-2">{errors.stakeholders}</p>
                )}
            </div>
        </div>
    );
}
