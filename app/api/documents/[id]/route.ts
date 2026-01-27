import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

// GET /api/documents/[id] - Get single document
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const document = await prisma.document.findFirst({
            where: {
                id,
                userId: user.id
            },
            include: {
                source: {
                    select: {
                        id: true,
                        type: true,
                        title: true,
                    },
                },
                children: {
                    select: {
                        id: true,
                        type: true,
                        title: true,
                    },
                },
            },
        });

        if (!document) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            document,
        });

    } catch (error: any) {
        console.error('Get Document Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch document',
                details: error.message,
            },
            { status: 500 }
        );
    }
}

// DELETE /api/documents/[id] - Delete a document
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const result = await prisma.document.deleteMany({
            where: {
                id,
                userId: user.id
            },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: 'Document not found or access denied' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Document deleted successfully',
        });

    } catch (error: any) {
        console.error('Delete Document Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to delete document',
                details: error.message,
            },
            { status: 500 }
        );
    }
}
