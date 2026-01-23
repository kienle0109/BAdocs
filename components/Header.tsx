'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    showBack?: boolean;
    backHref?: string;
    backLabel?: string;
    title?: string;
    actions?: React.ReactNode;
}

export function Header({
    showBack = false,
    backHref = '/',
    backLabel = 'Back',
    title,
    actions
}: HeaderProps) {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home', icon: HomeIcon },
        { href: '/new', label: 'Create BRD', icon: PlusIcon },
        { href: '/history', label: 'History', icon: ClockIcon },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
            {/* Full-width container with proper padding */}
            <div className="w-full px-4 sm:px-6">
                <div className="flex items-center h-16 relative">
                    {/* Left Section - Logo (fixed left with 16-24px padding) */}
                    <div className="flex-shrink-0">
                        {showBack ? (
                            <Link
                                href={backHref}
                                className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer group"
                            >
                                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="hidden sm:inline text-sm font-medium">{backLabel}</span>
                            </Link>
                        ) : (
                            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="hidden sm:block text-white font-semibold text-lg group-hover:text-purple-300 transition-colors duration-200">BA Docs</span>
                            </Link>
                        )}
                    </div>

                    {/* Show title next to back button on sub-pages */}
                    {showBack && title && (
                        <div className="flex items-center gap-3 ml-4">
                            <div className="hidden sm:block h-5 w-px bg-white/20"></div>
                            <h1 className="text-white font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-[300px]">{title}</h1>
                        </div>
                    )}

                    {/* Center Navigation - Absolutely centered */}
                    {!showBack && (
                        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${active
                                                ? 'bg-white/10 text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    )}

                    {/* Right Section - Actions (pushed to right) */}
                    <div className="flex items-center gap-3 ml-auto">
                        {actions}

                        {/* Mobile Menu */}
                        {!showBack && (
                            <div className="md:hidden">
                                <MobileMenu navItems={navItems} isActive={isActive} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

// Mobile Menu Component
function MobileMenu({
    navItems,
    isActive
}: {
    navItems: { href: string; label: string; icon: React.FC<{ className?: string }> }[];
    isActive: (href: string) => boolean;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer rounded-lg hover:bg-white/5"
                aria-label="Toggle menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {open ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-slate-800 rounded-xl shadow-xl border border-white/10 z-50 py-2 overflow-hidden">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 cursor-pointer ${active
                                            ? 'bg-purple-600/20 text-white border-l-2 border-purple-500'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

// Icon Components
function HomeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}
