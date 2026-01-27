// SRS Form Types and Utilities

// ==================== Interfaces ====================

export interface DocumentInfo {
    projectName: string;
    projectCode?: string;
    version: string;
    preparedBy: string;
    date: string;
    sourceBrdId?: string;
    sourceBrdTitle?: string;
}

export interface SystemOverview {
    purpose: string;
    scope: string;
    definitions?: { term: string; definition: string }[];
    references?: string[];
    systemContext?: string;
}

export interface Actor {
    id: string;
    name: string;
    type: 'Primary' | 'Secondary' | 'External System';
    description: string;
}

export interface FlowStep {
    stepNumber: number;
    actor: string;
    action: string;
    systemResponse?: string;
}

export interface AlternativePath {
    id: string;
    name: string;
    branchFromStep: number;
    condition: string;
    steps: FlowStep[];
    rejoinsAtStep?: number;
}

export interface ExceptionPath {
    id: string;
    condition: string;
    handling: string;
    outcome: string;
}

export interface UseCase {
    id: string;                         // UC-001
    name: string;                       // "User Login"
    actors: string[];                   // ["End User", "System Admin"]
    summary: string;                    // "Allows user to authenticate..."
    priority: 'High' | 'Medium' | 'Low';
    status: 'Draft' | 'Review' | 'Approved';
    preconditions: string[];            // ["User has valid account"]
    postconditions: string[];           // ["User is logged in"]
    basicPath: FlowStep[];              // Main scenario steps
    alternativePaths: AlternativePath[];
    exceptionPaths: ExceptionPath[];
    businessRules: string[];            // ["BR-001", "BR-005"]
    nfrReferences: string[];            // ["NFR-001"]
    uiReference?: string;               // "Figma link or mockup ID"
    brdReference?: string;              // "BRD-001"
}

export interface NonFunctionalRequirement {
    id: string;                         // NFR-001
    category: 'Performance' | 'Security' | 'Usability' | 'Reliability' | 'Scalability' | 'Maintainability' | 'Compatibility';
    description: string;
    metric?: string;
    target?: string;
    priority: 'High' | 'Medium' | 'Low';
}

export interface BusinessRule {
    id: string;                         // BR-001
    name: string;
    description: string;
    type: 'Validation' | 'Calculation' | 'Authorization' | 'Workflow' | 'Constraint';
    source?: string;
}

export interface DataRequirement {
    id: string;
    entityName: string;
    description: string;
    attributes: { name: string; type: string; constraints?: string }[];
}

export interface TraceabilityItem {
    srsReqId: string;
    brdReqId: string;
    relationship: 'Derived from' | 'Implements' | 'Supports';
}

export interface SRSFormData {
    documentInfo: DocumentInfo;
    systemOverview: SystemOverview;
    actors: Actor[];
    useCases: UseCase[];
    nonFunctionalRequirements: NonFunctionalRequirement[];
    businessRules: BusinessRule[];
    dataRequirements: DataRequirement[];
    traceability: TraceabilityItem[];
}

export interface SRSValidationErrors {
    [key: string]: string;
}

// ==================== Initial Data ====================

export const getInitialSRSFormData = (): SRSFormData => ({
    documentInfo: {
        projectName: '',
        projectCode: '',
        version: '1.0',
        preparedBy: '',
        date: new Date().toISOString().split('T')[0],
    },
    systemOverview: {
        purpose: '',
        scope: '',
        definitions: [],
        references: [],
        systemContext: '',
    },
    actors: [],
    useCases: [],
    nonFunctionalRequirements: [],
    businessRules: [],
    dataRequirements: [],
    traceability: [],
});

export const createEmptyActor = (): Actor => ({
    id: `ACT-${Date.now()}`,
    name: '',
    type: 'Primary',
    description: '',
});

export const createEmptyUseCase = (): UseCase => ({
    id: `UC-${String(Date.now()).slice(-4)}`,
    name: '',
    actors: [],
    summary: '',
    priority: 'Medium',
    status: 'Draft',
    preconditions: [],
    postconditions: [],
    basicPath: [],
    alternativePaths: [],
    exceptionPaths: [],
    businessRules: [],
    nfrReferences: [],
});

export const createEmptyFlowStep = (stepNumber: number): FlowStep => ({
    stepNumber,
    actor: '',
    action: '',
    systemResponse: '',
});

export const createEmptyAlternativePath = (): AlternativePath => ({
    id: `ALT-${Date.now()}`,
    name: '',
    branchFromStep: 1,
    condition: '',
    steps: [],
});

export const createEmptyExceptionPath = (): ExceptionPath => ({
    id: `EXC-${Date.now()}`,
    condition: '',
    handling: '',
    outcome: '',
});

export const createEmptyNFR = (): NonFunctionalRequirement => ({
    id: `NFR-${String(Date.now()).slice(-4)}`,
    category: 'Performance',
    description: '',
    priority: 'Medium',
});

export const createEmptyBusinessRule = (): BusinessRule => ({
    id: `BR-${String(Date.now()).slice(-4)}`,
    name: '',
    description: '',
    type: 'Validation',
});

// ==================== Validation ====================

export function validateSRSForm(data: SRSFormData): SRSValidationErrors {
    const errors: SRSValidationErrors = {};

    // Document Info validation
    if (!data.documentInfo.projectName.trim()) {
        errors['documentInfo.projectName'] = 'Project name is required';
    }
    if (!data.documentInfo.preparedBy.trim()) {
        errors['documentInfo.preparedBy'] = 'Prepared by is required';
    }

    // System Overview validation
    if (!data.systemOverview.purpose.trim()) {
        errors['systemOverview.purpose'] = 'Purpose is required';
    }
    if (!data.systemOverview.scope.trim()) {
        errors['systemOverview.scope'] = 'Scope is required';
    }

    // Actors validation
    if (data.actors.length === 0) {
        errors['actors'] = 'At least one actor is required';
    }

    // Use Cases validation
    if (data.useCases.length === 0) {
        errors['useCases'] = 'At least one use case is required';
    } else {
        data.useCases.forEach((uc, index) => {
            if (!uc.name.trim()) {
                errors[`useCases.${index}.name`] = 'Use case name is required';
            }
            if (uc.actors.length === 0) {
                errors[`useCases.${index}.actors`] = 'At least one actor is required';
            }
            if (!uc.summary.trim()) {
                errors[`useCases.${index}.summary`] = 'Summary is required';
            }
            if (uc.basicPath.length === 0) {
                errors[`useCases.${index}.basicPath`] = 'At least one step in basic path is required';
            }
        });
    }

    return errors;
}

// ==================== Formatting ====================

export function formatSRSDataForPrompt(data: SRSFormData): string {
    const sections: string[] = [];

    // Document Info
    sections.push(`# Project Information
- Project Name: ${data.documentInfo.projectName}
- Project Code: ${data.documentInfo.projectCode || 'N/A'}
- Version: ${data.documentInfo.version}
- Prepared By: ${data.documentInfo.preparedBy}
- Date: ${data.documentInfo.date}
${data.documentInfo.sourceBrdId ? `- Source BRD: ${data.documentInfo.sourceBrdTitle || data.documentInfo.sourceBrdId}` : ''}`);

    // System Overview
    sections.push(`## System Overview
### Purpose
${data.systemOverview.purpose}

### Scope
${data.systemOverview.scope}

${data.systemOverview.systemContext ? `### System Context\n${data.systemOverview.systemContext}` : ''}`);

    // Actors
    if (data.actors.length > 0) {
        sections.push(`## Actors
${data.actors.map(a => `- **${a.name}** (${a.type}): ${a.description}`).join('\n')}`);
    }

    // Use Cases
    if (data.useCases.length > 0) {
        const ucSections = data.useCases.map(uc => {
            const basicPathSteps = uc.basicPath.map(step =>
                `  ${step.stepNumber}. [${step.actor}] ${step.action}${step.systemResponse ? ` → ${step.systemResponse}` : ''}`
            ).join('\n');

            return `### ${uc.id}: ${uc.name}
- **Actors**: ${uc.actors.join(', ')}
- **Priority**: ${uc.priority}
- **Status**: ${uc.status}
- **Summary**: ${uc.summary}

**Pre-conditions**:
${uc.preconditions.map(p => `- ${p}`).join('\n') || '- None specified'}

**Post-conditions**:
${uc.postconditions.map(p => `- ${p}`).join('\n') || '- None specified'}

**Basic Path**:
${basicPathSteps || '- No steps defined'}

${uc.alternativePaths.length > 0 ? `**Alternative Paths**:\n${uc.alternativePaths.map(ap =>
                `- ${ap.id}: ${ap.name} (from step ${ap.branchFromStep}): ${ap.condition}`
            ).join('\n')}` : ''}

${uc.exceptionPaths.length > 0 ? `**Exception Paths**:\n${uc.exceptionPaths.map(ep =>
                `- ${ep.id}: ${ep.condition} → ${ep.handling}`
            ).join('\n')}` : ''}

${uc.businessRules.length > 0 ? `**Business Rules**: ${uc.businessRules.join(', ')}` : ''}
${uc.nfrReferences.length > 0 ? `**NFR References**: ${uc.nfrReferences.join(', ')}` : ''}`;
        });

        sections.push(`## Use Cases\n${ucSections.join('\n\n---\n\n')}`);
    }

    // Non-Functional Requirements
    if (data.nonFunctionalRequirements.length > 0) {
        sections.push(`## Non-Functional Requirements
| ID | Category | Description | Metric | Target | Priority |
|----|----------|-------------|--------|--------|----------|
${data.nonFunctionalRequirements.map(nfr =>
            `| ${nfr.id} | ${nfr.category} | ${nfr.description} | ${nfr.metric || '-'} | ${nfr.target || '-'} | ${nfr.priority} |`
        ).join('\n')}`);
    }

    // Business Rules
    if (data.businessRules.length > 0) {
        sections.push(`## Business Rules
| ID | Name | Type | Description |
|----|------|------|-------------|
${data.businessRules.map(br =>
            `| ${br.id} | ${br.name} | ${br.type} | ${br.description} |`
        ).join('\n')}`);
    }

    return sections.join('\n\n');
}

// ==================== Form Completion ====================

export function calculateSRSFormCompletion(data: SRSFormData): number {
    let filled = 0;
    let total = 0;

    // Document Info (20%)
    total += 4;
    if (data.documentInfo.projectName.trim()) filled++;
    if (data.documentInfo.preparedBy.trim()) filled++;
    if (data.documentInfo.version.trim()) filled++;
    if (data.documentInfo.date.trim()) filled++;

    // System Overview (20%)
    total += 2;
    if (data.systemOverview.purpose.trim()) filled++;
    if (data.systemOverview.scope.trim()) filled++;

    // Actors (15%)
    total += 1;
    if (data.actors.length > 0) filled++;

    // Use Cases (35%)
    total += 3;
    if (data.useCases.length > 0) {
        filled++;
        const firstUC = data.useCases[0];
        if (firstUC.name.trim()) filled++;
        if (firstUC.basicPath.length > 0) filled++;
    }

    // NFR (5%)
    total += 1;
    if (data.nonFunctionalRequirements.length > 0) filled++;

    // Business Rules (5%)
    total += 1;
    if (data.businessRules.length > 0) filled++;

    return Math.round((filled / total) * 100);
}

// ==================== Use Case ID Generator ====================

export function generateUseCaseId(existingUseCases: UseCase[]): string {
    const maxId = existingUseCases.reduce((max, uc) => {
        const match = uc.id.match(/UC-(\d+)/);
        if (match) {
            return Math.max(max, parseInt(match[1], 10));
        }
        return max;
    }, 0);
    return `UC-${String(maxId + 1).padStart(3, '0')}`;
}

export function generateNFRId(existingNFRs: NonFunctionalRequirement[]): string {
    const maxId = existingNFRs.reduce((max, nfr) => {
        const match = nfr.id.match(/NFR-(\d+)/);
        if (match) {
            return Math.max(max, parseInt(match[1], 10));
        }
        return max;
    }, 0);
    return `NFR-${String(maxId + 1).padStart(3, '0')}`;
}

export function generateBRId(existingBRs: BusinessRule[]): string {
    const maxId = existingBRs.reduce((max, br) => {
        const match = br.id.match(/BR-(\d+)/);
        if (match) {
            return Math.max(max, parseInt(match[1], 10));
        }
        return max;
    }, 0);
    return `BR-${String(maxId + 1).padStart(3, '0')}`;
}
