import { generateWithOllama, generateWithOllamaStream, transformWithOllama, transformWithOllamaStream } from './ollama';
import { generateWithGemini, generateWithGeminiStream, transformWithGemini, transformWithGeminiStream } from './gemini';

export type AIProvider = 'ollama' | 'gemini';

interface GenerateOptions {
    type: 'BRD' | 'SRS' | 'FRD';
    input: string;
    template: 'IEEE' | 'IIBA';
    provider?: AIProvider;
    language?: 'en' | 'vi';
    sdlc?: 'waterfall' | 'agile';
}

interface TransformOptions {
    from: 'BRD' | 'SRS';
    to: 'SRS' | 'FRD';
    sourceContent: string;
    template: 'IEEE' | 'IIBA';
    provider?: AIProvider;
    language?: 'en' | 'vi';
    sdlc?: 'waterfall' | 'agile';
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

export async function* generateDocumentStream(
    options: GenerateOptions
): AsyncGenerator<{ content: string; provider: AIProvider; model: string }, void, unknown> {
    const provider = options.provider || 'gemini'; // Preferred streaming provider
    let actualProvider: AIProvider = provider;
    let model = provider === 'gemini'
        ? (process.env.GEMINI_MODEL || 'gemini-flash-latest')
        : (process.env.OLLAMA_MODEL || 'llama3.1:8b');

    try {
        if (provider === 'gemini') {
            for await (const chunk of generateWithGeminiStream(options)) {
                yield { content: chunk, provider: 'gemini', model };
            }
        } else {
            for await (const chunk of generateWithOllamaStream(options)) {
                yield { content: chunk, provider: 'ollama', model };
            }
        }
    } catch (error: any) {
        // Auto-fallback logic for streaming is simplified: just error out or try non-streaming fallback?
        // For now, let's keep it simple and just handle connection errors by switching provider if possible,
        // but switching mid-stream is hard. We'll fallback BEFORE streaming starts if init fails, 
        // but if mid-stream fails, we just throw.
        if (provider === 'gemini') {
            console.warn(`Gemini streaming failed, falling back to Ollama: ${error.message}`);
            actualProvider = 'ollama';
            model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
            for await (const chunk of generateWithOllamaStream(options)) {
                yield { content: chunk, provider: 'ollama', model };
            }
        } else {
            throw error;
        }
    }
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

export async function* transformDocumentStream(
    options: TransformOptions
): AsyncGenerator<{ content: string; provider: AIProvider; model: string }, void, unknown> {
    const provider = options.provider || 'gemini';
    let actualProvider: AIProvider = provider;
    let model = provider === 'gemini'
        ? (process.env.GEMINI_MODEL || 'gemini-flash-latest')
        : (process.env.OLLAMA_MODEL || 'llama3.1:8b');

    try {
        if (provider === 'gemini') {
            for await (const chunk of transformWithGeminiStream(options)) {
                yield { content: chunk, provider: 'gemini', model };
            }
        } else {
            for await (const chunk of transformWithOllamaStream(options)) {
                yield { content: chunk, provider: 'ollama', model };
            }
        }
    } catch (error: any) {
        if (provider === 'gemini') {
            console.warn(`Gemini streaming transform failed, falling back to Ollama: ${error.message}`);
            actualProvider = 'ollama';
            model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
            for await (const chunk of transformWithOllamaStream(options)) {
                yield { content: chunk, provider: 'ollama', model };
            }
        } else {
            throw error;
        }
    }
}
