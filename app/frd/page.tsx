// app/frd/page.tsx
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';

export default function FRDPage() {
    return (
        <div className="h-screen bg-slate-950 flex flex-col overflow-hidden font-sans">
            <Header showBack backHref="/" title="Functional Requirements" />

            <main className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col items-center justify-center">
                <div className="max-w-5xl w-full">

                    <div className="text-center mb-12 space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Create FRD Document</h1>
                        <p className="text-slate-400 max-w-lg mx-auto">Generate detailed functional specifications for developers.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* New from Scratch */}
                        <Link href="/frd/new" className="group p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-emerald-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>

                            <div className="w-14 h-14 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center mb-6 transition-colors">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors">Start from Scratch</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Manually input inputs, outputs, and processing logic. Suitable for specific feature components.
                            </p>
                        </Link>

                        {/* Transform from SRS */}
                        <Link href="/frd/from-srs" className="group p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-emerald-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>

                            <div className="w-14 h-14 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center mb-6 transition-colors">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">Transform from SRS</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Use AI to break down high-level System Requirements into granular Functional Requirements.
                            </p>
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
}
