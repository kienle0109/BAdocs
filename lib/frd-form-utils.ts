// FRD (Functional Requirements Document) Form Data Types and Utilities
// Standards: IEEE 29148 / IIBA BABOK v3

export interface FRDFormData {
    overview: OverviewData;
    functionalRequirements: FunctionalRequirement[];
    systemFeatures: SystemFeature[];
    userInterface: UIScreen[];
    dataRequirements: DataEntity[];
    integrationPoints: Integration[];
    constraints: ConstraintsData;
}

export interface OverviewData {
    projectName: string;
    projectCode: string;
    version: string;
    date: string;
    preparedBy: string;
    purpose: string;
    scope: string;
    stakeholders: string[];
}

export interface FunctionalRequirement {
    id: string; // FR-001
    name: string;
    category: 'Core' | 'Secondary' | 'Nice-to-Have';
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    source: string; // UC-001 (from SRS), BR-001 (from BRD)
    acceptanceCriteria: string[];
}

export interface SystemFeature {
    id: string; // FT-001
    name: string;
    description: string;
    userStories: string[];
    acceptanceCriteria: string[];
    relatedFR: string[]; // FR-001, FR-002
}

export interface UIScreen {
    id: string; // UI-001
    name: string;
    layout: string;
    flowDescription: string;
    wireframeUrl?: string;
}

export interface DataEntity {
    name: string;
    attributes: DataAttribute[];
    relationships: string[];
    validationRules: string[];
}

export interface DataAttribute {
    name: string;
    type: string;
    required: boolean;
    description?: string;
}

export interface Integration {
    systemName: string;
    apiEndpoint: string;
    protocol: 'REST' | 'GraphQL' | 'SOAP' | 'gRPC' | 'WebSocket';
    dataFormat: 'JSON' | 'XML' | 'Protobuf' | 'CSV';
    authentication: string;
    description: string;
}

export interface ConstraintsData {
    technical: string[];
    businessRules: string[];
    assumptions: string[];
    dependencies: string[];
}

// Validation Errors Type
export interface ValidationErrors {
    [key: string]: string;
}

// Get initial empty form data
export function getInitialFormData(): FRDFormData {
    return {
        overview: {
            projectName: '',
            projectCode: '',
            version: '1.0',
            date: new Date().toISOString().split('T')[0],
            preparedBy: '',
            purpose: '',
            scope: '',
            stakeholders: [],
        },
        functionalRequirements: [],
        systemFeatures: [],
        userInterface: [],
        dataRequirements: [],
        integrationPoints: [],
        constraints: {
            technical: [],
            businessRules: [],
            assumptions: [],
            dependencies: [],
        },
    };
}

// Validate FRD Form
export function validateFRDForm(data: FRDFormData): ValidationErrors {
    const errors: ValidationErrors = {};

    // Overview validation
    if (!data.overview.projectName?.trim()) {
        errors['overview.projectName'] = 'Project name is required';
    }
    if (!data.overview.projectCode?.trim()) {
        errors['overview.projectCode'] = 'Project code is required';
    }
    if (!data.overview.preparedBy?.trim()) {
        errors['overview.preparedBy'] = 'Prepared by is required';
    }
    if (!data.overview.purpose?.trim()) {
        errors['overview.purpose'] = 'Purpose is required';
    }

    // Functional Requirements validation
    if (data.functionalRequirements.length === 0) {
        errors['functionalRequirements'] = 'At least one functional requirement is required';
    } else {
        data.functionalRequirements.forEach((fr, index) => {
            if (!fr.name?.trim()) {
                errors[`functionalRequirements[${index}].name`] = 'Requirement name is required';
            }
            if (!fr.description?.trim()) {
                errors[`functionalRequirements[${index}].description`] = 'Description is required';
            }
        });
    }

    // System Features validation
    if (data.systemFeatures.length === 0) {
        errors['systemFeatures'] = 'At least one system feature is required';
    }

    return errors;
}

// Format structured data for AI prompt
export function formatStructuredData(data: FRDFormData): string {
    let formatted = '';

    // Overview
    formatted += `# Project Overview\n\n`;
    formatted += `**Project Name**: ${data.overview.projectName}\n`;
    formatted += `**Project Code**: ${data.overview.projectCode}\n`;
    formatted += `**Version**: ${data.overview.version}\n`;
    formatted += `**Date**: ${data.overview.date}\n`;
    formatted += `**Prepared By**: ${data.overview.preparedBy}\n\n`;
    formatted += `**Purpose**: ${data.overview.purpose}\n\n`;
    formatted += `**Scope**: ${data.overview.scope}\n\n`;

    if (data.overview.stakeholders.length > 0) {
        formatted += `**Stakeholders**:\n`;
        data.overview.stakeholders.forEach(s => {
            formatted += `- ${s}\n`;
        });
        formatted += '\n';
    }

    // Functional Requirements
    if (data.functionalRequirements.length > 0) {
        formatted += `# Functional Requirements\n\n`;
        data.functionalRequirements.forEach(fr => {
            formatted += `## ${fr.id}: ${fr.name}\n\n`;
            formatted += `- **Category**: ${fr.category}\n`;
            formatted += `- **Priority**: ${fr.priority}\n`;
            formatted += `- **Source**: ${fr.source}\n`;
            formatted += `- **Description**: ${fr.description}\n\n`;

            if (fr.acceptanceCriteria.length > 0) {
                formatted += `**Acceptance Criteria**:\n`;
                fr.acceptanceCriteria.forEach(ac => {
                    formatted += `- ${ac}\n`;
                });
                formatted += '\n';
            }
        });
    }

    // System Features
    if (data.systemFeatures.length > 0) {
        formatted += `# System Features\n\n`;
        data.systemFeatures.forEach(feature => {
            formatted += `## ${feature.id}: ${feature.name}\n\n`;
            formatted += `${feature.description}\n\n`;

            if (feature.userStories.length > 0) {
                formatted += `**User Stories**:\n`;
                feature.userStories.forEach(us => {
                    formatted += `- ${us}\n`;
                });
                formatted += '\n';
            }

            if (feature.acceptanceCriteria.length > 0) {
                formatted += `**Acceptance Criteria**:\n`;
                feature.acceptanceCriteria.forEach(ac => {
                    formatted += `- ${ac}\n`;
                });
                formatted += '\n';
            }

            if (feature.relatedFR.length > 0) {
                formatted += `**Related Requirements**: ${feature.relatedFR.join(', ')}\n\n`;
            }
        });
    }

    // User Interface
    if (data.userInterface.length > 0) {
        formatted += `# User Interface\n\n`;
        data.userInterface.forEach(screen => {
            formatted += `## ${screen.id}: ${screen.name}\n\n`;
            formatted += `**Layout**: ${screen.layout}\n\n`;
            formatted += `**Flow**: ${screen.flowDescription}\n\n`;
            if (screen.wireframeUrl) {
                formatted += `**Wireframe**: ${screen.wireframeUrl}\n\n`;
            }
        });
    }

    // Data Requirements
    if (data.dataRequirements.length > 0) {
        formatted += `# Data Requirements\n\n`;
        data.dataRequirements.forEach(entity => {
            formatted += `## Entity: ${entity.name}\n\n`;
            formatted += `**Attributes**:\n`;
            entity.attributes.forEach(attr => {
                formatted += `- ${attr.name} (${attr.type})${attr.required ? ' *required*' : ''}${attr.description ? ': ' + attr.description : ''}\n`;
            });
            formatted += '\n';

            if (entity.relationships.length > 0) {
                formatted += `**Relationships**:\n`;
                entity.relationships.forEach(rel => {
                    formatted += `- ${rel}\n`;
                });
                formatted += '\n';
            }

            if (entity.validationRules.length > 0) {
                formatted += `**Validation Rules**:\n`;
                entity.validationRules.forEach(rule => {
                    formatted += `- ${rule}\n`;
                });
                formatted += '\n';
            }
        });
    }

    // Integration Points
    if (data.integrationPoints.length > 0) {
        formatted += `# Integration Points\n\n`;
        data.integrationPoints.forEach(integration => {
            formatted += `## ${integration.systemName}\n\n`;
            formatted += `- **Endpoint**: ${integration.apiEndpoint}\n`;
            formatted += `- **Protocol**: ${integration.protocol}\n`;
            formatted += `- **Format**: ${integration.dataFormat}\n`;
            formatted += `- **Authentication**: ${integration.authentication}\n`;
            formatted += `- **Description**: ${integration.description}\n\n`;
        });
    }

    // Constraints
    formatted += `# Constraints and Assumptions\n\n`;

    if (data.constraints.technical.length > 0) {
        formatted += `**Technical Constraints**:\n`;
        data.constraints.technical.forEach(c => {
            formatted += `- ${c}\n`;
        });
        formatted += '\n';
    }

    if (data.constraints.businessRules.length > 0) {
        formatted += `**Business Rules**:\n`;
        data.constraints.businessRules.forEach(br => {
            formatted += `- ${br}\n`;
        });
        formatted += '\n';
    }

    if (data.constraints.assumptions.length > 0) {
        formatted += `**Assumptions**:\n`;
        data.constraints.assumptions.forEach(a => {
            formatted += `- ${a}\n`;
        });
        formatted += '\n';
    }

    if (data.constraints.dependencies.length > 0) {
        formatted += `**Dependencies**:\n`;
        data.constraints.dependencies.forEach(d => {
            formatted += `- ${d}\n`;
        });
        formatted += '\n';
    }

    return formatted;
}

// Generate next FR ID
export function getNextFRId(existingFRs: FunctionalRequirement[]): string {
    const maxId = existingFRs.reduce((max, fr) => {
        const num = parseInt(fr.id.replace('FR-', ''));
        return num > max ? num : max;
    }, 0);
    return `FR-${String(maxId + 1).padStart(3, '0')}`;
}

// Generate next Feature ID
export function getNextFeatureId(existingFeatures: SystemFeature[]): string {
    const maxId = existingFeatures.reduce((max, feature) => {
        const num = parseInt(feature.id.replace('FT-', ''));
        return num > max ? num : max;
    }, 0);
    return `FT-${String(maxId + 1).padStart(3, '0')}`;
}

// Generate next UI Screen ID
export function getNextUIId(existingScreens: UIScreen[]): string {
    const maxId = existingScreens.reduce((max, screen) => {
        const num = parseInt(screen.id.replace('UI-', ''));
        return num > max ? num : max;
    }, 0);
    return `UI-${String(maxId + 1).padStart(3, '0')}`;
}

// Common FR categories
export const FR_CATEGORIES = [
    'Core',
    'Secondary',
    'Nice-to-Have',
] as const;

// Common priorities
export const PRIORITIES = [
    'High',
    'Medium',
    'Low',
] as const;

// Common protocols
export const PROTOCOLS = [
    'REST',
    'GraphQL',
    'SOAP',
    'gRPC',
    'WebSocket',
] as const;

// Common data formats
export const DATA_FORMATS = [
    'JSON',
    'XML',
    'Protobuf',
    'CSV',
] as const;

// Template FR examples
export const TEMPLATE_FRS: Partial<FunctionalRequirement>[] = [
    {
        name: 'User Authentication',
        category: 'Core',
        description: 'System shall allow users to authenticate using email and password',
        priority: 'High',
        acceptanceCriteria: [
            'User can login with valid credentials',
            'Invalid credentials show error message',
            'Password is encrypted in database',
        ],
    },
    {
        name: 'Data Export',
        category: 'Secondary',
        description: 'System shall allow users to export data in multiple formats',
        priority: 'Medium',
        acceptanceCriteria: [
            'Export to CSV format supported',
            'Export to PDF format supported',
            'Export maintains data integrity',
        ],
    },
];

// Template Features
export const TEMPLATE_FEATURES: Partial<SystemFeature>[] = [
    {
        name: 'User Management',
        description: 'Complete user lifecycle management including registration, profile, and permissions',
        userStories: [
            'As a user, I want to register an account',
            'As a user, I want to update my profile',
            'As an admin, I want to manage user permissions',
        ],
        acceptanceCriteria: [
            'Users can self-register',
            'Profile updates are validated',
            'Admins can assign roles',
        ],
    },
];
