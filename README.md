# BA Documentation Generator

AI-powered tool for Business Analysts to create professional BRD, SRS, and FRD documents following IEEE and IIBA standards.

## ✨ Features

### Core Features
- ✅ **Generate BRD** - Create Business Requirements Documents from text or structured input
- ✅ **Transform BRD → SRS → FRD** - Automatic document chain transformation
- ✅ **Dual AI Support** - Ollama (local/offline) or Gemini Free (cloud/fast)
- ✅ **IEEE & IIBA Templates** - Choose between international documentation standards
- ✅ **Document Chain Tracking** - Full traceability from BRD to FRD

### New in v2.0
- ✅ **Document History Page** - View, filter, and search all generated documents
- ✅ **Multi-Language Support** - Generate documents in English or Vietnamese
- ✅ **Professional Export** - PDF and DOCX export with Times New Roman, 13pt formatting
- ✅ **Redesigned BRD Page** - Split-layout UI with settings sidebar and form content
- ✅ **Form Completion Progress** - Visual progress indicator for guided mode
- ✅ **Back Navigation** - Consistent back buttons across all pages
- ✅ **SVG Icons** - Professional iconography (no emojis)

### Coming Soon
- 🔜 **Generate SRS** - Direct SRS generation from requirements
- 🔜 **Generate FRD** - Direct FRD generation from requirements

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | SQLite + Prisma ORM |
| AI (Local) | Ollama (llama3.1:8b) |
| AI (Cloud) | Google Gemini (gemini-flash-latest) |
| Export | html2pdf.js (PDF), docx (DOCX) |
| Markdown | react-markdown + remark-gfm + rehype-raw |

## 📸 Screenshots

### Home Page
4-column grid layout with feature cards and navigation.

### BRD Creation Page (New Design)
Split-layout with settings sidebar (AI Provider, Standard, Language, Mode, Progress) and form content area.

### Document History
Filter by type (BRD/SRS/FRD), search by title, view and manage all documents.

### Document Preview
Full markdown rendering with PDF/DOCX export options.

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
npx prisma migrate dev
```

### 3. Configure AI Provider

**Option A: Gemini Free (Recommended - Cloud, Fast)**

```bash
# Get free API key: https://aistudio.google.com/apikey
# Add to .env:
echo "GEMINI_API_KEY=your_key_here" >> .env
echo "GEMINI_MODEL=gemini-flash-latest" >> .env
```

**Option B: Ollama (Local - Privacy)**

```bash
# Install Ollama from https://ollama.com
# Pull model:
ollama pull llama3.1:8b

# Verify:
curl http://localhost:11434/api/tags
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Creating a BRD

1. **Navigate** to `/new` or click "Create New BRD" from home
2. **Configure** settings in the left sidebar:
   - AI Provider (Gemini/Ollama)
   - Document Standard (IEEE/IIBA)
   - Language (English/Vietnamese)
   - Input Mode (Quick/Guided)
3. **Fill in** the form on the right side
4. **Generate** when form completion reaches 30%+

### Viewing Documents

1. Click "Document History" from home page
2. Filter by type: All, BRD, SRS, FRD
3. Search by document title
4. Click "View" to open document preview

### Exporting Documents

1. Open any document in preview
2. Click "Export PDF" or "Export DOCX"
3. Documents are formatted with:
   - Times New Roman font
   - 13pt body text, 14pt headings
   - Professional margins and spacing

### Transforming Documents

1. Open a BRD in preview
2. Click "Transform to SRS"
3. Open the SRS and click "Transform to FRD"

## 🗺️ Page Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with feature cards |
| `/new` | Create new BRD (split-layout) |
| `/history` | Document history with filters |
| `/preview/[id]` | Document preview with export |

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Generate BRD from input |
| `/api/transform/brd-to-srs` | POST | Transform BRD to SRS |
| `/api/transform/srs-to-frd` | POST | Transform SRS to FRD |
| `/api/documents` | GET | List all documents (with filters) |
| `/api/documents/[id]` | GET | Get single document |
| `/api/documents/[id]/export` | GET | Export as Markdown |
| `/api/documents/[id]` | DELETE | Delete document |

## 📐 Document Standards

| Standard | Description |
|----------|-------------|
| **IEEE 29148** | International standard for business requirements |
| **IEEE 830** | Software requirements specification standard |
| **IIBA BABOK v3** | Business Analysis Body of Knowledge |

## 🎨 UI/UX Design

The application follows modern design principles:
- **Dark theme** with purple gradient background
- **Glassmorphism** cards with backdrop blur
- **Responsive layout** (mobile-friendly)
- **Consistent spacing** and typography
- **Smooth transitions** (200ms)
- **Loading states** with skeletons and spinners

## 📁 Project Structure

```
ba-doc-generator/
├── app/
│   ├── api/                 # API routes
│   │   ├── documents/       # Document CRUD
│   │   ├── generate/        # BRD generation
│   │   └── transform/       # Document transformation
│   ├── history/             # Document history page
│   ├── new/                 # BRD creation (split-layout)
│   ├── preview/[id]/        # Document preview
│   ├── globals.css          # Global styles + prose
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   └── brd-form/            # Form components
├── lib/
│   ├── ai/                  # AI service layer
│   │   ├── ai-service.ts    # Provider abstraction
│   │   ├── gemini.ts        # Gemini integration
│   │   ├── ollama.ts        # Ollama integration
│   │   └── prompts/         # Prompt templates
│   └── brd-form-utils.ts    # Form utilities
├── prisma/
│   └── schema.prisma        # Database schema
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT
