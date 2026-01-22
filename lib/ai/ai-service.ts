import { generateWithOllama, transformWithOllama } from './ollama';
import { generateWithGemini, transformWithGemini } from './gemini';

export type AIProvider = 'ollama' | 'gemini';

interface GenerateOptions {
    type: 'BRD' | 'SRS' | 'FRD';
    input: string;
    template: 'IEEE' | 'IIBA';
    provider?: AIProvider;
    language?: 'en' | 'vi';
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
    let actualProvider: AIProvider = provider;

    if (provider === 'gemini') {
        try {
            content = await generateWithGemini(options);
            model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
        } catch (error: any) {
            // Auto-fallback to Ollama when Gemini fails (quota exceeded, etc.)
            console.warn(`Gemini failed, falling back to Ollama: ${error.message}`);
            content = await generateWithOllama(options);
            model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
            actualProvider = 'ollama';
        }
    } else {
        content = await generateWithOllama(options);
        model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
    }

    return { content, provider: actualProvider, model };
}

export async function transformDocument(
    options: TransformOptions
): Promise<{ content: string; provider: AIProvider; model: string }> {
    const provider = options.provider || 'ollama';

    let content: string;
    let model: string;
    let actualProvider: AIProvider = provider;

    if (provider === 'gemini') {
        try {
            content = await transformWithGemini(options);
            model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
        } catch (error: any) {
            // Auto-fallback to Ollama when Gemini fails (quota exceeded, etc.)
            console.warn(`Gemini failed, falling back to Ollama: ${error.message}`);
            content = await transformWithOllama(options);
            model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
            actualProvider = 'ollama';
        }
    } else {
        content = await transformWithOllama(options);
        model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
    }

    return { content, provider: actualProvider, model };
}
