import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {

        // Fetch document
        const document = await prisma.document.findUnique({
            where: { id },
        });

        if (!document) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        // Create filename
        const filename = `${document.type}-${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;

        // Add YAML frontmatter
        const exportContent = `---
title: ${document.title}
type: ${document.type}
template: ${document.template}
generated: ${document.createdAt.toISOString()}
updated: ${document.updatedAt.toISOString()}
${document.sourceId ? `source_document_id: ${document.sourceId}` : ''}
---

${document.markdown}
`;

        // Return as downloadable file
        return new NextResponse(exportContent, {
            headers: {
                'Content-Type': 'text/markdown',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error: any) {
        console.error('Export Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to export document',
                details: error.message,
            },
            { status: 500 }
        );
    }
}
