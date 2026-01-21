import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const DEFAULT_MODEL = 'gemini-2.0-flash'; // Available in free tier



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

export async function generateWithGemini(
    options: GenerateOptions
): Promise<string> {
    const { type, input, template } = options;

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
        }

        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || DEFAULT_MODEL
        });

        // Build prompt based on type and template
        const promptModule = await import(`./prompts/${type.toLowerCase()}-generator`);
        const prompt = promptModule.buildPrompt(input, template);

        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text();
    } catch (error: any) {
        // Enhanced error messages
        if (error.status === 429) {
            throw new Error(`Gemini API quota exceeded. Please try again later or use Ollama (local) instead. Details: ${error.message}`);
        } else if (error.status === 401 || error.status === 403) {
            throw new Error(`Gemini API authentication failed. Please check your GEMINI_API_KEY in .env file.`);
        } else if (error.message?.includes('GEMINI_API_KEY')) {
            throw error; // Re-throw our custom message
        } else {
            throw new Error(`Gemini API error: ${error.message || 'Unknown error'}`);
        }
    }
}

export async function transformWithGemini(
    options: TransformOptions
): Promise<string> {
    const { from, to, sourceContent, template } = options;

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
        }

        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || DEFAULT_MODEL
        });

        // Build transformation prompt
        const promptModule = await import(`./prompts/${from.toLowerCase()}-to-${to.toLowerCase()}`);
        const prompt = promptModule.buildTransformPrompt(sourceContent, template);

        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text();
    } catch (error: any) {
        // Enhanced error messages
        if (error.status === 429) {
            throw new Error(`Gemini API quota exceeded. Please try again later or use Ollama (local) instead. Details: ${error.message}`);
        } else if (error.status === 401 || error.status === 403) {
            throw new Error(`Gemini API authentication failed. Please check your GEMINI_API_KEY in .env file.`);
        } else if (error.message?.includes('GEMINI_API_KEY')) {
            throw error; // Re-throw our custom message
        } else {
            throw new Error(`Gemini API error: ${error.message || 'Unknown error'}`);
        }
    }
}
