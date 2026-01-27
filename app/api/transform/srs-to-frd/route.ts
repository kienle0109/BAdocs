import { NextRequest, NextResponse } from 'next/server';
import { transformDocument } from '@/lib/ai/ai-service';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

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
        const { srsId, template, aiProvider } = body;

        // Validate inputs
        if (!srsId) {
            return NextResponse.json(
                { error: 'SRS ID is required' },
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

        // Fetch source SRS
        const srs = await prisma.document.findUnique({
            where: { id: srsId },
        });

        if (!srs) {
            return NextResponse.json(
                { error: 'SRS document not found' },
                { status: 404 }
            );
        }

        if (srs.type !== 'SRS') {
            return NextResponse.json(
                { error: 'Source document must be an SRS' },
                { status: 400 }
            );
        }

        // Transform SRS → FRD using AI
        const startTime = Date.now();
        const result = await transformDocument({
            from: 'SRS',
            to: 'FRD',
            sourceContent: srs.markdown,
            template: template as 'IEEE' | 'IIBA',
            provider: aiProvider as 'ollama' | 'gemini',
        });

        const generationTime = Date.now() - startTime;

        // Save FRD to database
        const frd = await prisma.document.create({
            data: {
                type: 'FRD',
                title: extractTitle(result.content) || `FRD derived from ${srs.title}`,
                content: JSON.stringify({ sourceSrsId: srsId }),
                markdown: result.content,
                template,
                sourceId: srsId, // Link to parent SRS
                userId: user.id, // Added userId
            },
        });

        // Save generation history
        await prisma.generationHistory.create({
            data: {
                documentId: frd.id,
                inputData: JSON.stringify({ sourceSrsId: srsId }),
                aiProvider: result.provider,
                aiModel: result.model,
                tokensUsed: estimateTokens(srs.markdown + result.content),
                userId: user.id, // Added userId
            },
        });

        return NextResponse.json({
            success: true,
            document: {
                id: frd.id,
                title: frd.title,
                markdown: frd.markdown,
                template: frd.template,
                sourceId: frd.sourceId,
                createdAt: frd.createdAt,
            },
            meta: {
                provider: result.provider,
                model: result.model,
                generationTime: `${generationTime}ms`,
            },
        });

    } catch (error: any) {
        console.error('SRS→FRD Transformation Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to transform SRS to FRD',
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
