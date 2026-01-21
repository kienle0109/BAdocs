// BRD Form Types and Utilities

export interface ProjectInfo {
    projectName: string;
    projectCode?: string;
    version: string;
    preparedBy: string;
    department?: string;
    date: string;
}

export interface BusinessContext {
    problem: string;
    background?: string;
    strategicAlignment?: string;
    alignmentOther?: string;
}

export interface SuccessMetric {
    id: string;
    name: string;
    baseline: string;
    target: string;
    method: string;
}

export interface BusinessGoals {
    primary: string[];
    metrics: SuccessMetric[];
    timeline?: string;
}

export interface Stakeholder {
    id: string;
    name: string;
    department: string;
    interest: 'High' | 'Medium' | 'Low';
    influence: 'High' | 'Medium' | 'Low';
    role: 'Sponsor' | 'Approver' | 'Contributor' | 'Informed';
}

export interface Scope {
    inScope: string[];
    outScope: string[];
    features: string[];
    systems: string[];
}

export interface Constraints {
    budget: string;
    timeline: string;
    technical?: string;
    resources?: string;
    assumptions?: string[];
    dependencies?: string[];
}

export interface Compliance {
    requirements: string[];
    dataPrivacy?: string;
}

export interface Risk {
    id: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    probability: 'High' | 'Medium' | 'Low';
    mitigation: string;
}

export interface BRDFormData {
    projectInfo: ProjectInfo;
    businessContext: BusinessContext;
    goals: BusinessGoals;
    stakeholders: Stakeholder[];
    scope: Scope;
    constraints: Constraints;
    compliance: Compliance;
    risks: Risk[];
}

export interface ValidationErrors {
    [key: string]: string;
}

// Initialize empty form data
export const getInitialFormData = (): BRDFormData => ({
    projectInfo: {
        projectName: '',
        projectCode: '',
        version: '1.0',
        preparedBy: '',
        department: '',
        date: new Date().toISOString().split('T')[0],
    },
    businessContext: {
        problem: '',
        background: '',
        strategicAlignment: '',
        alignmentOther: '',
    },
    goals: {
        primary: [''],
        metrics: [],
        timeline: '',
    },
    stakeholders: [],
    scope: {
        inScope: [''],
        outScope: [''],
        features: [''],
        systems: [],
    },
    constraints: {
        budget: '',
        timeline: '',
        technical: '',
        resources: '',
        assumptions: [],
        dependencies: [],
    },
    compliance: {
        requirements: [],
        dataPrivacy: '',
    },
    risks: [],
});

// Validation rules
export const validateBRDForm = (data: BRDFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Project Info validation
    if (!data.projectInfo.projectName?.trim()) {
        errors.projectName = 'Project name is required';
    } else if (data.projectInfo.projectName.length < 3) {
        errors.projectName = 'Project name must be at least 3 characters';
    }

    if (!data.projectInfo.preparedBy?.trim()) {
        errors.preparedBy = 'Prepared by is required';
    }

    // Business Context validation
    if (!data.businessContext.problem?.trim()) {
        errors.problem = 'Business problem/opportunity is required';
    } else if (data.businessContext.problem.length < 50) {
        errors.problem = 'Please provide at least 50 characters describing the problem';
    }

    // Goals validation
    const validGoals = data.goals.primary.filter(g => g.trim());
    if (validGoals.length === 0) {
        errors.goals = 'At least one business goal is required';
    }

    if (data.goals.metrics.length === 0) {
        errors.metrics = 'At least one success metric is required';
    }

    // Stakeholders validation
    if (data.stakeholders.length < 2) {
        errors.stakeholders = 'At least 2 stakeholders are required';
    }

    // Scope validation
    const validInScope = data.scope.inScope.filter(s => s.trim());
    if (validInScope.length < 2) {
        errors.inScope = 'At least 2 in-scope items are required';
    }

    const validOutScope = data.scope.outScope.filter(s => s.trim());
    if (validOutScope.length === 0) {
        errors.outScope = 'At least 1 out-of-scope item is required';
    }

    const validFeatures = data.scope.features.filter(f => f.trim());
    if (validFeatures.length < 2) {
        errors.features = 'At least 2 key features are required';
    }

    // Constraints validation
    if (!data.constraints.budget?.trim()) {
        errors.budget = 'Budget constraints are required';
    }

    if (!data.constraints.timeline?.trim()) {
        errors.timeline = 'Timeline constraints are required';
    }

    return errors;
};

// Format structured data into narrative text for AI
export const formatStructuredData = (data: BRDFormData): string => {
    let output = '';

    // Project Information
    output += `# Project Information\n`;
    output += `Project Name: ${data.projectInfo.projectName}\n`;
    if (data.projectInfo.projectCode) {
        output += `Project Code: ${data.projectInfo.projectCode}\n`;
    }
    output += `Version: ${data.projectInfo.version}\n`;
    output += `Prepared By: ${data.projectInfo.preparedBy}\n`;
    if (data.projectInfo.department) {
        output += `Department: ${data.projectInfo.department}\n`;
    }
    output += `Date: ${data.projectInfo.date}\n\n`;

    // Business Context
    output += `# Business Context\n`;
    output += `## Problem/Opportunity\n${data.businessContext.problem}\n\n`;
    if (data.businessContext.background) {
        output += `## Background\n${data.businessContext.background}\n\n`;
    }
    if (data.businessContext.strategicAlignment) {
        output += `## Strategic Alignment\n${data.businessContext.strategicAlignment}`;
        if (data.businessContext.alignmentOther) {
            output += ` - ${data.businessContext.alignmentOther}`;
        }
        output += `\n\n`;
    }

    // Business Goals
    output += `# Business Goals and Objectives\n`;
    output += `## Primary Goals\n`;
    data.goals.primary.filter(g => g.trim()).forEach(goal => {
        output += `- ${goal}\n`;
    });
    output += `\n`;

    if (data.goals.metrics.length > 0) {
        output += `## Success Metrics (KPIs)\n`;
        data.goals.metrics.forEach(metric => {
            output += `- ${metric.name}: ${metric.baseline} → ${metric.target} (measured by ${metric.method})\n`;
        });
        output += `\n`;
    }

    if (data.goals.timeline) {
        output += `## Target Timeline\n${data.goals.timeline}\n\n`;
    }

    // Stakeholders
    if (data.stakeholders.length > 0) {
        output += `# Stakeholders\n`;
        data.stakeholders.forEach(sh => {
            output += `- ${sh.name} (${sh.department}) - ${sh.role}, Interest: ${sh.interest}, Influence: ${sh.influence}\n`;
        });
        output += `\n`;
    }

    // Scope
    output += `# Scope Definition\n`;
    output += `## In Scope\n`;
    data.scope.inScope.filter(s => s.trim()).forEach(item => {
        output += `- ${item}\n`;
    });
    output += `\n`;

    output += `## Out of Scope\n`;
    data.scope.outScope.filter(s => s.trim()).forEach(item => {
        output += `- ${item}\n`;
    });
    output += `\n`;

    output += `## Key Features/Capabilities\n`;
    data.scope.features.filter(f => f.trim()).forEach(feature => {
        output += `- ${feature}\n`;
    });
    output += `\n`;

    if (data.scope.systems.length > 0) {
        output += `## Affected Systems\n`;
        data.scope.systems.forEach(system => {
            output += `- ${system}\n`;
        });
        output += `\n`;
    }

    // Constraints
    output += `# Constraints and Assumptions\n`;
    output += `## Budget: ${data.constraints.budget}\n`;
    output += `## Timeline: ${data.constraints.timeline}\n`;
    if (data.constraints.technical) {
        output += `## Technical Constraints\n${data.constraints.technical}\n`;
    }
    if (data.constraints.resources) {
        output += `## Resource Constraints\n${data.constraints.resources}\n`;
    }
    if (data.constraints.assumptions && data.constraints.assumptions.length > 0) {
        output += `## Key Assumptions\n`;
        data.constraints.assumptions.forEach(a => {
            output += `- ${a}\n`;
        });
    }
    if (data.constraints.dependencies && data.constraints.dependencies.length > 0) {
        output += `## Dependencies\n`;
        data.constraints.dependencies.forEach(d => {
            output += `- ${d}\n`;
        });
    }
    output += `\n`;

    // Compliance
    if (data.compliance.requirements.length > 0 || data.compliance.dataPrivacy) {
        output += `# Regulatory and Compliance\n`;
        if (data.compliance.requirements.length > 0) {
            output += `## Compliance Requirements\n`;
            data.compliance.requirements.forEach(req => {
                output += `- ${req}\n`;
            });
        }
        if (data.compliance.dataPrivacy) {
            output += `## Data Privacy\n${data.compliance.dataPrivacy}\n`;
        }
        output += `\n`;
    }

    // Risks
    if (data.risks.length > 0) {
        output += `# Identified Risks\n`;
        data.risks.forEach(risk => {
            output += `- ${risk.description} (Impact: ${risk.impact}, Probability: ${risk.probability})\n`;
            output += `  Mitigation: ${risk.mitigation}\n`;
        });
        output += `\n`;
    }

    return output;
};

// Calculate completion percentage
export const getCompletionPercentage = (data: BRDFormData): number => {
    let completed = 0;
    let total = 11; // 11 required fields

    if (data.projectInfo.projectName?.trim()) completed++;
    if (data.projectInfo.preparedBy?.trim()) completed++;
    if (data.businessContext.problem?.length >= 50) completed++;
    if (data.goals.primary.filter(g => g.trim()).length > 0) completed++;
    if (data.goals.metrics.length > 0) completed++;
    if (data.stakeholders.length >= 2) completed++;
    if (data.scope.inScope.filter(s => s.trim()).length >= 2) completed++;
    if (data.scope.outScope.filter(s => s.trim()).length >= 1) completed++;
    if (data.scope.features.filter(f => f.trim()).length >= 2) completed++;
    if (data.constraints.budget?.trim()) completed++;
    if (data.constraints.timeline?.trim()) completed++;

    return Math.round((completed / total) * 100);
};

// Generate unique ID
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
