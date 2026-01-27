// app/frd/new/page.tsx
'use client';

import { Header } from '@/components/Header';
import { FRDForm } from '@/components/frd-form/FRDForm';

export default function NewFRDPage() {
    return (
        <div className="h-screen bg-slate-950 flex flex-col font-sans">
            <Header showBack backHref="/frd" title="Create New FRD" />
            <main className="flex-1 overflow-y-auto w-full">
                <FRDForm />
            </main>
        </div>
    );
}
