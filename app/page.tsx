// app/page.tsx

import Link from "next/link";
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Header />

      <main className="flex flex-col items-center justify-center p-8 sm:p-20 text-center min-h-[calc(100vh-64px)]">
        {/* Simple Hero */}
        <div className="max-w-4xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI-Powered Business Analysis
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            Business Analyst <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Document Generator
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Transform your requirements into professional documentation with the power of advanced AI models. Secure, fast, and standard-compliant.
          </p>
        </div>

        {/* Action Grid (File Explorer Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          {[
            { title: "Create BRD", desc: "Start with high-level Business Requirements", href: "/new", icon: "document", color: "blue" },
            { title: "Generate SRS", desc: "Transform BRD into detailed System Specs", href: "/srs", icon: "cpu", color: "purple" },
            { title: "Design FRD", desc: "Create Functional Requirements from SRS", href: "/frd", icon: "chart", color: "emerald" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-24 h-24 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                </svg>
              </div>

              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-slate-800 group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-400 transition-colors`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon === 'document' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                  {item.icon === 'cpu' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />}
                  {item.icon === 'chart' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                </svg>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{item.title}</h3>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-800 bg-slate-950">
        <p>© 2026 BA Docs Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}
