import { generateWithOllama, transformWithOllama } from './ollama';
import { generateWithGemini, transformWithGemini } from './gemini';

export type AIProvider = 'ollama' | 'gemini';

interface GenerateOptions {
    type: 'BRD' | 'SRS' | 'FRD';
    input: string;
    template: 'IEEE' | 'IIBA';
    provider?: AIProvider;
}

interface TransformOptions {
    from: 'BRD' | 'SRS';
    to: 'SRS' | 'FRD';
    sourceContent: string;
    template: 'IEEE' | 'IIBA';
    provider?: AIProvider;
}

export async function generateDocument(
    options: GenerateOptions
): Promise<{ content: string; provider: AIProvider; model: string }> {
    const provider = options.provider || 'ollama';

    let content: string;
    let model: string;

    if (provider === 'gemini') {
        content = await generateWithGemini(options);
        model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    } else {
        content = await generateWithOllama(options);
        model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
    }

    return { content, provider, model };
}

export async function transformDocument(
    options: TransformOptions
): Promise<{ content: string; provider: AIProvider; model: string }> {
    const provider = options.provider || 'ollama';

    let content: string;
    let model: string;

    if (provider === 'gemini') {
        content = await transformWithGemini(options);
        model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    } else {
        content = await transformWithOllama(options);
        model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
    }

    return { content, provider, model };
}
