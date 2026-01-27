import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateDocument } from '@/lib/ai/ai-service';
import { buildFRDPrompt, buildDirectFRDPrompt } from '@/lib/ai/prompts/frd-generator';
import type { FRDFormData } from '@/lib/frd-form-utils';
import { createClient } from '@/lib/supabase/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { inputMethod, data, template, aiProvider, language, srsId } = await request.json();

        // Validation
        if (!template || !aiProvider || !language) {
            return NextResponse.json(
                { success: false, error: 'Missing required parameters: template, aiProvider, or language' },
                { status: 400 }
            );
        }

        let prompt: string;
        let sourceDocumentId: string | null = null;

        if (inputMethod === 'from-srs') {
            // From SRS mode - fetch SRS document and transform to FRD
            if (!srsId) {
                return NextResponse.json(
                    { success: false, error: 'SRS ID is required for from-srs mode' },
                    { status: 400 }
                );
            }

            const srs = await prisma.document.findUnique({
                where: { id: srsId },
            });

            if (!srs) {
                return NextResponse.json(
                    { success: false, error: 'SRS document not found' },
                    { status: 404 }
                );
            }

            prompt = buildFRDPrompt(srs.content, {
                inputType: 'from-srs',
                template: template as 'IEEE' | 'IIBA',
                language: language as 'en' | 'vi',
            });

            sourceDocumentId = srsId;
        } else if (inputMethod === 'form') {
            // Guided mode - structured form data
            if (!data || typeof data !== 'object') {
                return NextResponse.json(
                    { success: false, error: 'Form data is required for guided mode' },
                    { status: 400 }
                );
            }

            const formData = data as FRDFormData;

            prompt = buildDirectFRDPrompt(formData, template as 'IEEE' | 'IIBA', language as 'en' | 'vi');
        } else {
            // Quick mode - free text input
            if (!data || typeof data !== 'string' || !data.trim()) {
                return NextResponse.json(
                    { success: false, error: 'Input data is required for quick mode' },
                    { status: 400 }
                );
            }

            prompt = buildFRDPrompt(data, {
                inputType: 'quick',
                template: template as 'IEEE' | 'IIBA',
                language: language as 'en' | 'vi',
            });
        }

        // Generate FRD using AI service
        const result = await generateDocument({
            type: 'FRD',
            input: prompt,
            template: template as 'IEEE' | 'IIBA',
            provider: aiProvider as 'ollama' | 'gemini',
            language: language as 'en' | 'vi',
        });

        // Extract title from generated content (first heading)
        const titleMatch = result.content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : 'Untitled FRD';

        // Save to database
        const document = await prisma.document.create({
            data: {
                title,
                type: 'FRD',
                content: result.content,
                markdown: result.content,
                template: template as 'IEEE' | 'IIBA',
                sourceId: sourceDocumentId,
                userId: user.id, // Fixed: Added userId
            },
        });

        // Create generation history record
        await prisma.generationHistory.create({
            data: {
                documentId: document.id,
                inputData: JSON.stringify(data || {}),
                aiProvider: aiProvider as 'ollama' | 'gemini',
                aiModel: result.model,
                tokensUsed: 0,
                userId: user.id, // Fixed: Added userId
            },
        });

        return NextResponse.json({
            success: true,
            document: {
                id: document.id,
                title: document.title,
                type: document.type,
                createdAt: document.createdAt,
            },
        });
    } catch (error: any) {
        console.error('FRD Generation Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to generate FRD' },
            { status: 500 }
        );
    }
}
