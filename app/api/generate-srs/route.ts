import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/lib/ai/ai-service';
import { type SRSInput } from '@/lib/ai/prompts/srs-generator';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            inputMethod,
            data,
            sourceBrdId,
            template = 'IEEE',
            aiProvider = 'gemini',
            language = 'en',
            sdlc = 'waterfall'
        } = body;

        // Validate input method
        if (!['quick', 'guided', 'from-brd'].includes(inputMethod)) {
            return NextResponse.json(
                { success: false, error: 'Invalid input method. Must be quick, guided, or from-brd.' },
                { status: 400 }
            );
        }

        let srsInput: SRSInput;
        let sourceBrdTitle: string | null = null;

        // Construct SRSInput based on method
        if (inputMethod === 'from-brd') {
            if (!sourceBrdId) {
                return NextResponse.json(
                    { success: false, error: 'Source BRD ID is required for from-brd input method.' },
                    { status: 400 }
                );
            }

            // Fetch the source BRD
            const sourceBrd = await prisma.document.findUnique({
                where: { id: sourceBrdId },
            });

            if (!sourceBrd) {
                return NextResponse.json(
                    { success: false, error: 'Source BRD not found.' },
                    { status: 404 }
                );
            }

            sourceBrdTitle = sourceBrd.title;
            srsInput = {
                projectInfo: {
                    name: sourceBrd.title,
                    description: `Generated from BRD: ${sourceBrd.title}`,
                    // Domain could be inferred or left for AI
                },
                brdContent: sourceBrd.markdown
            };

        } else if (inputMethod === 'guided') {
            // Guided mode - structured form data
            if (!data || typeof data !== 'object') {
                return NextResponse.json(
                    { success: false, error: 'Structured form data is required for guided mode.' },
                    { status: 400 }
                );
            }

            const formData = data; // Assuming it matches SRSFormData roughly or we map it

            srsInput = {
                projectInfo: {
                    name: formData.documentInfo?.projectName || 'Untitled SRS',
                    description: formData.systemOverview?.purpose || '',
                    domain: formData.systemOverview?.domain // If we had this field, else undefined
                },
                actors: formData.actors?.map((a: any) => `${a.name} (${a.type})`) || [],
                features: formData.useCases?.map((uc: any) => uc.name) || [],
                useCases: formData.useCases,
                // Pass other rich data if available
                nfrs: formData.nonFunctionalRequirements,
                businessRules: formData.businessRules
            };

        } else {
            // Quick mode - free text input
            if (!data || typeof data !== 'string' || !data.trim()) {
                return NextResponse.json(
                    { success: false, error: 'Input data is required for quick mode.' },
                    { status: 400 }
                );
            }

            srsInput = {
                projectInfo: {
                    name: 'New Project',
                    description: data
                }
            };
        }

        // Generate SRS using AI
        // Note: We pass the OBJECT input. generateDocument -> gemini/ollama -> buildPrompt (which handles object)
        const result = await generateDocument({
            type: 'SRS',
            input: srsInput as any, // Cast to any because generateDocument expects string|any (we updated interface)
            template: template as 'IEEE' | 'IIBA',
            provider: aiProvider as 'ollama' | 'gemini',
            language: language as 'en' | 'vi',
            sdlc: sdlc as 'waterfall' | 'agile',
        });

        // Extract title from generated content
        const titleMatch = result.content.match(/^#\s+(.+?)(?:\n|$)/m);
        const generatedTitle = titleMatch
            ? titleMatch[1].replace(/^\d+\.\s*/, '').trim()
            : `SRS - ${new Date().toLocaleDateString()}`;

        // Save to database
        const document = await prisma.document.create({
            data: {
                type: 'SRS',
                title: generatedTitle,
                content: JSON.stringify({ sourceType: inputMethod, language, rawInput: inputMethod === 'quick' ? data : 'structured' }),
                markdown: result.content,
                template: template,
                sourceId: inputMethod === 'from-brd' ? sourceBrdId : null,
                userId: user.id, // Fixed: Added userId
            },
        });

        // Save to generation history
        await prisma.generationHistory.create({
            data: {
                documentId: document.id,
                inputData: JSON.stringify({ inputMethod, language }),
                aiProvider: result.provider,
                aiModel: result.model,
                tokensUsed: 0, // We could implement token counting for object inputs later
                userId: user.id, // Fixed: Added userId
            },
        });

        return NextResponse.json({
            success: true,
            document: {
                id: document.id,
                type: document.type,
                title: document.title,
                template: document.template,
                sourceId: document.sourceId,
                sourceBrdTitle: sourceBrdTitle,
            },
            provider: result.provider,
            model: result.model,
        });
    } catch (error: any) {
        console.error('SRS generation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to generate SRS',
            },
            { status: 500 }
        );
    }
}
