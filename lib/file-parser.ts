import mammoth from 'mammoth';
// import pdf from 'pdf-parse'; // Fix: Use require to avoid ESM export issues

export interface ParseResult {
    content: string;
    title?: string;
}

export async function parseFile(file: File): Promise<ParseResult> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = file.type;
    const fileName = file.name;

    try {
        if (fileType === 'application/pdf') {
            const pdf = require('pdf-parse');
            const data = await pdf(buffer);
            return {
                content: data.text,
                title: fileName.replace('.pdf', '')
            };
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileName.endsWith('.docx')
        ) {
            const result = await mammoth.extractRawText({ buffer });
            return {
                content: result.value,
                title: fileName.replace('.docx', '')
            };
        } else if (fileType === 'text/plain' || fileType === 'text/markdown' || fileName.endsWith('.md')) {
            const text = buffer.toString('utf-8');
            // Try to extract title from markdown # Title if possible, else filename
            const firstLine = text.split('\n')[0];
            let title = fileName.replace(/\.(txt|md)$/, '');
            if (firstLine && firstLine.startsWith('# ')) {
                title = firstLine.replace('# ', '').trim();
            }
            return { content: text, title };
        } else {
            throw new Error(`Unsupported file type: ${fileType}`);
        }
    } catch (error) {
        console.error('File parsing error:', error);
        throw new Error('Failed to parse file content.');
    }
}
