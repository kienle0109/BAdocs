// app/srs/page.tsx
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';

export default function SRSPage() {
    return (
        <div className="h-screen bg-slate-950 flex flex-col overflow-hidden font-sans">
            <Header showBack backHref="/" title="Software Requirements" />

            <main className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col items-center justify-center">
                <div className="max-w-5xl w-full">

                    <div className="text-center mb-12 space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Create SRS Document</h1>
                        <p className="text-slate-400 max-w-lg mx-auto">Select a method to generate your System Requirement Specifications</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* New from Scratch */}
                        <Link href="/srs/new" className="group p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-indigo-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>

                            <div className="w-14 h-14 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center mb-6 transition-colors">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors">Start from Scratch</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Manually input system requirements using our guided template wizard. Best for new projects without existing documentation.
                            </p>
                        </Link>

                        {/* Transform from BRD */}
                        <Link href="/srs/from-brd" className="group p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-indigo-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>

                            <div className="w-14 h-14 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center mb-6 transition-colors">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">Transform from BRD</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Use AI to analyze an existing Business Requirement Document and automatically generate detailed system specs.
                            </p>
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
}
