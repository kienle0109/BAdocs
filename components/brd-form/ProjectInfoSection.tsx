'use client';

import { ProjectInfo } from '@/lib/brd-form-utils';

interface ProjectInfoSectionProps {
    data: ProjectInfo;
    onChange: (data: ProjectInfo) => void;
    errors?: { [key: string]: string };
}

export function ProjectInfoSection({ data, onChange, errors = {} }: ProjectInfoSectionProps) {
    const handleChange = (field: keyof ProjectInfo, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📁</span>
                Section 1: Project Information
            </h3>

            <div className="space-y-4">
                {/* Project Name */}
                <div>
                    <label className="block text-white text-sm font-medium mb-2">
                        Project Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.projectName}
                        onChange={(e) => handleChange('projectName', e.target.value)}
                        placeholder="e.g., E-commerce Platform Modernization"
                        className={`w-full bg-slate-900/50 text-white border ${errors.projectName ? 'border-red-500' : 'border-white/20'
                            } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    {errors.projectName && (
                        <p className="text-red-400 text-sm mt-1">{errors.projectName}</p>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Project Code */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Project Code
                        </label>
                        <input
                            type="text"
                            value={data.projectCode || ''}
                            onChange={(e) => handleChange('projectCode', e.target.value)}
                            placeholder="e.g., PROJ-2026-001"
                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Version */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Document Version
                        </label>
                        <input
                            type="text"
                            value={data.version}
                            onChange={(e) => handleChange('version', e.target.value)}
                            placeholder="1.0"
                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Prepared By */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Prepared By <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.preparedBy}
                            onChange={(e) => handleChange('preparedBy', e.target.value)}
                            placeholder="Your name or team name"
                            className={`w-full bg-slate-900/50 text-white border ${errors.preparedBy ? 'border-red-500' : 'border-white/20'
                                } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                        {errors.preparedBy && (
                            <p className="text-red-400 text-sm mt-1">{errors.preparedBy}</p>
                        )}
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Department/Division
                        </label>
                        <input
                            type="text"
                            value={data.department || ''}
                            onChange={(e) => handleChange('department', e.target.value)}
                            placeholder="e.g., IT Department"
                            className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Date */}
                <div className="md:w-1/2">
                    <label className="block text-white text-sm font-medium mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        value={data.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="w-full bg-slate-900/50 text-white border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>
        </div>
    );
}
