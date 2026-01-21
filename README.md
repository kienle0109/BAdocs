# BA Documentation Generator

AI-powered tool for Business Analysts to create professional BRD, SRS, and FRD documents following IEEE and IIBA standards.

## Features

- ✅ **Generate BRD** from text input using AI
- ✅ **Transform BRD → SRS → FRD** automatically
- ✅ **Dual AI Support**: Ollama (local, offline) or Gemini Free (cloud, fast)
- ✅ **IEEE & IIBA Templates**: Choose between international standards
- ✅ **Export Markdown**: Download documents with YAML frontmatter
- ✅ **Document Chain Tracking**: See full traceability from BRD to FRD

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma + SQLite
- **AI**: Ollama (local) + Google Gemini (free cloud API)
- **Database**: SQLite with Prisma ORM

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
npx prisma migrate dev
```

### 3. Configure AI Provider

**Option A: Ollama (Local - Recommended for Privacy)**

```bash
# Install Ollama from https://ollama.com
# Pull model:
ollama pull llama3.1:8b

# Verify:
curl http://localhost:11434/api/tags
```

**Option B: Gemini Free (Cloud - Faster)**

```bash
# Get free API key: https://aistudio.google.com/apikey
# Add to .env:
echo "GEMINI_API_KEY=your_key_here" >> .env
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Create BRD**: Input business requirements → Select AI provider & template → Generate
2. **Transform**: BRD → Click "Transform to SRS" → SRS → Click "Transform to FRD"
3. **Export**: Click "Export Markdown" to download document

## Document Standards

- **IEEE 29148** - Business Requirements
- **IEEE 830** - Software Requirements  
- **IIBA BABOK v3** - Business Analysis Body of Knowledge

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Generate BRD from input |
| `/api/transform/brd-to-srs` | POST | Transform BRD to SRS |
| `/api/transform/srs-to-frd` | POST | Transform SRS to FRD |
| `/api/documents` | GET | List all documents |
| `/api/documents/[id]` | GET | Get single document |
| `/api/documents/[id]/export` | GET | Export as Markdown |
| `/api/documents/[id]` | DELETE | Delete document |

## License

MIT
