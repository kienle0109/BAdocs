// app/srs/new/page.tsx
'use client';

import { Header } from '@/components/Header';
import { SRSForm } from '@/components/srs-form/SRSForm';

export default function NewSRSPage() {
    return (
        <div className="h-screen bg-slate-950 flex flex-col font-sans">
            <Header showBack backHref="/srs" title="Create New SRS" />
            <main className="flex-1 overflow-y-auto w-full">
                <SRSForm />
            </main>
        </div>
    );
}
