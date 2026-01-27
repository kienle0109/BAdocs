import { NextRequest } from 'next/server';
import { generateDocumentStream } from '@/lib/ai/ai-service';
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
        const { inputMethod, data, template, aiProvider, language = 'en', type = 'BRD' } = body;

        // Validate inputs
        if (!data) {
            return new Response(JSON.stringify({ error: 'Input data is required' }), { status: 400 });
        }

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                let fullContent = '';
                let finalModel = '';
                let finalProvider = '';

                try {
                    const aiStream = generateDocumentStream({
                        type: type as 'BRD' | 'SRS' | 'FRD',
                        input: data,
                        template: template as 'IEEE' | 'IIBA',
                        provider: aiProvider as 'ollama' | 'gemini',
                        language: language as 'en' | 'vi',
                    });

                    for await (const chunk of aiStream) {
                        const content = chunk.content;
                        fullContent += content;
                        finalModel = chunk.model;
                        finalProvider = chunk.provider;

                        // Send chunk
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                    }


                    console.log('Stream finished. Full content length:', fullContent.length);

                    // Save to database after generation is complete
                    try {
                        console.log('Attempting to save document to DB...');
                        const document = await prisma.document.create({
                            data: {
                                type: type as 'BRD' | 'SRS' | 'FRD',
                                title: extractTitle(fullContent) || `Untitled ${type}`,
                                content: JSON.stringify({ inputMethod, rawInput: data }),
                                markdown: fullContent,
                                template,
                                createdAt: new Date(),
                                userId: user.id, // Added userId
                            },
                        });
                        console.log('Document saved:', document.id);

                        await prisma.generationHistory.create({
                            data: {
                                documentId: document.id,
                                inputData: JSON.stringify({ inputMethod, dataLength: data.length }),
                                aiProvider: finalProvider || aiProvider,
                                aiModel: finalModel || 'unknown',
                                tokensUsed: Math.ceil(fullContent.length / 4),
                                userId: user.id, // Added userId
                            },
                        });
                        console.log('History saved');

                        // Send final completion message with document ID
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ completed: true, documentId: document.id })}\n\n`));
                    } catch (dbError) {
                        console.error('Database save error:', dbError);
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Failed to save document' })}\n\n`));
                    }

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
