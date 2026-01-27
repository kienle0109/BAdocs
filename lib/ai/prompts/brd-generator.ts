export interface BRDInput {
    projectName: string;
    description: string;
    stakeholders?: string[];
    features?: string[];
    scope?: {
        inScope?: string[];
        outOfScope?: string[];
    };
    targetAudience?: string;
    // Enhanced fields
    goals?: {
        primary?: string[];
        metrics?: any[];
        timeline?: string;
    };
    constraints?: {
        budget?: string;
        timeline?: string;
        technical?: string;
        risks?: any[];
    };
}

export function buildPrompt(input: BRDInput | string, template: 'IEEE' | 'IIBA', language: 'en' | 'vi' = 'en'): string {
    // 0. Handle Legacy String Input (Fallback)
    let structuredInput: BRDInput;
    if (typeof input === 'string') {
        structuredInput = {
            projectName: "Unspecified Project",
            description: input,
        };
    } else {
        structuredInput = input;
    }

    // 1. Context Build
    const projectContext = `
PROJECT CONTEXT:
- Name: ${structuredInput.projectName}
- Core Concept: ${structuredInput.description}
- Key Stakeholders: ${structuredInput.stakeholders?.join(', ') || 'To be identified by AI based on domain'}
- Target Users: ${structuredInput.targetAudience || 'General users'}
- Key Features Initial List: ${structuredInput.features?.join('; ') || 'Not specified'}
- Scope (In): ${structuredInput.scope?.inScope?.join('; ') || 'As implied by description'}
- Scope (Out): ${structuredInput.scope?.outOfScope?.join('; ') || 'None explicitly stated'}
- Constraints: Budget(${structuredInput.constraints?.budget || 'N/A'}), Timeline(${structuredInput.constraints?.timeline || 'N/A'})
`;

    // 2. Language & Tone
    const languageInstruction = language === 'vi'
        ? `LANGUAGE CONSTRAINT: VIETNAMESE (TIẾNG VIỆT) ONLY.
           - Professional BA terminology (e.g., "Stakeholder" -> "Bên liên quan", "Requirement" -> "Yêu cầu").
           - Tone: Formal, Objective, Precision.`
        : `LANGUAGE CONSTRAINT: ENGLISH. Tone: Professional, IEEE Standard.`;

    // 3. The "Agent" Persona & Chain of Thought
    const basePrompt = `
You are a Lead Business Analyst with 15 years of experience in Software Engineering.
Your task is to draft a specialized Business Requirements Document (BRD) based on the standard ${template}.

${languageInstruction}

${projectContext}

### CRITICAL INSTRUCTION - "ENRICHMENT MODE":
The user input provided above is just a starting point. Your job is NOT to just copy-paste it.
You must **Analyzes & Expands** the requirements:
1.  **Infer Missing Features**: If the user says "E-commerce App", you MUST automatically add requirements for "User Auth", "Product Catalog", "Cart", "Order Management", "Payment Gateway Integration" even if they weren't listed.
2.  **Define Edge Cases**: Don't just list "Login"; list "Password Reset", "Lockout policy".
3.  **Identify Hidden Stakeholders**: Add "System Admins", "Support Staff", "Third-party Providers".
4.  **SMART Requirements**: Every requirement must be Specific, Measurable, Achievable, Relevant, Time-bound.

### REQUIRED STRUCTURE (${template}):
(The AI must generate the full Markdown content following this exact structure, filling it with the ENRICHED content)

${template === 'IEEE' ? IEEE_BRD_STRUCTURE : IIBA_BRD_STRUCTURE}

### GENERATION RULES:
- **Do not** return any conversational text. Return ONLY the Markdown content.
- **Do not** use placeholders like "[Insert text here]". YOU must write the content yourself based on the context.
- Start directly with "# [Project Name] - Business Requirements Document".

GENERATE DOCUMENT NOW:
`;
    return basePrompt;
}

const IEEE_BRD_STRUCTURE = `IEEE 29148 BRD STRUCTURE:

# 1. Introduction
## 1.1 Purpose
## 1.2 Scope
## 1.3 Business Context
## 1.4 Definitions, Acronyms, and Abbreviations
## 1.5 References

# 2. Business Objectives
## 2.1 Business Goals
## 2.2 Success Metrics
## 2.3 Assumptions and Constraints

# 3. Stakeholders
## 3.1 Stakeholder Analysis Table
| Stakeholder | Role | Interest | Influence |
|-------------|------|----------|-----------|
| ... | ... | ... | ... |

## 3.2 Key Decision Makers

# 4. Current State Analysis
## 4.1 Current Business Processes
## 4.2 Pain Points
## 4.3 Opportunities for Improvement

# 5. Proposed Solution (High-Level)
## 5.1 Solution Overview
## 5.2 Key Features
## 5.3 Benefits

# 6. Scope and Boundaries
## 6.1 In Scope
## 6.2 Out of Scope
## 6.3 Future Considerations

# 7. High-Level Business Requirements
## 7.1 Functional Requirements (Business Perspective)
## 7.2 Non-Functional Requirements
## 7.3 Data Requirements
## 7.4 Integration Requirements

# 8. Constraints
## 8.1 Budget Constraints
## 8.2 Time Constraints
## 8.3 Technical Constraints
## 8.4 Regulatory/Compliance Constraints

# 9. Risks and Mitigation
| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| ... | ... | ... | ... |

# 10. Approval and Sign-Off
## 10.1 Review Process
## 10.2 Approvers`;

const IIBA_BRD_STRUCTURE = `IIBA BABOK v3 BRD STRUCTURE:

# 1. Executive Summary
## 1.1 Business Case Overview
## 1.2 Expected Value

# 2. Business Need
## 2.1 Problem Statement
## 2.2 Opportunity Description
## 2.3 Impact Analysis

# 3. Stakeholder Analysis
## 3.1 Stakeholder Map
## 3.2 RACI Matrix
| Activity | Responsible | Accountable | Consulted | Informed |
|----------|-------------|-------------|-----------|----------|
| ... | ... | ... | ... | ... |

# 4. Situation Assessment
## 4.1 Current State
## 4.2 Desired Future State
## 4.3 Gap Analysis

# 5. Solution Approach
## 5.1 Recommended Solution
## 5.2 Alternative Solutions Considered
## 5.3 Justification

# 6. Business Requirements
## 6.1 Business Capabilities Required
## 6.2 Stakeholder Requirements
## 6.3 Solution Requirements (High-Level)
## 6.4 Transition Requirements

# 7. Assumptions and Constraints
## 7.1 Business Assumptions
## 7.2 Business Constraints
## 7.3 Dependencies

# 8. Change Strategy
## 8.1 Organizational Change Impact
## 8.2 Training Requirements
## 8.3 Communication Plan

# 9. Success Criteria
## 9.1 Key Performance Indicators
## 9.2 Acceptance Criteria

# 10. Appendices
## 10.1 Glossary
## 10.2 Supporting Documents`;
