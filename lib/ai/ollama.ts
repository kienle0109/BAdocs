import { Ollama } from 'ollama';

const ollama = new Ollama({
    host: process.env.OLLAMA_HOST || 'http://localhost:11434',
});

const DEFAULT_MODEL = 'llama3.1:8b';

interface GenerateOptions {
    type: 'BRD' | 'SRS' | 'FRD';
    input: string;
    template: 'IEEE' | 'IIBA';
}

interface TransformOptions {
    from: 'BRD' | 'SRS';
    to: 'SRS' | 'FRD';
    sourceContent: string;
    template: 'IEEE' | 'IIBA';
}

export async function generateWithOllama(
    options: GenerateOptions
): Promise<string> {
    const { type, input, template } = options;

    // Build prompt based on type and template
    const promptModule = await import(`./prompts/${type.toLowerCase()}-generator`);
    const prompt = promptModule.buildPrompt(input, template);

    const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL || DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
    });

    return response.message.content;
}

export async function transformWithOllama(
    options: TransformOptions
): Promise<string> {
    const { from, to, sourceContent, template } = options;

    // Build transformation prompt
    const promptModule = await import(`./prompts/${from.toLowerCase()}-to-${to.toLowerCase()}`);
    const prompt = promptModule.buildTransformPrompt(sourceContent, template);

    const response = await ollama.chat({
        model: process.env.OLLAMA_MODEL || DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
    });

    return response.message.content;
}
