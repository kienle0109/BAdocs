import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/lib/ai/ai-service';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        console.log('[API] POST /api/generate started');
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error('[API] Unauthorized access attempt');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { inputMethod, data, template, aiProvider, language = 'en' } = body;
        console.log(`[API] Processing request: provider=${aiProvider}, template=${template}, language=${language}`);

        // ... (validation code)

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
        let inputForAI: any = data;

        // If data is structured object (from form), map it to BRDInput expected by generator
        if (typeof data === 'object' && data !== null && inputMethod === 'form') {
            inputForAI = {
                projectName: data.projectInfo?.projectName || 'Untitled Project',
                description: data.businessContext?.problem || '',
                stakeholders: data.stakeholders?.map((s: any) => `${s.name} (${s.role})`) || [],
                features: data.scope?.features || [],
                scope: {
                    inScope: data.scope?.inScope || [],
                    outOfScope: data.scope?.outScope || []
                },
                targetAudience: 'Stakeholders',
                constraints: {
                    budget: data.constraints?.budget,
                    timeline: data.constraints?.timeline,
                    technical: data.constraints?.technical,
                    risks: data.risks // Pass risks array directly
                },
                goals: {
                    primary: data.goals?.primary,
                    metrics: data.goals?.metrics,
                    timeline: data.goals?.timeline
                }
            };
        }

        // Generate BRD using AI
        console.log('[API] Calling generateDocument...');
        const startTime = Date.now();
        const result = await generateDocument({
            type: 'BRD',
            input: inputForAI,
            template: template as 'IEEE' | 'IIBA',
            provider: aiProvider as 'ollama' | 'gemini',
            language: language as 'en' | 'vi',
        });
        console.log('[API] Generation complete. Length:', result.content.length);

        const generationTime = Date.now() - startTime;

        // Save to database
        console.log('[API] Saving to database...');
        const document = await prisma.document.create({
            data: {
                type: 'BRD',
                title: extractTitle(result.content) || 'Untitled BRD',
                content: JSON.stringify({ inputMethod, rawInput: data }),
                markdown: result.content,
                template,
                userId: user.id,
            },
        });
        console.log('[API] Document saved:', document.id);

        // Save generation history
        await prisma.generationHistory.create({
            data: {
                documentId: document.id,
                userId: user.id,
                inputData: JSON.stringify({ inputMethod, dataLength: typeof data === 'string' ? data.length : JSON.stringify(data).length }),
                aiProvider: result.provider,
                aiModel: result.model,
                tokensUsed: estimateTokens((typeof data === 'string' ? data : JSON.stringify(data)) + result.content),
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
        console.error('[API Error] BRD Generation failed:', error);
        console.error('[API Error] Stack trace:', error.stack);

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
