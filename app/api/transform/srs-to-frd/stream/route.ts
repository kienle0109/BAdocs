import { NextRequest } from 'next/server';
import { transformDocumentStream } from '@/lib/ai/ai-service';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const body = await request.json();
        const { srsId, template, aiProvider, language = 'en' } = body;

        // Validate inputs
        if (!srsId) {
            return new Response(JSON.stringify({ error: 'SRS ID is required' }), { status: 400 });
        }

        // Fetch source SRS
        const srs = await prisma.document.findFirst({
            where: {
                id: srsId,
                userId: user.id
            },
        });

        if (!srs || srs.type !== 'SRS') {
            return new Response(JSON.stringify({ error: 'Valid SRS document not found or access denied' }), { status: 404 });
        }

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                let fullContent = '';
                let finalModel = '';
                let finalProvider = '';

                try {
                    const aiStream = transformDocumentStream({
                        from: 'SRS',
                        to: 'FRD',
                        sourceContent: srs.markdown,
                        template: template as 'IEEE' | 'IIBA',
                        provider: aiProvider as 'ollama' | 'gemini',
                        language: language as 'en' | 'vi',
                    });

                    for await (const chunk of aiStream) {
                        const content = chunk.content;
                        fullContent += content;
                        finalModel = chunk.model;
                        finalProvider = chunk.provider;

                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                    }

                    // Save FRD to database
                    const frd = await prisma.document.create({
                        data: {
                            type: 'FRD',
                            title: extractTitle(fullContent) || `FRD derived from ${srs.title}`,
                            content: JSON.stringify({ sourceSrsId: srsId }),
                            markdown: fullContent,
                            template,
                            sourceId: srsId,
                            userId: user.id,
                            createdAt: new Date(),
                        },
                    });

                    await prisma.generationHistory.create({
                        data: {
                            documentId: frd.id,
                            userId: user.id,
                            inputData: JSON.stringify({ sourceSrsId: srsId }),
                            aiProvider: finalProvider,
                            aiModel: finalModel,
                            tokensUsed: Math.ceil(fullContent.length / 4),
                        },
                    });

                    // Send final completion message with document ID
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ completed: true, documentId: frd.id })}\n\n`));

                } catch (error: any) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

function extractTitle(markdown: string): string | null {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1] : null;
}
