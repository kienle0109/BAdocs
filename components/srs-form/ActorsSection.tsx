'use client';

import { type Actor, createEmptyActor } from '@/lib/srs-form-utils';

interface ActorsSectionProps {
    actors: Actor[];
    onChange: (actors: Actor[]) => void;
}

export function ActorsSection({ actors, onChange }: ActorsSectionProps) {
    const addActor = () => {
        onChange([...actors, createEmptyActor()]);
    };

    const updateActor = (index: number, field: keyof Actor, value: string) => {
        const updated = [...actors];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeActor = (index: number) => {
        onChange(actors.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        System Actors
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        Define all users and external systems that interact with this system
                    </p>
                </div>
                <button
                    onClick={addActor}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Actor
                </button>
            </div>

            {actors.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10 border-dashed">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h4 className="text-white font-medium mb-2">No actors defined</h4>
                    <p className="text-gray-400 text-sm mb-4">
                        Add actors who will interact with the system (e.g., End User, Admin, External API)
                    </p>
                    <button
                        onClick={addActor}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 cursor-pointer"
                    >
                        Add First Actor
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {actors.map((actor, index) => (
                        <div
                            key={actor.id}
                            className="bg-white/5 rounded-lg p-5 border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-xs text-gray-500 font-mono">{actor.id}</span>
                                <button
                                    onClick={() => removeActor(index)}
                                    className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer p-1"
                                    title="Remove actor"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Actor Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={actor.name}
                                        onChange={(e) => updateActor(index, 'name', e.target.value)}
                                        placeholder="e.g. End User"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={actor.type}
                                        onChange={(e) => updateActor(index, 'type', e.target.value)}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                                    >
                                        <option value="Primary" className="bg-slate-800">Primary</option>
                                        <option value="Secondary" className="bg-slate-800">Secondary</option>
                                        <option value="External System" className="bg-slate-800">External System</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={actor.description}
                                        onChange={(e) => updateActor(index, 'description', e.target.value)}
                                        placeholder="Brief description"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Common Actors Suggestions */}
            {actors.length === 0 && (
                <div className="space-y-4">
                    <div className="p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="text-purple-300 font-medium text-sm">Actor Types Guide</h4>
                                <ul className="text-gray-400 text-sm mt-1 list-disc list-inside space-y-1">
                                    <li><span className="text-white">Primary:</span> Person/system initiating interaction to achieve a goal</li>
                                    <li><span className="text-white">Secondary:</span> Person/system assisting the primary actor</li>
                                    <li><span className="text-white">External System:</span> Third-party API, database, or device</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <h4 className="text-gray-300 font-medium text-sm mb-2">Common Actors</h4>
                        <div className="flex flex-wrap gap-2">
                            {['End User', 'Administrator', 'Guest', 'System Admin', 'External API', 'Payment Gateway'].map((name) => (
                                <button
                                    key={name}
                                    onClick={() => {
                                        const newActor = createEmptyActor();
                                        newActor.name = name;
                                        newActor.type = name.includes('API') || name.includes('Gateway') ? 'External System' : 'Primary';
                                        onChange([...actors, newActor]);
                                    }}
                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-full text-sm transition-colors cursor-pointer border border-white/5"
                                >
                                    + {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
