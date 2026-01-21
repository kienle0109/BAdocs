'use client';

import { getCompletionPercentage } from '@/lib/brd-form-utils';

interface ValidationSummaryProps {
    errors: { [key: string]: string };
    formData: any;
}

export function ValidationSummary({ errors, formData }: ValidationSummaryProps) {
    const errorCount = Object.keys(errors).length;
    const completionPercentage = getCompletionPercentage(formData);

    if (errorCount === 0 && completionPercentage === 100) {
        return null; // No need to show summary if all is good
    }

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 mb-6">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Form Completion</h4>
                <span className={`text-sm font-medium ${completionPercentage === 100 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                    {completionPercentage}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                <div
                    className={`h-2 rounded-full transition-all ${completionPercentage === 100 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                    style={{ width: `${completionPercentage}%` }}
                />
            </div>

            {/* Errors */}
            {errorCount > 0 && (
                <div className="space-y-1">
                    <p className="text-red-400 text-sm font-medium mb-2">
                        {errorCount} required {errorCount === 1 ? 'field' : 'fields'} missing:
                    </p>
                    <ul className="space-y-1">
                        {Object.entries(errors).map(([key, message]) => (
                            <li key={key} className="text-red-300 text-sm flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                <span>{message}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Completion Hint */}
            {errorCount === 0 && completionPercentage < 100 && (
                <p className="text-yellow-300 text-sm">
                    ✓ All required fields complete. Consider adding optional information for a more comprehensive BRD.
                </p>
            )}
        </div>
    );
}
