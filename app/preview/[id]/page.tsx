'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Header } from '@/components/Header';
import { StreamingContent } from '@/components/StreamingContent';

interface Document {
    id: string;
    type: string;
    title: string;
    markdown: string;
    template: string;
    sourceId: string | null;
    createdAt: string;
    sdlc?: 'waterfall' | 'agile';
    source?: {
        id: string;
        type: string;
        title: string;
    };
    children?: Array<{
        id: string;
        type: string;
        title: string;
    }>;
}

export default function PreviewPage() {
    const params = useParams();
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [transforming, setTransforming] = useState(false);
    const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null);
    const [aiProvider, setAiProvider] = useState<'ollama' | 'gemini'>('gemini');

    // New states for streaming & language
    const [targetLanguage, setTargetLanguage] = useState<'en' | 'vi'>('vi');
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamContent, setStreamContent] = useState('');

    useEffect(() => {
        fetchDocument();
    }, [params.id]);

    const fetchDocument = async () => {
        try {
            const response = await fetch(`/api/documents/${params.id}`);
            const result = await response.json();

            if (result.success) {
                setDocument(result.document);
            }
        } catch (error) {
            console.error('Failed to fetch document:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTransform = async () => {
        if (!document) return;

        setTransforming(true);
        setIsStreaming(true);
        setStreamContent('');

        try {
            let endpoint = '';
            let body: any = {
                template: document.template,
                aiProvider,
                language: targetLanguage,
            };

            if (document.type === 'BRD') {
                endpoint = '/api/transform/brd-to-srs/stream';
                body.brdId = document.id;
            } else if (document.type === 'SRS') {
                endpoint = '/api/transform/srs-to-frd/stream';
                body.srsId = document.id;
            } else {
                alert('Cannot transform FRD further');
                setTransforming(false);
                setIsStreaming(false);
                return;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Transformation failed');
            }

            if (!response.body) {
                throw new Error('ReadableStream not supported');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let documentId = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));

                            if (data.content) {
                                setStreamContent(prev => prev + data.content);
                            }

                            if (data.error) {
                                throw new Error(data.error);
                            }

                            if (data.completed && data.documentId) {
                                documentId = data.documentId;
                            }
                        } catch (e) {
                            console.error('Error parsing SSE chunk:', e);
                        }
                    }
                }
            }

            if (documentId) {
                setTimeout(() => {
                    router.push(`/preview/${documentId}`);
                }, 1000);
            } else {
                throw new Error('Transformation completed but no document ID returned');
            }

        } catch (error: any) {
            alert(`Error: ${error.message}`);
            setIsStreaming(false);
        } finally {
            setTransforming(false);
        }
    };

    const handleExportMarkdown = () => {
        window.open(`/api/documents/${document?.id}/export`, '_blank');
    };

    // PDF and DOCX export functions kept same
    // (Omitted for brevity in this response but I will keep them in the file if I use write_to_file)
    // Wait, I should include them to ensure the file is complete.
    // I will copy the export functions from previous read.

    // Generate clean HTML for PDF export
    const generatePrintHTML = () => {
        if (!document) return '';
        let html = document.markdown;
        html = html.replace(/^# (.+)$/gm, '<h1 class="doc-h1">$1</h1>');
        html = html.replace(/^## (.+)$/gm, '<h2 class="doc-h2">$1</h2>');
        html = html.replace(/^### (.+)$/gm, '<h3 class="doc-h3">$1</h3>');
        html = html.replace(/^#### (.+)$/gm, '<h4 class="doc-h4">$1</h4>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        const listPattern = /^- (.+)$/gm;
        html = html.replace(listPattern, '<li class="doc-li">$1</li>');
        html = html.replace(/(<li class="doc-li">.+<\/li>\n?)+/g, '<ul class="doc-ul">$&</ul>');
        html = html.replace(/^\d+\. (.+)$/gm, '<li class="doc-li-num">$1</li>');
        // Simple table logic
        const tableLines = html.split('\n');
        let inTable = false;
        let tableHTML = '';
        let processedLines: string[] = [];
        for (let i = 0; i < tableLines.length; i++) {
            const line = tableLines[i];
            if (line.startsWith('|') && line.endsWith('|')) {
                if (line.match(/^\|[\s\-:]+\|$/)) continue;
                if (!inTable) { inTable = true; tableHTML = '<table class="doc-table"><tbody>'; }
                const cells = line.split('|').filter(c => c.trim() !== '');
                const isHeader = !processedLines.some(l => l.includes('<tr'));
                const cellTag = isHeader ? 'th' : 'td';
                tableHTML += '<tr>';
                cells.forEach(cell => { tableHTML += `<${cellTag} class="doc-cell">${cell.trim()}</${cellTag}>`; });
                tableHTML += '</tr>';
            } else {
                if (inTable) { inTable = false; tableHTML += '</tbody></table>'; processedLines.push(tableHTML); tableHTML = ''; }
                processedLines.push(line);
            }
        }
        if (inTable) { tableHTML += '</tbody></table>'; processedLines.push(tableHTML); }
        html = processedLines.join('\n');
        html = html.split('\n').map(line => {
            if (line.trim() === '') return '';
            if (line.startsWith('<')) return line;
            return `<p class="doc-p">${line}</p>`;
        }).join('\n');
        return html;
    };

    const handleExportPDF = async () => {
        if (!document) return;
        setExporting('pdf');
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const printContent = generatePrintHTML();
            const printContainer = window.document.createElement('div');
            // ... (keeping same styles as before for brevity)
            printContainer.innerHTML = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
                    .print-doc { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.6; color: #000; background: #fff; padding: 20mm; max-width: 210mm; }
                    .print-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15pt; margin-bottom: 20pt; }
                    .print-title { font-size: 18pt; font-weight: bold; margin: 0 0 8pt 0; color: #000; }
                    .print-meta { font-size: 11pt; color: #555; margin: 0; }
                    .doc-h1 { font-size: 16pt; font-weight: bold; margin: 24pt 0 12pt 0; padding-bottom: 6pt; border-bottom: 1px solid #ccc; color: #000; }
                    .doc-h2 { font-size: 14pt; font-weight: bold; margin: 20pt 0 10pt 0; color: #222; }
                    .doc-h3 { font-size: 13pt; font-weight: bold; margin: 16pt 0 8pt 0; color: #333; }
                    .doc-h4 { font-size: 13pt; font-weight: bold; font-style: italic; margin: 12pt 0 6pt 0; color: #444; }
                    .doc-p { margin: 0 0 10pt 0; text-align: justify; }
                    .doc-ul { margin: 10pt 0 10pt 20pt; padding: 0; }
                    .doc-li { margin: 4pt 0; list-style-type: disc; }
                    .doc-li-num { margin: 4pt 0; list-style-type: decimal; }
                    .doc-table { width: 100%; border-collapse: collapse; margin: 15pt 0; font-size: 12pt; }
                    .doc-cell { border: 1px solid #333; padding: 8pt 10pt; text-align: left; vertical-align: top; }
                    th.doc-cell { background-color: #f0f0f0; font-weight: bold; }
                    tr:nth-child(even) td.doc-cell { background-color: #fafafa; }
                </style>
                <div class="print-doc">
                    <div class="print-header">
                        <h1 class="print-title">${document.type}: ${document.title}</h1>
                        <p class="print-meta">Standard: ${document.template} | Created: ${new Date(document.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    ${printContent}
                </div>
            `;
            const opt = { margin: [10, 10, 10, 10], filename: `${document.type}-${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } } as any;
            await html2pdf().set(opt).from(printContainer).save();
        } catch (error: any) {
            console.error('PDF export failed:', error);
            alert(`PDF export failed: ${error.message}`);
        } finally {
            setExporting(null);
        }
    };

    const handleExportDOCX = async () => {
        if (!document) return;
        setExporting('docx');
        try {
            const { Document: DocxDocument, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, convertInchesToTwip } = await import('docx');
            const { saveAs } = await import('file-saver');
            const FONT_SIZE = 26;
            const FONT_NAME = 'Times New Roman';
            const lines = document.markdown.split('\n');
            const children: any[] = [];
            let inTable = false;
            let tableRows: string[][] = [];
            children.push(new Paragraph({ children: [new TextRun({ text: `${document.type}: ${document.title}`, bold: true, size: 36, font: FONT_NAME })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }));
            children.push(new Paragraph({ children: [new TextRun({ text: `Standard: ${document.template} | Created: ${new Date(document.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, size: 22, font: FONT_NAME, color: '666666' })], alignment: AlignmentType.CENTER, spacing: { after: 400 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '333333' } } }));

            const processTableRows = () => {
                if (tableRows.length > 0) {
                    const table = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows.map((row, rowIndex) => new TableRow({ children: row.map(cell => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: cell.trim(), bold: rowIndex === 0, size: 24, font: FONT_NAME })], spacing: { before: 60, after: 60 } })], borders: { top: { style: BorderStyle.SINGLE, size: 8, color: '333333' }, bottom: { style: BorderStyle.SINGLE, size: 8, color: '333333' }, left: { style: BorderStyle.SINGLE, size: 8, color: '333333' }, right: { style: BorderStyle.SINGLE, size: 8, color: '333333' } }, shading: rowIndex === 0 ? { fill: 'EEEEEE' } : undefined })) })) });
                    children.push(table);
                    children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
                    tableRows = [];
                }
            };
            for (const line of lines) {
                if (line.match(/^\|[\s\-:]+\|$/)) continue;
                if (line.startsWith('|') && line.endsWith('|')) { inTable = true; const cells = line.split('|').filter(c => c.trim() !== ''); tableRows.push(cells); continue; } else if (inTable) { inTable = false; processTableRows(); }
                let cleanText = line.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
                if (line.startsWith('# ')) { children.push(new Paragraph({ children: [new TextRun({ text: cleanText.substring(2), bold: true, size: 32, font: FONT_NAME })], heading: HeadingLevel.HEADING_1, spacing: { before: 480, after: 240 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' } } })); }
                else if (line.startsWith('## ')) { children.push(new Paragraph({ children: [new TextRun({ text: cleanText.substring(3), bold: true, size: 28, font: FONT_NAME })], heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } })); }
                else if (line.startsWith('### ')) { children.push(new Paragraph({ children: [new TextRun({ text: cleanText.substring(4), bold: true, size: FONT_SIZE, font: FONT_NAME })], heading: HeadingLevel.HEADING_3, spacing: { before: 320, after: 160 } })); }
                else if (line.startsWith('#### ')) { children.push(new Paragraph({ children: [new TextRun({ text: cleanText.substring(5), bold: true, italics: true, size: FONT_SIZE, font: FONT_NAME })], spacing: { before: 240, after: 120 } })); }
                else if (line.startsWith('- ') || line.startsWith('* ')) { children.push(new Paragraph({ children: [new TextRun({ text: cleanText.substring(2), size: FONT_SIZE, font: FONT_NAME })], bullet: { level: 0 }, spacing: { before: 60, after: 60 } })); }
                else if (line.match(/^\d+\.\s/)) { children.push(new Paragraph({ children: [new TextRun({ text: cleanText.replace(/^\d+\.\s/, ''), size: FONT_SIZE, font: FONT_NAME })], numbering: { reference: 'default-numbering', level: 0 }, spacing: { before: 60, after: 60 } })); }
                else if (line.trim() !== '') { children.push(new Paragraph({ children: [new TextRun({ text: cleanText, size: FONT_SIZE, font: FONT_NAME })], spacing: { after: 200 }, alignment: AlignmentType.JUSTIFIED })); }
                else { children.push(new Paragraph({ text: '', spacing: { after: 100 } })); }
            }
            if (tableRows.length > 0) { processTableRows(); }
            const doc = new DocxDocument({ styles: { default: { document: { run: { font: FONT_NAME, size: FONT_SIZE }, paragraph: { spacing: { line: 360 } } } } }, sections: [{ properties: { page: { margin: { top: convertInchesToTwip(1), right: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1) } } }, children: children }], numbering: { config: [{ reference: 'default-numbering', levels: [{ level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START }] }] } });
            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${document.type}-${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`);
        } catch (error: any) {
            console.error('DOCX export failed:', error);
            alert(`DOCX export failed: ${error.message}`);
        } finally {
            setExporting(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-slate-400 text-xl font-light">Loading document...</div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-slate-400 text-xl">Document not found</div>
            </div>
        );
    }

    const nextDocType = document.type === 'BRD' ? 'SRS' : document.type === 'SRS' ? 'FRD' : null;

    return (
        <div className="min-h-screen bg-slate-950 relative flex flex-col">

            {/* Streaming Overlay */}
            {isStreaming && (
                <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-4xl bg-slate-800 rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50 backdrop-blur-md rounded-t-xl z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                <h3 className="text-white font-medium">Transforming to {nextDocType}...</h3>
                            </div>
                            <div className="text-sm text-gray-400 font-mono">
                                {streamContent.length} chars
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-900/50">
                            <StreamingContent content={streamContent} isStreaming={true} />
                        </div>
                    </div>
                </div>
            )}

            <Header
                showBack
                backHref="/history"
                backLabel="History"
                title={document.title}
                actions={
                    <div className="flex items-center gap-2">
                        {/* Export Buttons */}
                        <button
                            onClick={handleExportPDF}
                            disabled={exporting === 'pdf'}
                            className="hidden sm:flex px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50 items-center gap-2 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 18h12a2 2 0 002-2V6l-4-4H4a2 2 0 00-2 2v12a2 2 0 002 2zm5-9V5l4 4h-4z" />
                            </svg>
                            {exporting === 'pdf' ? 'Exporting...' : 'PDF'}
                        </button>

                        <button
                            onClick={handleExportDOCX}
                            disabled={exporting === 'docx'}
                            className="hidden sm:flex px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50 items-center gap-2 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 18h12a2 2 0 002-2V6l-4-4H4a2 2 0 00-2 2v12a2 2 0 002 2zm5-9V5l4 4h-4z" />
                            </svg>
                            {exporting === 'docx' ? 'Exporting...' : 'DOCX'}
                        </button>

                        {nextDocType && (
                            <div className="flex items-center gap-2 bg-white/10 p-1 rounded-lg border border-white/10">
                                <select
                                    value={targetLanguage}
                                    onChange={(e) => setTargetLanguage(e.target.value as 'en' | 'vi')}
                                    className="bg-transparent text-white text-sm px-2 py-1 outline-none border-r border-white/20 cursor-pointer"
                                >
                                    <option value="vi" className="bg-slate-800 text-white">Tiếng Việt</option>
                                    <option value="en" className="bg-slate-800 text-white">English</option>
                                </select>
                                <button
                                    onClick={handleTransform}
                                    disabled={transforming}
                                    className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-md font-medium text-sm transition disabled:opacity-50 cursor-pointer"
                                >
                                    {transforming ? 'Transforming...' : `To ${nextDocType}`}
                                </button>
                            </div>
                        )}
                    </div>
                }
            />

            <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
                {/* Document Info */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {document.type} | {document.template} {document.sdlc && `| ${document.sdlc === 'waterfall' ? 'Waterfall' : 'Agile'}`}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-200 mb-2">
                        {document.title}
                    </h1>
                    <p className="text-slate-400">
                        Created: {new Date(document.createdAt).toLocaleString()}
                    </p>
                </div>

                {/* Mobile Export Actions */}
                <div className="flex sm:hidden flex-wrap gap-2 mb-6">
                    <button
                        onClick={handleExportPDF}
                        disabled={exporting === 'pdf'}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 18h12a2 2 0 002-2V6l-4-4H4a2 2 0 00-2 2v12a2 2 0 002 2zm5-9V5l4 4h-4z" />
                        </svg>
                        PDF
                    </button>
                    <button
                        onClick={handleExportDOCX}
                        disabled={exporting === 'docx'}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 18h12a2 2 0 002-2V6l-4-4H4a2 2 0 00-2 2v12a2 2 0 002 2zm5-9V5l4 4h-4z" />
                        </svg>
                        DOCX
                    </button>
                    <button
                        onClick={handleExportMarkdown}
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        MD
                    </button>
                </div>

                {/* Document Chain */}
                {(document.source || (document.children && document.children.length > 0)) && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-sm">
                        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Document Chain</h3>
                        <div className="flex items-center gap-2 text-sm">
                            {document.source && (
                                <>
                                    <a
                                        href={`/preview/${document.source.id}`}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-indigo-400 hover:text-indigo-300 rounded-lg transition-colors border border-slate-700/50 hover:border-indigo-500/30"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                        {document.source.type}
                                    </a>
                                    <span className="text-slate-600">→</span>
                                </>
                            )}

                            <span className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-lg border border-indigo-500/20 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                                {document.type} (Current)
                            </span>

                            {document.children && document.children.length > 0 && (
                                <>
                                    <span className="text-slate-600">→</span>
                                    {document.children.map((child) => (
                                        <a
                                            key={child.id}
                                            href={`/preview/${child.id}`}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700/50 hover:border-slate-600"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                            {child.type}
                                        </a>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Document Content */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div ref={contentRef} className="markdown-content">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {document.markdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
