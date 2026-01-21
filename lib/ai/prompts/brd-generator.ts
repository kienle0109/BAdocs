export function buildPrompt(input: string, template: 'IEEE' | 'IIBA'): string {
    const basePrompt = `You are a senior Business Analyst expert specializing in ${template} standards.

USER INPUT:
${input}

TASK:
Generate a professional Business Requirements Document (BRD) following the ${template} standard.

${template === 'IEEE' ? IEEE_BRD_STRUCTURE : IIBA_BRD_STRUCTURE}

FORMATTING REQUIREMENTS:
1. Output in clean Markdown format
2. Use proper heading hierarchy (# ## ###)
3. Include numbered sections where appropriate
4. Use bullet points for lists
5. Use tables for stakeholder matrices and requirements lists
6. Be specific and measurable - avoid vague language
7. Follow professional BA terminology

QUALITY STANDARDS:
- Requirements must be SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- Use active voice
- Define all acronyms on first use
- Include assumptions when data is unclear
- Mark uncertain items as "[TBD]" for later refinement

Generate the complete BRD document now:`;

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
