'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Document {
    id: string;
    type: string;
    title: string;
    markdown: string;
    template: string;
    sourceId: string | null;
    createdAt: string;
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
    const printRef = useRef<HTMLDivElement>(null);
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [transforming, setTransforming] = useState(false);
    const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null);
    const [aiProvider, setAiProvider] = useState<'ollama' | 'gemini'>('gemini');

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

        try {
            let endpoint = '';
            let body: any = {
                template: document.template,
                aiProvider,
            };

            if (document.type === 'BRD') {
                endpoint = '/api/transform/brd-to-srs';
                body.brdId = document.id;
            } else if (document.type === 'SRS') {
                endpoint = '/api/transform/srs-to-frd';
                body.srsId = document.id;
            } else {
                alert('Cannot transform FRD further');
                setTransforming(false);
                return;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.success) {
                router.push(`/preview/${result.document.id}`);
            } else {
                alert(`Transformation failed: ${result.error}`);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setTransforming(false);
        }
    };

    const handleExportMarkdown = () => {
        window.open(`/api/documents/${document?.id}/export`, '_blank');
    };

    // Generate clean HTML for PDF export
    const generatePrintHTML = () => {
        if (!document) return '';

        // Convert markdown to structured HTML for print
        let html = document.markdown;

        // Process headers with proper styling
        html = html.replace(/^# (.+)$/gm, '<h1 class="doc-h1">$1</h1>');
        html = html.replace(/^## (.+)$/gm, '<h2 class="doc-h2">$1</h2>');
        html = html.replace(/^### (.+)$/gm, '<h3 class="doc-h3">$1</h3>');
        html = html.replace(/^#### (.+)$/gm, '<h4 class="doc-h4">$1</h4>');

        // Process bold and italic
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Process bullet lists
        const listPattern = /^- (.+)$/gm;
        html = html.replace(listPattern, '<li class="doc-li">$1</li>');
        html = html.replace(/(<li class="doc-li">.+<\/li>\n?)+/g, '<ul class="doc-ul">$&</ul>');

        // Process numbered lists
        html = html.replace(/^\d+\. (.+)$/gm, '<li class="doc-li-num">$1</li>');

        // Process tables
        const tableLines = html.split('\n');
        let inTable = false;
        let tableHTML = '';
        let processedLines: string[] = [];

        for (let i = 0; i < tableLines.length; i++) {
            const line = tableLines[i];

            if (line.startsWith('|') && line.endsWith('|')) {
                if (line.match(/^\|[\s\-:]+\|$/)) {
                    // Skip separator line
                    continue;
                }

                if (!inTable) {
                    inTable = true;
                    tableHTML = '<table class="doc-table"><tbody>';
                }

                const cells = line.split('|').filter(c => c.trim() !== '');
                const isHeader = !processedLines.some(l => l.includes('<tr'));
                const cellTag = isHeader ? 'th' : 'td';

                tableHTML += '<tr>';
                cells.forEach(cell => {
                    tableHTML += `<${cellTag} class="doc-cell">${cell.trim()}</${cellTag}>`;
                });
                tableHTML += '</tr>';
            } else {
                if (inTable) {
                    inTable = false;
                    tableHTML += '</tbody></table>';
                    processedLines.push(tableHTML);
                    tableHTML = '';
                }
                processedLines.push(line);
            }
        }

        if (inTable) {
            tableHTML += '</tbody></table>';
            processedLines.push(tableHTML);
        }

        html = processedLines.join('\n');

        // Wrap paragraphs
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

            // Create a clean print container
            const printContent = generatePrintHTML();
            const printContainer = window.document.createElement('div');
            printContainer.innerHTML = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
                    
                    .print-doc {
                        font-family: 'Times New Roman', Times, serif;
                        font-size: 13pt;
                        line-height: 1.6;
                        color: #000;
                        background: #fff;
                        padding: 20mm;
                        max-width: 210mm;
                    }
                    
                    .print-header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 15pt;
                        margin-bottom: 20pt;
                    }
                    
                    .print-title {
                        font-size: 18pt;
                        font-weight: bold;
                        margin: 0 0 8pt 0;
                        color: #000;
                    }
                    
                    .print-meta {
                        font-size: 11pt;
                        color: #555;
                        margin: 0;
                    }
                    
                    .doc-h1 {
                        font-size: 16pt;
                        font-weight: bold;
                        margin: 24pt 0 12pt 0;
                        padding-bottom: 6pt;
                        border-bottom: 1px solid #ccc;
                        color: #000;
                    }
                    
                    .doc-h2 {
                        font-size: 14pt;
                        font-weight: bold;
                        margin: 20pt 0 10pt 0;
                        color: #222;
                    }
                    
                    .doc-h3 {
                        font-size: 13pt;
                        font-weight: bold;
                        margin: 16pt 0 8pt 0;
                        color: #333;
                    }
                    
                    .doc-h4 {
                        font-size: 13pt;
                        font-weight: bold;
                        font-style: italic;
                        margin: 12pt 0 6pt 0;
                        color: #444;
                    }
                    
                    .doc-p {
                        margin: 0 0 10pt 0;
                        text-align: justify;
                    }
                    
                    .doc-ul {
                        margin: 10pt 0 10pt 20pt;
                        padding: 0;
                    }
                    
                    .doc-li {
                        margin: 4pt 0;
                        list-style-type: disc;
                    }
                    
                    .doc-li-num {
                        margin: 4pt 0;
                        list-style-type: decimal;
                    }
                    
                    .doc-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 15pt 0;
                        font-size: 12pt;
                    }
                    
                    .doc-cell {
                        border: 1px solid #333;
                        padding: 8pt 10pt;
                        text-align: left;
                        vertical-align: top;
                    }
                    
                    th.doc-cell {
                        background-color: #f0f0f0;
                        font-weight: bold;
                    }
                    
                    tr:nth-child(even) td.doc-cell {
                        background-color: #fafafa;
                    }
                </style>
                <div class="print-doc">
                    <div class="print-header">
                        <h1 class="print-title">${document.type}: ${document.title}</h1>
                        <p class="print-meta">Standard: ${document.template} | Created: ${new Date(document.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    ${printContent}
                </div>
            `;

            const opt = {
                margin: [10, 10, 10, 10],
                filename: `${document.type}-${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            } as any;

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
            const {
                Document: DocxDocument,
                Packer,
                Paragraph,
                TextRun,
                HeadingLevel,
                Table,
                TableRow,
                TableCell,
                WidthType,
                BorderStyle,
                AlignmentType,
                convertInchesToTwip
            } = await import('docx');
            const { saveAs } = await import('file-saver');

            // Font size in half-points (13pt = 26 half-points)
            const FONT_SIZE = 26;
            const FONT_NAME = 'Times New Roman';

            const lines = document.markdown.split('\n');
            const children: any[] = [];
            let inTable = false;
            let tableRows: string[][] = [];

            // Add document header
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: `${document.type}: ${document.title}`,
                        bold: true,
                        size: 36, // 18pt
                        font: FONT_NAME,
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
            }));

            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: `Standard: ${document.template} | Created: ${new Date(document.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
                        size: 22, // 11pt
                        font: FONT_NAME,
                        color: '666666',
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
                border: {
                    bottom: { style: BorderStyle.SINGLE, size: 12, color: '333333' }
                }
            }));

            const processTableRows = () => {
                if (tableRows.length > 0) {
                    const table = new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: tableRows.map((row, rowIndex) =>
                            new TableRow({
                                children: row.map(cell =>
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: cell.trim(),
                                                bold: rowIndex === 0,
                                                size: 24, // 12pt for tables
                                                font: FONT_NAME,
                                            })],
                                            spacing: { before: 60, after: 60 }
                                        })],
                                        borders: {
                                            top: { style: BorderStyle.SINGLE, size: 8, color: '333333' },
                                            bottom: { style: BorderStyle.SINGLE, size: 8, color: '333333' },
                                            left: { style: BorderStyle.SINGLE, size: 8, color: '333333' },
                                            right: { style: BorderStyle.SINGLE, size: 8, color: '333333' },
                                        },
                                        shading: rowIndex === 0 ? { fill: 'EEEEEE' } : undefined,
                                    })
                                )
                            })
                        )
                    });
                    children.push(table);
                    children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
                    tableRows = [];
                }
            };

            for (const line of lines) {
                // Skip separator lines in tables
                if (line.match(/^\|[\s\-:]+\|$/)) continue;

                // Table detection
                if (line.startsWith('|') && line.endsWith('|')) {
                    inTable = true;
                    const cells = line.split('|').filter(c => c.trim() !== '');
                    tableRows.push(cells);
                    continue;
                } else if (inTable) {
                    inTable = false;
                    processTableRows();
                }

                // Clean markdown formatting
                let cleanText = line
                    .replace(/\*\*(.+?)\*\*/g, '$1')
                    .replace(/\*(.+?)\*/g, '$1');

                // Headers
                if (line.startsWith('# ')) {
                    children.push(new Paragraph({
                        children: [new TextRun({
                            text: cleanText.substring(2),
                            bold: true,
                            size: 32, // 16pt
                            font: FONT_NAME,
                        })],
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 480, after: 240 },
                        border: {
                            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' }
                        }
                    }));
                } else if (line.startsWith('## ')) {
                    children.push(new Paragraph({
                        children: [new TextRun({
                            text: cleanText.substring(3),
                            bold: true,
                            size: 28, // 14pt
                            font: FONT_NAME,
                        })],
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 }
                    }));
                } else if (line.startsWith('### ')) {
                    children.push(new Paragraph({
                        children: [new TextRun({
                            text: cleanText.substring(4),
                            bold: true,
                            size: FONT_SIZE, // 13pt
                            font: FONT_NAME,
                        })],
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 320, after: 160 }
                    }));
                } else if (line.startsWith('#### ')) {
                    children.push(new Paragraph({
                        children: [new TextRun({
                            text: cleanText.substring(5),
                            bold: true,
                            italics: true,
                            size: FONT_SIZE, // 13pt
                            font: FONT_NAME,
                        })],
                        spacing: { before: 240, after: 120 }
                    }));
                } else if (line.startsWith('- ') || line.startsWith('* ')) {
                    children.push(new Paragraph({
                        children: [new TextRun({
                            text: cleanText.substring(2),
                            size: FONT_SIZE,
                            font: FONT_NAME,
                        })],
                        bullet: { level: 0 },
                        spacing: { before: 60, after: 60 }
                    }));
                } else if (line.match(/^\d+\.\s/)) {
                    children.push(new Paragraph({
                        children: [new TextRun({
                            text: cleanText.replace(/^\d+\.\s/, ''),
                            size: FONT_SIZE,
                            font: FONT_NAME,
                        })],
                        numbering: { reference: 'default-numbering', level: 0 },
                        spacing: { before: 60, after: 60 }
                    }));
                } else if (line.trim() !== '') {
                    children.push(new Paragraph({
                        children: [new TextRun({
                            text: cleanText,
                            size: FONT_SIZE,
                            font: FONT_NAME,
                        })],
                        spacing: { after: 200 },
                        alignment: AlignmentType.JUSTIFIED
                    }));
                } else {
                    children.push(new Paragraph({ text: '', spacing: { after: 100 } }));
                }
            }

            // Process any remaining table
            if (tableRows.length > 0) {
                processTableRows();
            }

            const doc = new DocxDocument({
                styles: {
                    default: {
                        document: {
                            run: {
                                font: FONT_NAME,
                                size: FONT_SIZE,
                            },
                            paragraph: {
                                spacing: { line: 360 }, // 1.5 line spacing
                            }
                        }
                    }
                },
                sections: [{
                    properties: {
                        page: {
                            margin: {
                                top: convertInchesToTwip(1),
                                right: convertInchesToTwip(1),
                                bottom: convertInchesToTwip(1),
                                left: convertInchesToTwip(1),
                            }
                        }
                    },
                    children: children
                }],
                numbering: {
                    config: [{
                        reference: 'default-numbering',
                        levels: [{
                            level: 0,
                            format: 'decimal',
                            text: '%1.',
                            alignment: AlignmentType.START,
                        }]
                    }]
                }
            });

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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Document not found</div>
            </div>
        );
    }

    const nextDocType = document.type === 'BRD' ? 'SRS' : document.type === 'SRS' ? 'FRD' : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    {/* Back Button */}
                    <a
                        href="/history"
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer mb-4"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to History
                    </a>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="inline-block px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium mb-2">
                                {document.type} | {document.template}
                            </span>
                            <h1 className="text-4xl font-bold text-white">
                                {document.title}
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Created: {new Date(document.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                        {nextDocType && (
                            <>
                                <select
                                    value={aiProvider}
                                    onChange={(e) => setAiProvider(e.target.value as 'ollama' | 'gemini')}
                                    className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-white/20 cursor-pointer"
                                >
                                    <option value="ollama">Ollama (Local)</option>
                                    <option value="gemini">Gemini Free</option>
                                </select>
                                <button
                                    onClick={handleTransform}
                                    disabled={transforming}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 cursor-pointer"
                                >
                                    {transforming ? 'Transforming...' : `Transform to ${nextDocType}`}
                                </button>
                            </>
                        )}

                        {/* Export Buttons */}
                        <button
                            onClick={handleExportPDF}
                            disabled={exporting === 'pdf'}
                            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 18h12a2 2 0 002-2V6l-4-4H4a2 2 0 00-2 2v12a2 2 0 002 2zm5-9V5l4 4h-4z" />
                            </svg>
                            {exporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
                        </button>

                        <button
                            onClick={handleExportDOCX}
                            disabled={exporting === 'docx'}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 18h12a2 2 0 002-2V6l-4-4H4a2 2 0 00-2 2v12a2 2 0 002 2zm5-9V5l4 4h-4z" />
                            </svg>
                            {exporting === 'docx' ? 'Exporting...' : 'Export DOCX'}
                        </button>

                        <button
                            onClick={handleExportMarkdown}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Export MD
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition cursor-pointer"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>

                {/* Document Chain */}
                {(document.source || (document.children && document.children.length > 0)) && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 mb-6">
                        <h3 className="text-white font-medium mb-2">Document Chain</h3>
                        <div className="flex items-center gap-2 text-sm">
                            {document.source && (
                                <>
                                    <a
                                        href={`/preview/${document.source.id}`}
                                        className="text-blue-400 hover:underline cursor-pointer"
                                    >
                                        {document.source.type}
                                    </a>
                                    <span className="text-gray-400">→</span>
                                </>
                            )}
                            <span className="text-purple-400 font-medium">{document.type} (Current)</span>
                            {document.children && document.children.length > 0 && (
                                <>
                                    <span className="text-gray-400">→</span>
                                    {document.children.map((child) => (
                                        <a
                                            key={child.id}
                                            href={`/preview/${child.id}`}
                                            className="text-green-400 hover:underline cursor-pointer"
                                        >
                                            {child.type}
                                        </a>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Document Content */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/20">
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
    );
}
