export function buildTransformPrompt(brdContent: string, template: 'IEEE' | 'IIBA'): string {
    const basePrompt = `You are a senior Systems Analyst expert specializing in ${template} standards.

SOURCE BRD DOCUMENT:
---
${brdContent}
---

TASK:
Transform this Business Requirements Document (BRD) into a detailed Software Requirements Specification (SRS) following the ${template} standard.

${template === 'IEEE' ? IEEE_SRS_STRUCTURE : IIBA_SRS_STRUCTURE}

TRANSFORMATION GUIDELINES:
1. Extract all business requirements from the BRD
2. Break down high-level business needs into detailed system requirements
3. Define specific functional requirements with clear inputs, processes, and outputs
4. Specify non-functional requirements (performance, security, usability, etc.)
5. Define system interfaces and integration points
6. Create detailed data requirements and models
7. Specify UI/UX requirements where applicable
8. Add technical constraints and dependencies

QUALITY STANDARDS:
- Each requirement MUST have a unique ID (e.g., SRS-FR-001, SRS-NFR-001)
- Requirements must be testable and verifiable
- Use "The system shall..." format for requirements
- Include acceptance criteria for each major requirement
- Maintain traceability back to BRD requirements

FORMATTING:
- Output in clean Markdown format
- Use tables for requirements lists
- Use proper heading hierarchy

Generate the complete SRS document now:`;

    return basePrompt;
}

const IEEE_SRS_STRUCTURE = `IEEE 830 SRS STRUCTURE:

# 1. Introduction
## 1.1 Purpose
## 1.2 Scope
## 1.3 Definitions, Acronyms, and Abbreviations
## 1.4 References
## 1.5 Overview

# 2. Overall Description
## 2.1 Product Perspective
### 2.1.1 System Interfaces
### 2.1.2 User Interfaces
### 2.1.3 Hardware Interfaces
### 2.1.4 Software Interfaces
### 2.1.5 Communications Interfaces
### 2.1.6 Memory Constraints
## 2.2 Product Functions
## 2.3 User Characteristics
## 2.4 Constraints
## 2.5 Assumptions and Dependencies

# 3. Specific Requirements
## 3.1 External Interface Requirements
### 3.1.1 User Interfaces
### 3.1.2 Hardware Interfaces
### 3.1.3 Software Interfaces
### 3.1.4 Communication Interfaces

## 3.2 Functional Requirements
| Req ID | Requirement Statement | Priority | Acceptance Criteria |
|--------|----------------------|----------|---------------------|
| SRS-FR-001 | The system shall... | High | ... |
| SRS-FR-002 | The system shall... | Medium | ... |

## 3.3 Non-Functional Requirements
### 3.3.1 Performance Requirements
| Req ID | Requirement | Target Metric |
|--------|-------------|---------------|
| SRS-NFR-001 | Response time | < 2 seconds |

### 3.3.2 Safety Requirements
### 3.3.3 Security Requirements
### 3.3.4 Software Quality Attributes
- Reliability
- Availability
- Maintainability
- Portability

## 3.4 Database Requirements
### 3.4.1 Data Entities
### 3.4.2 Data Relationships

# 4. Appendices
## 4.1 Traceability Matrix
| BRD Req ID | SRS Req ID | Relationship |
|------------|------------|--------------|
| BRD-001 | SRS-FR-001, SRS-FR-002 | Derived from |`;

const IIBA_SRS_STRUCTURE = `IIBA SOLUTION REQUIREMENTS STRUCTURE:

# 1. Solution Overview
## 1.1 Solution Context
## 1.2 Solution Boundaries
## 1.3 Dependencies

# 2. Functional Requirements
## 2.1 Feature Set Overview
## 2.2 Detailed Functional Requirements

| Req ID | Feature | Requirement | Priority | Acceptance Criteria | Source BRD |
|--------|---------|-------------|----------|---------------------|------------|
| SR-F-001 | User Management | The system shall... | High | ... | BRD-001 |

# 3. Non-Functional Requirements
## 3.1 Performance Requirements
## 3.2 Security Requirements
## 3.3 Usability Requirements
## 3.4 Reliability Requirements
## 3.5 Compliance Requirements

# 4. Data Requirements
## 4.1 Data Entities
## 4.2 Data Attributes
## 4.3 Data Relationships
## 4.4 Data Quality Rules

# 5. Interface Requirements
## 5.1 User Interface Requirements
## 5.2 System Interfaces
## 5.3 API Requirements

# 6. Business Rules
## 6.1 Business Rule Catalog
| Rule ID | Rule Description | Impact |
|---------|------------------|--------|
| BR-001 | ... | ... |

# 7. Transition Requirements
## 7.1 Data Migration
## 7.2 System Conversion
## 7.3 Training Requirements

# 8. Requirements Traceability
| Solution Req | Business Req | Stakeholder Need |
|--------------|--------------|------------------|
| SR-F-001 | BRD-001 | Stakeholder-01 |`;
