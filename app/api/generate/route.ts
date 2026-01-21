import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/lib/ai/ai-service';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { inputMethod, data, template, aiProvider } = body;

        // Validate inputs
        if (!data) {
            return NextResponse.json(
                { error: 'Input data is required' },
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

        // Normalize input based on method
        const inputText = data; // For 'form' mode, data is already formatted by formatStructuredData in frontend

        // Generate BRD using AI
        const startTime = Date.now();
        const result = await generateDocument({
            type: 'BRD',
            input: inputText,
            template: template as 'IEEE' | 'IIBA',
            provider: aiProvider as 'ollama' | 'gemini',
        });

        const generationTime = Date.now() - startTime;

        // Save to database
        const document = await prisma.document.create({
            data: {
                type: 'BRD',
                title: extractTitle(result.content) || 'Untitled BRD',
                content: JSON.stringify({ inputMethod, rawInput: inputText }),
                markdown: result.content,
                template,
            },
        });

        // Save generation history
        await prisma.generationHistory.create({
            data: {
                documentId: document.id,
                inputData: JSON.stringify({ inputMethod, dataLength: inputText.length }),
                aiProvider: result.provider,
                aiModel: result.model,
                tokensUsed: estimateTokens(inputText + result.content),
            },
        });

        return NextResponse.json({
            success: true,
            document: {
                id: document.id,
                title: document.title,
                markdown: document.markdown,
                template: document.template,
                createdAt: document.createdAt,
            },
            meta: {
                provider: result.provider,
                model: result.model,
                generationTime: `${generationTime}ms`,
            },
        });

    } catch (error: any) {
        console.error('BRD Generation Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to generate BRD',
                details: error.message,
            },
            { status: 500 }
        );
    }
}

function formatFormData(data: any): string {
    // Convert structured form data to narrative text
    const parts = [];

    if (data.projectName) parts.push(`Project: ${data.projectName}`);
    if (data.businessGoals) parts.push(`Business Goals: ${data.businessGoals}`);
    if (data.stakeholders) parts.push(`Stakeholders: ${data.stakeholders}`);
    if (data.scope) parts.push(`Scope: ${data.scope}`);
    if (data.constraints) parts.push(`Constraints: ${data.constraints}`);
    if (data.successCriteria) parts.push(`Success Criteria: ${data.successCriteria}`);

    return parts.join('\n\n');
}

function extractTitle(markdown: string): string | null {
    // Extract first H1 title from markdown
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1] : null;
}

function estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}
