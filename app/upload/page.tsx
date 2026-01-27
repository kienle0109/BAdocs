'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

export default function UploadPage() {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [docType, setDocType] = useState('BRD');

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', docType);

        try {
            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const result = await response.json();
            router.push(`/preview/${result.document.id}`);

        } catch (error: any) {
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    }, [docType, router]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt'],
            'text/markdown': ['.md'],
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1
    });

    return (
        <div className="h-screen bg-slate-950 flex flex-col font-sans text-slate-200">
            <Header showBack backHref="/" title="Upload Existing Document" />

            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-xl space-y-8">

                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Import Document</h2>
                        <p className="text-slate-400">Upload an existing BRD, SRS, or FRD to manage within the system.</p>
                    </div>

                    {/* Type Selector */}
                    <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800 flex">
                        {['BRD', 'SRS', 'FRD'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setDocType(type)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${docType === type
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Dropzone */}
                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                            ${isDragActive
                                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
                                : 'border-slate-800 hover:border-slate-600 hover:bg-slate-900/30'
                            }
                            ${isUploading ? 'opacity-50 pointer-events-none animate-pulse' : ''}
                        `}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center">
                                {isUploading ? (
                                    <svg className="w-8 h-8 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                )}
                            </div>
                            <div>
                                <p className="text-lg font-medium text-slate-200">
                                    {isUploading ? 'Uploading & Parsing...' : 'Drop your file here, or click to browse'}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                    Supports PDF, Word (.docx), Markdown (.md), Text (.txt)
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
