import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { parseFile } from '@/lib/file-parser';

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

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string || 'BRD';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        console.log(`[Upload] Processing file: ${file.name}, Type: ${type}`);

        // Parse file content
        const { content, title } = await parseFile(file);

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Failed to extract text from file' },
                { status: 400 }
            );
        }

        // Save to database
        const document = await prisma.document.create({
            data: {
                type: type, // BRD, SRS, FRD
                title: title || 'Uploaded Document',
                content: JSON.stringify({ inputMethod: 'upload', fileName: file.name }),
                markdown: content, // Store extracted text as markdown body
                template: 'Custom', // Mark as custom upload
                userId: user.id,
            },
        });

        console.log(`[Upload] Document saved: ${document.id}`);

        return NextResponse.json({
            success: true,
            document: {
                id: document.id,
                title: document.title,
                type: document.type,
                createdAt: document.createdAt
            }
        });

    } catch (error: any) {
        console.error('[Upload API Error]:', error);
        return NextResponse.json(
            { error: 'Failed to upload document', details: error.message },
            { status: 500 }
        );
    }
}
