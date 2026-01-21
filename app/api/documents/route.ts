import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/documents - List all documents
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // Filter by BRD/SRS/FRD
        const search = searchParams.get('search'); // Search in title

        const where: any = {};

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
