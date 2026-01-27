export function buildTransformPrompt(srsContent: string, template: 'IEEE' | 'IIBA', language: 'en' | 'vi' = 'en'): string {
    const structureGuide = template === 'IEEE' ? IEEE_FRD_GUIDE : IIBA_FRD_GUIDE;

    const langInstruction = language === 'vi'
        ? 'IMPORTANT: The output must be entirely in VIETNAMESE language. Translate all headings, descriptions, and requirements to Vietnamese.'
        : 'Output language: English.';

    return `You are a senior Technical Requirements Analyst expert specializing in ${template} standards.

SOURCE SRS DOCUMENT:
---
${srsContent}
---

TASK:
Transform this Software Requirements Specification (SRS) into a detailed Functional Requirements Document (FRD) following the ${template} standard.

${structureGuide}

TRANSFORMATION GUIDELINES:
1. Extract all system requirements from the SRS
2. Break down each requirement into detailed functional specifications
3. Define exact behavior for each function/feature
4. Specify input/output details, validation rules, error handling
5. Create workflow diagrams where applicable (use Mermaid syntax)
6. Define UI specifications in detail
7. Specify data processing logic step-by-step
8. Include edge cases and exception handling
${language === 'vi' ? '9. COMPULSORY: All content, including headings and table contents, MUST be in VIETNAMESE.' : ''}

QUALITY STANDARDS:
- Each functional spec MUST have a unique ID (e.g., FRD-001, FRD-002)
- Specifications must be implementation-ready
- Include pseudo-code or logic flow where applicable
- Define all validation rules explicitly
- Specify exact error messages
- Include test scenarios

FORMATTING:
- Output in clean Markdown format
- Use Mermaid diagrams for workflows
- Use tables for validation rules and test cases  
- Use proper heading hierarchy
- ${langInstruction}

Generate the complete FRD document now:`;
}

const IEEE_FRD_GUIDE = `IEEE-BASED FRD STRUCTURE:

# 1. Introduction
## 1.1 Purpose  
## 1.2 Scope
## 1.3 References (Link to SRS)

# 2. System Overview
## 2.1 System Architecture
## 2.2 Component Overview

# 3. Detailed Functional Specifications

For each function, create a section with:
- Function ID
- Related SRS Requirement ID
- Priority Level
- Detailed Description
- Input Parameters (create tables)
- Processing Logic (step-by-step)
- Output Results (create tables)
- Business Rules (create tables)
- Error Handling (create tables with Error Code, Condition, Message)
- Workflow Diagram (use Mermaid flowchart)
- Test Scenarios (create tables)

# 4. User Interface Specifications
## 4.1 Screen Layouts  
## 4.2 Navigation Flow
## 4.3 UI Elements Specification

# 5. Data Specifications
## 5.1 Data Structures
## 5.2 Data Validation Rules
## 5.3 Data Transformation Rules

# 6. Integration Specifications
## 6.1 API Endpoints
## 6.2 Message Formats  
## 6.3 Integration Workflows

# 7. Appendices
## 7.1 Traceability Matrix (create table linking FRD to SRS to BRD)`;

const IIBA_FRD_GUIDE = `IIBA FUNCTIONAL DESIGN STRUCTURE:

# 1. Functional Design Overview
## 1.1 Design Context
## 1.2 Design Scope  
## 1.3 Design Principles

# 2. Functional Decomposition
## 2.1 Feature Breakdown
## 2.2 Component Hierarchy

# 3. Detailed Functional Designs

For each function, create a section with:
- Function ID
- Implements Requirement (reference to SRS)
- Business Value
- Functional Description
- Inputs and Validations (create tables)
- Processing Steps (numbered list)
- Outputs (create tables)
- Business Rules Applied (bullet list)
- Exception Handling (create tables)
- Activity Flow (use Mermaid sequence diagram)
- Acceptance Test Cases (create tables)

# 4. User Experience Design  
## 4.1 User Flows
## 4.2 Screen Designs (Wireframes described)
## 4.3 Interaction Patterns

# 5. Data Design
## 5.1 Data Models
## 5.2 Data Access Patterns
## 5.3 Data Lifecycle

# 6. Integration Design
## 6.1 Integration Points
## 6.2 Message Exchanges
## 6.3 Error Handling

# 7. Requirements Traceability (create table linking Functional Design to Solution Req to Business Req)`;
