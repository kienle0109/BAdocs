import { buildSRSPrompt, SRSInput } from './srs-generator';

export function buildTransformPrompt(
    brdContent: string,
    template: 'IEEE' | 'IIBA',
    language: 'en' | 'vi' = 'en'
): string {
    // Adapter: Convert unstructured BRD content into SRSInput structure
    const input: SRSInput = {
        projectInfo: {
            name: 'Project (Derived from BRD)',
        },
        brdContent: brdContent,
        // Since we only have raw text, we let the AI infer features, actors, etc. 
        // The updated srs-generator logic handles inference well.
    };

    return buildSRSPrompt(input, {
        inputType: 'from-brd',
        template,
        language,
        sdlc: 'waterfall' // Default to Waterfall for BRD transformations unless specified
    });
}
