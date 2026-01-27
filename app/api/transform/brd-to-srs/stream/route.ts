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
        const { brdId, template, aiProvider, language = 'en' } = body;

        // Validate inputs
        if (!brdId) {
            return new Response(JSON.stringify({ error: 'BRD ID is required' }), { status: 400 });
        }

        // Fetch source BRD - Optionally enforce ownership here too, but strictly only strictly needed for output assignment
        // Since get is public currently (but filtered in UI), let's just find it. 
        // Ideally we should also check if the user owns the source ID or has access to it.
        // For strict multi-tenancy:
        const brd = await prisma.document.findFirst({
            where: {
                id: brdId,
                userId: user.id
            },
        });

        if (!brd || brd.type !== 'BRD') {
            return new Response(JSON.stringify({ error: 'Valid BRD document not found or access denied' }), { status: 404 });
        }

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                let fullContent = '';
                let finalModel = '';
                let finalProvider = '';

                try {
                    const aiStream = transformDocumentStream({
                        from: 'BRD',
                        to: 'SRS',
                        sourceContent: brd.markdown,
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

                    // Save SRS to database
                    const srs = await prisma.document.create({
                        data: {
                            type: 'SRS',
                            title: extractTitle(fullContent) || `SRS derived from ${brd.title}`,
                            content: JSON.stringify({ sourceBrdId: brdId }),
                            markdown: fullContent,
                            template,
                            sourceId: brdId,
                            userId: user.id,
                            createdAt: new Date(),
                        },
                    });

                    await prisma.generationHistory.create({
                        data: {
                            documentId: srs.id,
                            userId: user.id,
                            inputData: JSON.stringify({ sourceBrdId: brdId }),
                            aiProvider: finalProvider,
                            aiModel: finalModel,
                            tokensUsed: Math.ceil(fullContent.length / 4),
                        },
                    });

                    // Send final completion message with document ID
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ completed: true, documentId: srs.id })}\n\n`));

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
