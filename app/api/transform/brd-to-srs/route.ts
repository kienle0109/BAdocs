import { NextRequest, NextResponse } from 'next/server';
import { transformDocument } from '@/lib/ai/ai-service';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { brdId, template, aiProvider } = body;

        // Validate inputs
        if (!brdId) {
            return NextResponse.json(
                { error: 'BRD ID is required' },
                { status: 400 }
            );
        }

        if (!template || !['IEEE', 'IIBA'].includes(template)) {
            return NextResponse.json(
                { error: 'Invalid template. Must be IEEE or IIBA' },
                { status: 400 }
            );
        }

        if (!aiProvider || !['ollama', 'gemini'].includes(aiProvider)) {
            return NextResponse.json(
                { error: 'Invalid AI provider. Must be ollama or gemini' },
                { status: 400 }
            );
        }

        // Fetch source BRD
        const brd = await prisma.document.findUnique({
            where: { id: brdId },
        });

        if (!brd) {
            return NextResponse.json(
                { error: 'BRD document not found' },
                { status: 404 }
            );
        }

        if (brd.type !== 'BRD') {
            return NextResponse.json(
                { error: 'Source document must be a BRD' },
                { status: 400 }
            );
        }

        // Transform BRD → SRS using AI
        const startTime = Date.now();
        const result = await transformDocument({
            from: 'BRD',
            to: 'SRS',
            sourceContent: brd.markdown,
            template: template as 'IEEE' | 'IIBA',
            provider: aiProvider as 'ollama' | 'gemini',
        });

        const generationTime = Date.now() - startTime;

        // Save SRS to database
        const srs = await prisma.document.create({
            data: {
                type: 'SRS',
                title: extractTitle(result.content) || `SRS derived from ${brd.title}`,
                content: JSON.stringify({ sourceBrdId: brdId }),
                markdown: result.content,
                template,
                sourceId: brdId, // Link to parent BRD
            },
        });

        // Save generation history
        await prisma.generationHistory.create({
            data: {
                documentId: srs.id,
                inputData: JSON.stringify({ sourceBrdId: brdId }),
                aiProvider: result.provider,
                aiModel: result.model,
                tokensUsed: estimateTokens(brd.markdown + result.content),
            },
        });

        return NextResponse.json({
            success: true,
            document: {
                id: srs.id,
                title: srs.title,
                markdown: srs.markdown,
                template: srs.template,
                sourceId: srs.sourceId,
                createdAt: srs.createdAt,
            },
            meta: {
                provider: result.provider,
                model: result.model,
                generationTime: `${generationTime}ms`,
            },
        });

    } catch (error: any) {
        console.error('BRD→SRS Transformation Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to transform BRD to SRS',
                details: error.message,
            },
            { status: 500 }
        );
    }
}

function extractTitle(markdown: string): string | null {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1] : null;
}

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}
