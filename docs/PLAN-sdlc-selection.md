# Implementation Plan - SDLC Model Selection (Waterfall vs Agile)

## Goal
Enable users to select an SDLC methodology (Waterfall or Agile) during document generation. This selection will tailor the AI output structure:
- **Waterfall**: Focus on detailed Use Case Specifications, formal requirements, and extensive documentation.
- **Agile**: Focus on User Stories, Epics, Acceptance Criteria, and iterative value delivery.

## User Review Required (Socratic Gate)
> [!IMPORTANT]
> Please review and clarify the following behaviors:

1.  **Scope of Impact**:
    *   **Current Plan**: Primarily targets SRS generation (switching between Use Cases vs User Stories).
    *   **Question**: Should this also apply to **BRD** (Requirements vs Epics) and **FRD** (System Specs vs Backlog Item Specs)?
2.  **Persistence Strategy**:
    *   **Recommendation**: We should save the `sdlc` choice in the database with the document. This allows future transformations (e.g., BRD -> SRS) to automatically default to the parent's SDLC model.
3.  **Default Behavior**:
    *   Which model should be the default? (Currently suggesting **Waterfall** as it matches the existing detailed output, or make it explicit/required).
4.  **UI Placement**:
    *   New "Development Method" card in the sidebar settings, near "Document Standard".

## Proposed Changes

### 1. Database Schema
*   Update `prisma/schema.prisma`:
    *   Add `sdlcModel String? @default("waterfall")` to the `Document` model.

### 2. Frontend Implementation
*   **Components**:
    *   Create `SDLCSelection` component (shared settings card).
    *   Update `SettingsSidebar` (if abstracted) or individual pages:
        *   `app/new/page.tsx` (BRD)
        *   `app/srs/new/page.tsx` (SRS)
        *   `app/srs/from-brd/page.tsx` (SRS from BRD)
        *   `app/preview/[id]/page.tsx` (Transformation)
*   **Logic**:
    *   Add `sdlc` state to forms.
    *   Pass `sdlc` to generation APIs.

### 3. Backend & AI Service
*   **API Routes**:
    *   Update `api/generate/stream/route.ts` to accept `sdlc`.
    *   Update `api/transform/...` routes.
*   **AI Service (`lib/ai`)**:
    *   Update `GenerateOptions` interface.
*   **Prompt Engineering (`lib/ai/prompts`)**:
    *   Update `srs-prompts.ts`:
        *   Condition: `if (sdlc === 'agile')` -> Generate **User Stories** (Role, Goal, Benefit, Acceptance Criteria).
        *   Condition: `if (sdlc === 'waterfall')` -> Generate **Use Cases** (Description, Actors, Pre/Post, Flows).
    *   Update `brd-prompts.ts` (if confirmed):
        *   Agile: Focus on Epics/Themes.
        *   Waterfall: Focus on Functional/Non-functional Req Lists.

## Verification Plan

### Automated Tests
*   [ ] Test that API accepts `sdlc` parameter.
*   [ ] Verify prompt builders inject correct context based on SDLC param.

### Manual Verification
1.  **SRS (Waterfall)**: Create new SRS, select Waterfall -> Verify output contains "Use Cases" and "Main Flow".
2.  **SRS (Agile)**: Create new SRS, select Agile -> Verify output contains "User Stories" and "Acceptance Criteria".
3.  **Transformation**: Transform a BRD to SRS, selecting Agile -> Verify output format.
