# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-01-22

### 🎨 UI/UX Redesign

#### Home Page
- Redesigned with 4-column responsive grid layout
- Renamed "Transform Documents" to "Document History"
- Added "Generate SRS" and "Generate FRD" placeholders (Coming Soon)
- Replaced emoji icons with professional SVG icons
- Improved card hover effects and transitions

#### BRD Creation Page (`/new`)
- **Split-Layout Design**: Left sidebar for settings, right area for form
- **Sticky Header**: Persistent navigation with Back button and Generate action
- **Settings Sidebar**:
  - AI Provider selection (Gemini/Ollama)
  - Document Standard selection (IEEE/IIBA)
  - Language selection (English/Vietnamese)
  - Input Mode selection (Quick/Guided)
  - Form Completion progress bar
- **Responsive**: Stacks on mobile devices

#### Document Preview (`/preview/[id]`)
- Added "Back to History" navigation
- Improved header layout with document metadata

### ✨ New Features

#### Document History Page (`/history`)
- New dedicated page for viewing all documents
- Filter by document type (All, BRD, SRS, FRD)
- Search by document title
- Document cards with type badges, titles, dates
- Empty state with helpful messages
- Loading skeleton during data fetch

#### Multi-Language Support
- Generate documents in English or Vietnamese
- Language selector in BRD creation page
- Updated AI prompts with language-specific instructions

#### Export Improvements
- **PDF Export**: Professional formatting with:
  - Times New Roman font
  - 13pt body text
  - Proper margins and spacing
  - Clean section headings
- **DOCX Export**: Professional formatting with:
  - Times New Roman font
  - 13pt body text, 14pt headings
  - Proper heading hierarchy
  - Numbered lists and bullet points
  - Table support

### 🔧 Technical Changes

- Default AI provider changed from Ollama to Gemini
- Added `remark-gfm` for GitHub Flavored Markdown
- Added `rehype-raw` for proper HTML rendering in markdown
- Form completion percentage calculation
- Auto-fallback from Gemini to Ollama on API errors

### 📦 Dependencies Added
- `html2pdf.js` - PDF generation
- `docx` + `file-saver` - DOCX generation
- `remark-gfm` - GFM markdown support
- `rehype-raw` - Raw HTML in markdown

---

## [1.0.0] - 2026-01-15

### Initial Release

- Generate BRD from free-text or structured form input
- Transform BRD → SRS → FRD automatically
- Dual AI support: Ollama (local) and Gemini (cloud)
- IEEE and IIBA template standards
- Markdown export with YAML frontmatter
- Document chain tracking and traceability
- SQLite database with Prisma ORM
- Next.js 15 + TypeScript + Tailwind CSS
