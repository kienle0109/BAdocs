// FRD (Functional Requirements Document) Generation Prompts
// Standards: IEEE 29148 / IIBA BABOK v3

import type { FRDFormData } from '../../frd-form-utils';

export interface FRDPromptOptions {
    inputType: 'from-srs' | 'quick' | 'guided';
    template: 'IEEE' | 'IIBA';
    language: 'en' | 'vi';
}

// IEEE 29148 FRD Structure
const IEEE_FRD_STRUCTURE = `
1. Introduction
   1.1 Purpose of the FRD
   1.2 Scope
   1.3 Definitions, Acronyms, and Abbreviations
   1.4 References
   1.5 Overview

2. Functional Requirements
   2.1 Core Functional Requirements
   2.2 Secondary Functional Requirements
   2.3 Optional Features

3. System Features
   3.1 Feature Descriptions
   3.2 User Stories
   3.3 Acceptance Criteria

4. User Interface Requirements
   4.1 Screen Layouts
   4.2 Navigation Flow
   4.3 UI Elements and Components

5. Data Requirements
   5.1 Data Entities and Attributes
   5.2 Data Relationships
   5.3 Data Validation Rules

6. External Interface Requirements
   6.1 System Interfaces
   6.2 API Specifications
   6.3 Integration Points

7. Constraints and Assumptions
   7.1 Technical Constraints
   7.2 Business Rules
   7.3 Assumptions
   7.4 Dependencies
`;

// IIBA BABOK v3 FRD Structure
const IIBA_FRD_STRUCTURE = `
1. Business Need
   1.1 Problem Statement
   1.2 Business Objectives
   1.3 Success Metrics

2. Functional Requirements
   2.1 Capability Requirements
   2.2 Process Requirements
   2.3 Feature Requirements

3. Solution Components
   3.1 System Features
   3.2 User Interactions
   3.3 Business Logic

4. Information Architecture
   4.1 Data Models
   4.2 Information Flow
   4.3 Data Management

5. Interface Requirements
   5.1 User Interface
   5.2 System Interfaces
   5.3 External Integrations

6. Quality of Service Requirements
   6.1 Functional Standards
   6.2 Compliance Requirements
   6.3 Business Rules

7. Transition Requirements
   7.1 Implementation Assumptions
   7.2 Dependencies
   7.3 Constraints
`;

// FR Detail Template
const FR_TEMPLATE = `
**FR-XXX: [Requirement Name]**

- **Category**: [Core/Secondary/Nice-to-Have]
- **Priority**: [High/Medium/Low]
- **Source**: [UC-XXX from SRS, or BR-XXX from BRD]
- **Description**: [Detailed functional requirement description]

**Acceptance Criteria**:
1. [Acceptance criterion 1]
2. [Acceptance criterion 2]
3. [Acceptance criterion 3]

**Business Rules**: [Reference to business rules if applicable]
**Dependencies**: [Other requirements this depends on]
`;

// Build FRD Prompt from SRS content
export function buildFRDPrompt(
    content: string,
    options: FRDPromptOptions
): string {
    const { template, language, inputType } = options;

    const languageInstruction = language === 'vi'
        ? 'IMPORTANT: Generate the ENTIRE document in Vietnamese. All section titles, descriptions, functional requirements, features, and content must be in Vietnamese.'
        : 'Generate the document in English.';

    const templateStructure = template === 'IEEE'
        ? IEEE_FRD_STRUCTURE
        : IIBA_FRD_STRUCTURE;

    const frTemplate = FR_TEMPLATE;

    if (inputType === 'from-srs') {
        return `You are a senior Systems Analyst expert specializing in requirements engineering.

Your task is to transform the provided SRS (Software Requirements Specification) into a comprehensive FRD (Functional Requirements Document) following ${template === 'IEEE' ? 'IEEE 29148' : 'IIBA BABOK v3'} standards.

${languageInstruction}

INPUT SRS DOCUMENT:
${content}

TRANSFORMATION GUIDELINES:

1. **Extract Use Cases to Functional Requirements**:
   - Each Use Case in SRS becomes one or more FRs in FRD
   - Basic Path steps → Core Functional Requirements
   - Alternative Paths → Secondary Functional Requirements
   - Exception Paths → Error Handling Requirements

2. **FR ID Mapping**:
   - UC-001 → FR-001, FR-002, FR-003 (one UC can expand to multiple FRs)
   - Maintain traceability: Include source UC-ID in each FR

3. **Detail Enhancement**:
   - Expand Use Case descriptions into detailed functional specifications
   - Convert Pre-conditions/Post-conditions into Acceptance Criteria
   - Extract Actors → User Roles in FRD
   - Extract NFRs → Reference in related FRs

4. **Additional Sections**:
   - User Interface: Design screen flows based on Use Case interactions
   - Data Requirements: Extract entities from Use Case data objects
   - Integration Points: Identify external systems mentioned in Use Cases

REQUIRED STRUCTURE:
${templateStructure}

FUNCTIONAL REQUIREMENT FORMAT:
${frTemplate}

CRITICAL RULES:
- Every FR must have a unique ID (FR-001, FR-002, etc.)
- Every FR must reference source (UC-XXX)
- Every FR must have clear acceptance criteria
- Use professional, precise technical language
- Be specific and measurable
- Avoid ambiguous terms like "user-friendly" or "fast"

${language === 'vi' ? 'Remember: Write EVERYTHING in Vietnamese!' : ''}

Generate a complete, professional FRD document now.`;
    } else {
        // Quick or Guided mode
        return `You are a senior Systems Analyst expert specializing in functional requirements documentation.

Your task is to create a comprehensive FRD (Functional Requirements Document) following ${template === 'IEEE' ? 'IEEE 29148' : 'IIBA BABOK v3'} standards.

${languageInstruction}

INPUT INFORMATION:
${content}

REQUIRED STRUCTURE:
${templateStructure}

FUNCTIONAL REQUIREMENT FORMAT:
${frTemplate}

GUIDELINES:

1. **Identify Functional Requirements**:
   - Analyze the input to extract all functional capabilities
   - Categorize as Core, Secondary, or Nice-to-Have
   - Assign priority (High, Medium, Low)

2. **FR Numbering**:
   - Use sequential IDs: FR-001, FR-002, FR-003, etc.
   - Group related requirements under the same feature

3. **System Features**:
   - Define high-level features (FT-001, FT-002, etc.)
   - Link features to related FRs
   - Include user stories and acceptance criteria

4. **User Interface**:
   - Define key screens (UI-001, UI-002, etc.)
   - Describe layout and navigation
   - Specify UI components

5. **Data Requirements**:
   - Identify data entities
   - Define attributes and types
   - Specify relationships and validation rules

6. **Integration Points**:
   - List external systems
   - Specify API endpoints and protocols
   - Define data formats and authentication

CRITICAL RULES:
- Be specific and measurable
- Use clear, unambiguous language
- Include acceptance criteria for all requirements
- Reference dependencies between requirements
- Follow ${template} standard structure strictly

${language === 'vi' ? 'IMPORTANT: Generate EVERYTHING in Vietnamese!' : ''}

Generate a complete, professional FRD document now.`;
    }
}

// Build FRD Prompt from structured form data (Guided Mode)
export function buildDirectFRDPrompt(
    data: FRDFormData,
    template: 'IEEE' | 'IIBA',
    language: 'en' | 'vi' = 'en'
): string {
    const languageInstruction = language === 'vi'
        ? 'IMPORTANT: Generate the ENTIRE document in Vietnamese. Expand and enhance the provided information in Vietnamese.'
        : 'Generate the document in English. Expand and enhance the provided information.';

    const templateStructure = template === 'IEEE'
        ? IEEE_FRD_STRUCTURE
        : IIBA_FRD_STRUCTURE;

    // Format the structured data
    const formattedData = formatStructuredDataForPrompt(data);

    return `You are a senior Systems Analyst expert specializing in functional requirements documentation.

Your task is to create a comprehensive, professional FRD (Functional Requirements Document) following ${template === 'IEEE' ? 'IEEE 29148' : 'IIBA BABOK v3'} standards.

${languageInstruction}

INPUT DATA (Structured Form):
${formattedData}

REQUIRED STRUCTURE:
${templateStructure}

YOUR TASK:
1. **Expand the Content**: Take the structured input and expand it into a full professional document
2. **Add Context**: Provide introductory paragraphs and explanations
3. **Enhance Details**: Add technical depth while maintaining clarity
4. **Format Professionally**: Use proper headings, numbering, and formatting
5. **Maintain Traceability**: Keep all IDs (FR-XXX, FT-XXX, UI-XXX) as provided

ENHANCEMENT GUIDELINES:
- Add an Introduction section with document purpose and scope
- Expand functional requirement descriptions with technical details
- Add examples where helpful
- Include diagrams descriptions (e.g., "Figure 1: User Authentication Flow")
- Add a Glossary section if technical terms are used
- Include References section if applicable

CRITICAL RULES:
- Do NOT change the FR/FT/UI IDs provided
- Do NOT remove any information from the input
- Maintain professional technical writing style
- Be specific, clear, and measurable
- Follow ${template} standard structure

${language === 'vi' ? 'Remember: Generate EVERYTHING in Vietnamese, expanding on the provided Vietnamese input!' : ''}

Generate a complete, professional FRD document now.`;
}

// Helper function to format FRD form data for prompt
function formatStructuredDataForPrompt(data: FRDFormData): string {
    let formatted = '';

    // Overview
    formatted += `## Project Overview\n\n`;
    formatted += `- Project Name: ${data.overview.projectName}\n`;
    formatted += `- Project Code: ${data.overview.projectCode}\n`;
    formatted += `- Version: ${data.overview.version}\n`;
    formatted += `- Date: ${data.overview.date}\n`;
    formatted += `- Prepared By: ${data.overview.preparedBy}\n`;
    formatted += `- Purpose: ${data.overview.purpose}\n`;
    formatted += `- Scope: ${data.overview.scope}\n`;

    if (data.overview.stakeholders.length > 0) {
        formatted += `- Stakeholders: ${data.overview.stakeholders.join(', ')}\n`;
    }
    formatted += '\n';

    // Functional Requirements
    if (data.functionalRequirements.length > 0) {
        formatted += `## Functional Requirements\n\n`;
        data.functionalRequirements.forEach(fr => {
            formatted += `### ${fr.id}: ${fr.name}\n`;
            formatted += `- Category: ${fr.category}\n`;
            formatted += `- Priority: ${fr.priority}\n`;
            formatted += `- Source: ${fr.source}\n`;
            formatted += `- Description: ${fr.description}\n`;

            if (fr.acceptanceCriteria.length > 0) {
                formatted += `- Acceptance Criteria:\n`;
                fr.acceptanceCriteria.forEach(ac => {
                    formatted += `  - ${ac}\n`;
                });
            }
            formatted += '\n';
        });
    }

    // System Features
    if (data.systemFeatures.length > 0) {
        formatted += `## System Features\n\n`;
        data.systemFeatures.forEach(feature => {
            formatted += `### ${feature.id}: ${feature.name}\n`;
            formatted += `- Description: ${feature.description}\n`;

            if (feature.userStories.length > 0) {
                formatted += `- User Stories:\n`;
                feature.userStories.forEach(us => {
                    formatted += `  - ${us}\n`;
                });
            }

            if (feature.acceptanceCriteria.length > 0) {
                formatted += `- Acceptance Criteria:\n`;
                feature.acceptanceCriteria.forEach(ac => {
                    formatted += `  - ${ac}\n`;
                });
            }

            if (feature.relatedFR.length > 0) {
                formatted += `- Related Requirements: ${feature.relatedFR.join(', ')}\n`;
            }
            formatted += '\n';
        });
    }

    // User Interface
    if (data.userInterface.length > 0) {
        formatted += `## User Interface\n\n`;
        data.userInterface.forEach(screen => {
            formatted += `### ${screen.id}: ${screen.name}\n`;
            formatted += `- Layout: ${screen.layout}\n`;
            formatted += `- Flow: ${screen.flowDescription}\n`;
            if (screen.wireframeUrl) {
                formatted += `- Wireframe: ${screen.wireframeUrl}\n`;
            }
            formatted += '\n';
        });
    }

    // Data Requirements
    if (data.dataRequirements.length > 0) {
        formatted += `## Data Requirements\n\n`;
        data.dataRequirements.forEach(entity => {
            formatted += `### Entity: ${entity.name}\n`;
            formatted += `Attributes:\n`;
            entity.attributes.forEach(attr => {
                formatted += `- ${attr.name} (${attr.type})${attr.required ? ' *required*' : ''}${attr.description ? ': ' + attr.description : ''}\n`;
            });

            if (entity.relationships.length > 0) {
                formatted += `Relationships:\n`;
                entity.relationships.forEach(rel => {
                    formatted += `- ${rel}\n`;
                });
            }

            if (entity.validationRules.length > 0) {
                formatted += `Validation Rules:\n`;
                entity.validationRules.forEach(rule => {
                    formatted += `- ${rule}\n`;
                });
            }
            formatted += '\n';
        });
    }

    // Integration Points
    if (data.integrationPoints.length > 0) {
        formatted += `## Integration Points\n\n`;
        data.integrationPoints.forEach(integration => {
            formatted += `### ${integration.systemName}\n`;
            formatted += `- Endpoint: ${integration.apiEndpoint}\n`;
            formatted += `- Protocol: ${integration.protocol}\n`;
            formatted += `- Data Format: ${integration.dataFormat}\n`;
            formatted += `- Authentication: ${integration.authentication}\n`;
            formatted += `- Description: ${integration.description}\n\n`;
        });
    }

    // Constraints
    formatted += `## Constraints and Assumptions\n\n`;

    if (data.constraints.technical.length > 0) {
        formatted += `Technical Constraints:\n`;
        data.constraints.technical.forEach(c => {
            formatted += `- ${c}\n`;
        });
        formatted += '\n';
    }

    if (data.constraints.businessRules.length > 0) {
        formatted += `Business Rules:\n`;
        data.constraints.businessRules.forEach(br => {
            formatted += `- ${br}\n`;
        });
        formatted += '\n';
    }

    if (data.constraints.assumptions.length > 0) {
        formatted += `Assumptions:\n`;
        data.constraints.assumptions.forEach(a => {
            formatted += `- ${a}\n`;
        });
        formatted += '\n';
    }

    if (data.constraints.dependencies.length > 0) {
        formatted += `Dependencies:\n`;
        data.constraints.dependencies.forEach(d => {
            formatted += `- ${d}\n`;
        });
        formatted += '\n';
    }

    return formatted;
}

// Adapter for generic AI service (matches gemini.ts/ollama.ts interface)
export function buildPrompt(
    input: string,
    template: 'IEEE' | 'IIBA',
    language: 'en' | 'vi' = 'en'
): string {
    // Idempotency check: If input already looks like our prompt, return it as-is
    if (input.includes('You are a senior Systems Analyst expert')) {
        return input;
    }

    // Default to quick mode if raw input is received
    return buildFRDPrompt(input, {
        inputType: 'quick',
        template,
        language
    });
}
