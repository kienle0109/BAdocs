import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/documents/[id] - Get single document
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {

        const document = await prisma.document.findUnique({
            where: { id },
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

        await prisma.document.delete({
            where: { id },
        });

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
