
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';

export async function GET() {
    const results: any = {
        supabase: { status: 'pending' },
        prisma: { status: 'pending' }
    };

    try {
        // Test Prisma (Database Direct)
        await prisma.$queryRaw`SELECT 1`;
        results.prisma = { status: 'ok', message: 'Connected to Database via Prisma' };
    } catch (error: any) {
        results.prisma = { status: 'error', message: error.message };
    }

    try {
        // Test Supabase (API)
        const supabase = await createClient();
        // Just check session or auth status, or simple query
        const { data, error } = await supabase.from('Document').select('count', { count: 'exact', head: true });

        if (error) throw error;
        results.supabase = { status: 'ok', message: 'Connected to Supabase API', count: data };
    } catch (error: any) {
        results.supabase = { status: 'error', message: error.message };
    }

    return NextResponse.json(results);
}
