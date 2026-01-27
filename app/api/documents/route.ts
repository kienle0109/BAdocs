import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

// GET /api/documents - List all documents
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // Filter by BRD/SRS/FRD
        const search = searchParams.get('search'); // Search in title

        const where: any = {
            userId: user.id
        };

        if (type && ['BRD', 'SRS', 'FRD'].includes(type)) {
            where.type = type;
        }

        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive',
            };
        }

        const documents = await prisma.document.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                type: true,
                title: true,
                template: true,
                sourceId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            documents,
            total: documents.length,
        });

    } catch (error: any) {
        console.error('List Documents Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to list documents',
                details: error.message,
            },
            { status: 500 }
        );
    }
}

// POST /api/documents - Create a new document (manual save)
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, type, content, markdown, template, sdlcModel } = body;

        if (!title || !type || !content) {
            return NextResponse.json(
                { error: 'Missing required fields: title, type, content' },
                { status: 400 }
            );
        }

        const document = await prisma.document.create({
            data: {
                title,
                type,
                content,
                markdown: markdown || '',
                template: template || 'Standard',
                sdlcModel: sdlcModel || 'waterfall',
                userId: user.id,
            },
        });

        return NextResponse.json({
            success: true,
            document,
        });

    } catch (error: any) {
        console.error('Create Document Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to create document',
                details: error.message,
            },
            { status: 500 }
        );
    }
}
