# BA Docs Generator - Design System (Pro Max)

This document outlines the standard UI/UX rules derived from the "Focus Mode" redesign (Reference: `/srs/from-brd`). All new pages and components must adhere to these guidelines to ensure consistency.

## 1. Core Philosophy: "Focus Mode"
- **Clean Slate**: Use deep, neutral backgrounds to reduce eye strain and visual noise.
- **Content First**: The primary workflow (e.g., document selection, editor) takes center stage.
- **Contextual Configuration**: Settings and secondary options are moved to sidebars (Inspectors), avoiding clutter in the main view.
- **Micro-Interactions**: Use subtle borders, glows, and transitions. Avoid heavy solid colors for non-primary actions.

## 2. Color Palette (Slate & Indigo)

### Backgrounds
| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| **Canvas** | `bg-slate-950` | Main page background. |
| **Surface** | `bg-slate-900` | Sidebars, Cards, Panels. |
| **Surface (Hover)** | `bg-slate-800` | Interactive card hover state. |
| **Glass** | `bg-slate-900/50` | Semi-transparent elements (requires backdrop-blur). |

### Borders & Dividers
| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| **Subtle** | `border-slate-800` | Default separators, panel borders. |
| **Active/Focus** | `border-indigo-500` | Selected items, focused inputs. |

### Typography (Text)
| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| **Primary** | `text-slate-200` | Headings, main content. |
| **Secondary** | `text-slate-400` | Subtitles, descriptive text. |
| **Muted** | `text-slate-500` | Meta info (dates, small labels), placeholders. |
| **Brand/Link** | `text-indigo-400` | Active links, primary icons. |
| **Inverse** | `text-white` | Text on colored backgrounds (buttons). |

### Brand Accents
| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| **Primary** | `indigo-500` | Key icons, active indicators, rings. |
| **Action** | `bg-indigo-600` | Primary buttons (Hover: `bg-indigo-500`). |
| **Glow** | `shadow-indigo-500/20` | Subtle glow for primary actions. |

## 3. Layout Patterns

### Page Structure
```tsx
<div className="h-screen bg-slate-950 flex flex-col font-sans">
  {/* Header: Minimal, Breadcrumbs */}
  <header className="h-16 border-b border-slate-800 bg-slate-950 px-6..." />

  <div className="flex-1 flex overflow-hidden">
    {/* Main Content: Centered, Max-Width Constraints */}
    <main className="flex-1 flex flex-col relative min-w-0 bg-slate-950">
       <div className="max-w-3xl mx-auto w-full px-8">
          {/* Content */}
       </div>
    </main>

    {/* Right Sidebar: Configuration (Optional) */}
    <aside className="w-80 border-l border-slate-800 bg-slate-900/30..." />
  </div>
</div>
```

## 4. Component Standards

### Cards (File Explorer Style)
- **Base**: `bg-slate-900/50 border border-slate-800 rounded-xl`
- **Hover**: `hover:bg-slate-800 hover:border-slate-700 transition-all duration-200`
- **Selected**: `bg-slate-800 border-indigo-500 ring-1 ring-indigo-500/20 shadow-md`
- **Icons**:
  - Default: `bg-slate-800 text-slate-400`
  - Active: `bg-indigo-500 text-white`

### Buttons
- **Primary (Floating/Action)**:
  - `bg-indigo-600 hover:bg-indigo-500 text-white`
  - `shadow-lg shadow-indigo-500/20`
  - `rounded-xl font-semibold px-6 py-3`
  - **Interaction**: `hover:-translate-y-0.5 transition-all`
- **Secondary/Ghost**:
  - `text-slate-400 hover:text-white hover:bg-slate-800`
  - `rounded-lg px-3 py-2`

### Inputs (Search/Form)
- **Style**: `bg-slate-900 border border-slate-800 rounded-xl text-white`
- **Focus**: `focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`
- **Placeholder**: `placeholder-slate-500`

### Navigation (Breadcrumbs)
- Use standard text links: `text-slate-500 hover:text-slate-300`
- Separators: `text-slate-700` (Chevrons)
- Current Page: `text-slate-200 font-medium`

## 5. Iconography
- Library: **Lucide React** (or Heroicons).
- Sizing: `w-5 h-5` (Standard), `w-4 h-4` (Small/Meta).
- Stroke: `strokeWidth={1.5}` for cleaner, modern look. `strokeWidth={2}` only for active/bold states.

## 6. Motion & Feedback
- **Transitions**: `transition-all duration-200` (Standard for hover/focus).
- **Loading**: Use designated Skeleton loaders or minimal Spinners (`animate-spin border-t-transparent`).
- **States**: Every interactive element MUST have a visible `:hover` and `:active/:focus` state.
