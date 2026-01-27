// SRS Generator AI Prompts

export interface SRSInput {
    // Context
    projectInfo: {
        name: string;
        description?: string; // From BRD or summary
        domain?: string; // e.g. Fintech, Healthcare
    };

    // Technical Context
    techStack?: string[]; // e.g. React, Node.js

    // Core requirements
    features?: string[];
    actors?: string[];

    // Detailed inputs (if from Form)
    useCases?: any[]; // Allow raw use case objects
    nfrs?: any[];
    businessRules?: any[];

    // Source Material
    brdContent?: string; // Full text override
}

export interface SRSPromptOptions {
    inputType: 'quick' | 'guided' | 'from-brd';
    template: 'IEEE' | 'IIBA';
    language: 'en' | 'vi';
    sdlc?: 'waterfall' | 'agile';
}

export function buildPrompt(
    input: SRSInput | string,
    options: SRSPromptOptions
): string {
    // 0. Normalize Input
    let structuredInput: SRSInput;
    if (typeof input === 'string') {
        structuredInput = {
            projectInfo: { name: 'New Project', description: input }
        };
    } else {
        structuredInput = input;
    }

    return buildSRSPrompt(structuredInput, options);
}

export function buildSRSPrompt(
    input: SRSInput,
    options: SRSPromptOptions
): string {
    const { template, language, inputType, sdlc = 'waterfall' } = options;

    const isVietnamese = language === 'vi';
    const isAgile = sdlc === 'agile';

    // 1. Role Definition
    const persona = `
ROLE: You are a Senior Technical Architect and Systems Analyst with 20+ years of experience.
Your expertise lies in translating high-level business needs into PRECISE, TECHNICAL, and IMPLEMENTABLE software specifications.
You are strict about "No Vague Requirements" (e.g., instead of "fast", you specify "< 200ms").
`;

    // 2. Language & Tone
    const languageInstruction = isVietnamese
        ? `LANGUAGE CONSTRAINT: VIETNAMESE (TIẾNG VIỆT).
           - All technical terms (API, JSON, JWT) can remain in English.
           - Section titles, descriptions, and user flows MUST be in professional Vietnamese.
           - Tone: Technical, Objective, Precision.`
        : `LANGUAGE CONSTRAINT: ENGLISH. Tone: Professional, IEEE Standard.`;

    // 3. Context Build
    const contextBlock = `
PROJECT CONTEXT:
- Name: ${input.projectInfo.name}
- Domain: ${input.projectInfo.domain || 'General Software'}
- Tech Stack: ${input.techStack?.join(', ') || 'Best fit for domain (Suggest modern stack)'}
- Key Features: ${input.features?.join(', ') || 'As inferred from description'}
- Actors: ${input.actors?.join(', ') || 'To be identified'}

CORE REQUIREMENT / DESCRIPTION:
${input.projectInfo.description || ''}

SOURCE MATERIAL / CONTEXT:
${input.brdContent || 'No additional source material provided.'}
`;

    // 4. Feature Focus
    const focusType = isAgile ? 'User Stories' : 'Use Case Specifications';
    const methodologyTemplate = isAgile ? USER_STORY_TEMPLATE : USE_CASE_TEMPLATE;

    // 5. Chain of Thought Instructions
    const instructions = `
CRITICAL INSTRUCTIONS - TECHNICAL DEEP DIVE:
You are not just formatting text. You are DESIGNING the system.

PHASE 1: ARCHITECTURE & DATA MODELING
- First, mentally design the Database Schema (Entities & Relationships) required to support these features.
- Identify necessary API endpoints (REST/GraphQL).
- Determine Security mechanisms (AuthZ, AuthN, Encryption).

PHASE 2: DETAILED SPECIFICATION (${focusType})
${isAgile
            ? `- Write User Stories using INVEST principles.
       - INCLUDED Gherkin Syntax (Given/When/Then) for ALL Acceptance Criteria.
       - Link stories to specific Persona definitions.`
            : `- Write Use Cases with EXTREME detail.
       - "Basic Path" must mention SYSTEM ACTIONS (e.g., "System validates token", "System queries DB").
       - MUST include at least 2 Exception Paths per Use Case (e.g., Network Fail, Validation Error).`
        }

PHASE 3: NON-FUNCTIONAL REQUIREMENTS (NFR)
- Don't use generic boilerplates. Tailor NFRs to the ${input.projectInfo.domain} domain.
- Performance: Define specific latency/throughput targets.
- Security: Define specific protocols (TLS 1.3, AES-256, RBAC).

PHASE 4: FORMATTING
- Output in strict Markdown.
- Use the structure below.
- Do NOT output your "mental design" notes, only the final SRS document.
`;

    const templateStructure = template === 'IEEE'
        ? (isAgile ? IEEE_AGILE_STRUCTURE : IEEE_SRS_STRUCTURE)
        : (isAgile ? IIBA_AGILE_STRUCTURE : IIBA_SRS_STRUCTURE);

    return `
${persona}

${languageInstruction}

${contextBlock}

${instructions}

REQUIRED STRUCTURE:
${templateStructure}

TEMPLATES TO USE:
${methodologyTemplate}

GENERATE THE COMPLETE SRS NOW:
`;
}

// ======================= TEMPLATE CONSTANTS =======================

const USE_CASE_TEMPLATE = `
### UC-[ID]: [Name]

| Specification | Details |
| :--- | :--- |
| **Actors** | [List of Actors] |
| **Pre-conditions** | [State before execution] |
| **Post-conditions** | [State after successful execution] |

**Basic Path (Flow of Events):**

| Step | Actor | Action | System Response |
| :--- | :--- | :--- | :--- |
| 1 | [Actor] | [Action taken] | [System Validation/Response] |
| 2 | System | [Processing] | [Result] |
| ... | ... | ... | ... |

**Alternative Paths**:
| Path | Condition | Step |
| :--- | :--- | :--- |
| **ALT-1** | [When condition met] | [Alternate Action] |

**Exception Paths (Error Handling)**:
| Scenario | Trigger | System Handling |
| :--- | :--- | :--- |
| **EXC-1** | [Error condition] | Logs error (ERR-XXX), shows friendly message |
`;

const USER_STORY_TEMPLATE = `
### US-[ID]: [Title]
"As a [Role], I want [Feature], so that [Benefit]."

**Acceptance Criteria (Gherkin):**
Scenario: [Scenario Name]
  Given [Precondition]
  When [Action]
  Then [Expected Result]
`;

const IEEE_SRS_STRUCTURE = `
# 1. Introduction
## 1.1 Purpose
## 1.2 Scope
## 1.3 Definitions & Acronyms

# 2. Overall Description
## 2.1 Product Perspective (Architecture Diagram description)
## 2.2 User Classes and Characteristics
## 2.3 Operating Environment
## 2.4 Design and Implementation Constraints

# 3. System Features (Use Cases)
[Insert Detailed Use Cases here]

# 4. External Interface Requirements
## 4.1 User Interfaces
## 4.2 Hardware Interfaces
## 4.3 Software Interfaces (APIs)
## 4.4 Communications Interfaces

# 5. Non-Functional Requirements
## 5.1 Performance
## 5.2 Security (Auth, Encryption)
## 5.3 Reliability
`;

const IIBA_SRS_STRUCTURE = `
# 1. Solution Overview
## 1.1 Solution Context
## 1.2 Solution Components

# 2. Stakeholder Requirements
## 2.1 Stakeholder Analysis

# 3. Functional Requirements (Use Cases)
[Insert Detailed Use Cases here]

# 4. Non-Functional Requirements
## 4.1 Quality Attributes
## 4.2 Constraint

# 5. Transition Requirements
`;

const IEEE_AGILE_STRUCTURE = `
# 1. Introduction
## 1.1 Purpose
## 1.2 Scope

# 2. Overall Description
## 2.1 User Personas

# 3. Product Backlog (Epics & Stories)
## 3.1 Epic: [Name]
[Insert User Stories for Epic 1]

## 3.2 Epic: [Name]
[Insert User Stories for Epic 2]

# 4. Technical Requirements
## 4.1 API Specifications
## 4.2 Database Schema Draft
`;

const IIBA_AGILE_STRUCTURE = `
# 1. Initiative Overview
## 1.1 Vision & Scope

# 2. Analysis Models
## 2.1 Personas
## 2.2 Conceptual Data Model

# 3. Product Backlog
[Insert Epics and Stories]

# 4. Quality Attributes
`;
