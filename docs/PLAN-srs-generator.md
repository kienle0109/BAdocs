# 📋 SRS Generator Feature Plan

> **Feature**: Generate SRS (Software Requirements Specification) with Use Case Focus
> **Standard**: IEEE 830 / IIBA BABOK v3
> **Created**: 2026-01-23

---

## 1. Executive Summary

### 1.1 Mục tiêu
Phát triển tính năng tạo tài liệu SRS chuyên nghiệp với:
- **Dual Input Mode**: Tạo từ BRD có sẵn HOẶC nhập mới từ đầu
- **Use Case Focus**: Đặc tả Use Case chi tiết theo chuẩn IEEE/IIBA
- **Professional UI**: Tuân thủ UI/UX Pro Max guidelines

### 1.2 Scope
| In Scope | Out of Scope |
|----------|--------------|
| SRS Form với Use Case editor | FRD generation (Phase 3) |
| BRD → SRS transformation | Real-time collaboration |
| IEEE/IIBA template support | Version comparison |
| Export PDF/DOCX | Comment system |

---

## 2. Phân tích yêu cầu nghiệp vụ

### 2.1 Use Case Specification Fields (IEEE + IIBA)

| Field | Description | Required |
|-------|-------------|----------|
| **Use Case ID** | Unique identifier (UC-001) | ✅ |
| **Use Case Name** | Tên mô tả ngắn gọn | ✅ |
| **Actor(s)** | Các tác nhân tham gia | ✅ |
| **Summary Description** | Mô tả tổng quan | ✅ |
| **Priority** | High / Medium / Low | ✅ |
| **Status** | Draft / Review / Approved | ✅ |
| **Pre-Condition(s)** | Điều kiện trước khi thực hiện | ✅ |
| **Post-Condition(s)** | Điều kiện sau khi hoàn thành | ✅ |
| **Basic Path** | Luồng chính (Main Flow) | ✅ |
| **Alternative Paths** | Các luồng thay thế | ⭕ |
| **Exception Paths** | Xử lý ngoại lệ | ⭕ |
| **Business Rules** | Quy tắc nghiệp vụ liên quan | ⭕ |
| **Non-Functional Requirements** | Yêu cầu phi chức năng | ⭕ |
| **UI Mockup Reference** | Link/Reference đến mockup | ⭕ |
| **Traceability** | Link to BRD requirements | ⭕ |

### 2.2 Mô hình dữ liệu SRS

```typescript
// lib/srs-form-utils.ts

interface SRSFormData {
  // Header Information
  documentInfo: DocumentInfo;
  
  // System Overview
  systemOverview: SystemOverview;
  
  // Actors
  actors: Actor[];
  
  // Use Cases (Main Focus)
  useCases: UseCase[];
  
  // Non-Functional Requirements
  nonFunctionalRequirements: NonFunctionalRequirement[];
  
  // Business Rules
  businessRules: BusinessRule[];
  
  // Data Requirements
  dataRequirements: DataRequirement[];
  
  // Traceability
  traceability: TraceabilityItem[];
}

interface UseCase {
  id: string;                    // UC-001
  name: string;                  // "User Login"
  actors: string[];              // ["End User", "System Admin"]
  summary: string;               // "Allows user to authenticate..."
  priority: 'High' | 'Medium' | 'Low';
  status: 'Draft' | 'Review' | 'Approved';
  preconditions: string[];       // ["User has valid account"]
  postconditions: string[];      // ["User is logged in"]
  basicPath: FlowStep[];         // Main scenario steps
  alternativePaths: AlternativePath[];
  exceptionPaths: ExceptionPath[];
  businessRules: string[];       // ["BR-001", "BR-005"]
  nfrReferences: string[];       // ["NFR-001"]
  uiReference?: string;          // "Figma link or mockup ID"
  brdReference?: string;         // "BRD-001"
}

interface FlowStep {
  stepNumber: number;
  actor: string;
  action: string;
  systemResponse?: string;
}

interface AlternativePath {
  id: string;
  name: string;
  branchFromStep: number;
  steps: FlowStep[];
  rejoinsAtStep?: number;
}

interface ExceptionPath {
  id: string;
  condition: string;
  handling: string;
  outcome: string;
}
```

---

## 3. Kiến trúc hệ thống

### 3.1 Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                    SRS Generator Feature                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐               │
│  │  Mode Selection  │    │   BRD Selection  │               │
│  │  ┌────────────┐  │    │  (from History)  │               │
│  │  │ From BRD   │──┼────┤                  │               │
│  │  └────────────┘  │    └────────┬─────────┘               │
│  │  ┌────────────┐  │             │                         │
│  │  │ New Input  │──┼─────────────┼──────────┐              │
│  │  └────────────┘  │             │          │              │
│  └──────────────────┘             │          │              │
│                                   ▼          ▼              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               SRS Form (Split Layout)                  │ │
│  │  ┌─────────────────────┬──────────────────────────────┐│ │
│  │  │     SIDEBAR         │      MAIN CONTENT            ││ │
│  │  │  ┌───────────────┐  │  ┌────────────────────────┐  ││ │
│  │  │  │ AI Provider   │  │  │  System Overview Tab   │  ││ │
│  │  │  │ Template      │  │  │  Actors Tab            │  ││ │
│  │  │  │ Language      │  │  │  Use Cases Tab  ⭐     │  ││ │
│  │  │  │ Progress      │  │  │  NFR Tab               │  ││ │
│  │  │  │               │  │  │  Business Rules Tab    │  ││ │
│  │  │  └───────────────┘  │  └────────────────────────┘  ││ │
│  │  └─────────────────────┴──────────────────────────────┘│ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    AI Generation                        │ │
│  │   Gemini / Ollama → SRS Document (Markdown)            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Cấu trúc thư mục

```
ba-doc-generator/
├── app/
│   ├── srs/                       [NEW]
│   │   ├── page.tsx              # Mode selection page
│   │   ├── new/
│   │   │   └── page.tsx          # SRS form (new input)
│   │   └── from-brd/
│   │       └── page.tsx          # BRD selection page
│   ├── api/
│   │   └── generate-srs/         [NEW]
│   │       └── route.ts          # SRS generation endpoint
│   └── ...
├── components/
│   ├── srs-form/                  [NEW]
│   │   ├── SRSModeSelector.tsx   # From BRD / New Input
│   │   ├── BRDSelector.tsx       # Select existing BRD
│   │   ├── SystemOverviewSection.tsx
│   │   ├── ActorsSection.tsx
│   │   ├── UseCasesSection.tsx   # ⭐ Main focus
│   │   ├── UseCaseEditor.tsx     # Individual UC editor
│   │   ├── FlowStepEditor.tsx    # Basic/Alt path editor
│   │   ├── NFRSection.tsx
│   │   ├── BusinessRulesSection.tsx
│   │   └── SRSValidationSummary.tsx
│   └── ...
├── lib/
│   ├── srs-form-utils.ts          [NEW]
│   └── ai/
│       └── prompts/
│           └── srs-generator.ts   [NEW]
└── ...
```

---

## 4. Chi tiết UI/UX

### 4.1 Mode Selection Page (`/srs`)

```
┌──────────────────────────────────────────────────────────────┐
│  [Header with Back Button]                                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│               Create Software Requirements Specification      │
│               Choose how you want to create your SRS         │
│                                                               │
│   ┌─────────────────────────┐  ┌─────────────────────────┐   │
│   │  📄 From Existing BRD    │  │  ✏️ New Input            │   │
│   │                          │  │                          │   │
│   │  Transform your BRD into │  │  Start fresh with a     │   │
│   │  a detailed SRS with     │  │  structured SRS form    │   │
│   │  Use Case specifications │  │  to capture requirements│   │
│   │                          │  │                          │   │
│   │  [Select BRD →]          │  │  [Start New →]          │   │
│   └─────────────────────────┘  └──────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 SRS Form Layout (Split Layout like BRD)

**Left Sidebar:**
- AI Provider (Gemini/Ollama)
- Document Standard (IEEE/IIBA)
- Document Language (EN/VI)
- Form Completion Progress
- Quick navigation to sections

**Right Main Content (Tabs):**
1. **System Overview** - Purpose, Scope, References
2. **Actors** - Define system actors
3. **Use Cases** ⭐ - Main focus with detailed editor
4. **Non-Functional** - Performance, Security, etc.
5. **Business Rules** - Business rule catalog
6. **Traceability** - Link to BRD requirements

### 4.3 Use Case Editor Component

```
┌────────────────────────────────────────────────────────────────┐
│  Use Case: UC-001                                    [Delete] │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────┐  ┌──────────────────────┐   │
│  │ Name *                        │  │ Priority   │ Status  │   │
│  │ [User Login                 ] │  │ [High ▼]   │[Draft ▼]│   │
│  └──────────────────────────────┘  └──────────────────────┘   │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Actors * (comma separated)                                │ │
│  │ [End User, System                                       ] │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Summary Description *                                     │ │
│  │ [Allows authenticated users to access the system by     ] │ │
│  │ [entering valid credentials...                          ] │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌───────────────────────────┐  ┌───────────────────────────┐ │
│  │ Pre-Conditions            │  │ Post-Conditions           │ │
│  │ • User has valid account  │  │ • User is authenticated   │ │
│  │ • System is available     │  │ • Session is created      │ │
│  │ [+ Add Pre-Condition]     │  │ [+ Add Post-Condition]    │ │
│  └───────────────────────────┘  └───────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Basic Path (Main Flow) *                                  │ │
│  │ ┌────┬──────────┬────────────────────┬─────────────────┐ │ │
│  │ │ #  │ Actor    │ Action             │ System Response │ │ │
│  │ ├────┼──────────┼────────────────────┼─────────────────┤ │ │
│  │ │ 1  │ User     │ Opens login page   │ Displays form   │ │ │
│  │ │ 2  │ User     │ Enters credentials │ Validates input │ │ │
│  │ │ 3  │ System   │ Verifies auth      │ Creates session │ │ │
│  │ └────┴──────────┴────────────────────┴─────────────────┘ │ │
│  │ [+ Add Step]                                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  [Alternative Paths ▼]  [Exception Paths ▼]  [NFR Links ▼]    │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Proposed Features (Đề xuất bổ sung)

### 5.1 AI-Powered Features
| Feature | Description | Priority |
|---------|-------------|----------|
| **Auto-generate Use Cases from BRD** | AI extracts use cases từ BRD | High |
| **Step Suggestion** | AI gợi ý bước tiếp theo trong flow | Medium |
| **Validation Assistant** | AI kiểm tra tính đầy đủ của UC | Medium |
| **Use Case Template Library** | Template UC phổ biến (Login, CRUD, Payment) | Low |

### 5.2 UX Enhancements
| Feature | Description | Priority |
|---------|-------------|----------|
| **Visual Flow Editor** | Drag-and-drop để tạo flow diagram | Medium |
| **Use Case Diagram Generation** | Tự động tạo UML diagram | Low |
| **Duplicate Use Case** | Clone UC để tạo tương tự | High |
| **Collapse/Expand All** | Thu gọn/mở rộng tất cả UC | High |
| **Search Use Cases** | Tìm kiếm trong danh sách UC | Medium |

### 5.3 Export Enhancements
| Feature | Description | Priority |
|---------|-------------|----------|
| **Export Individual UC** | Xuất từng UC riêng lẻ | Medium |
| **Use Case Matrix** | Bảng tổng hợp UC-Actor | High |
| **Requirement Traceability Matrix** | BRD → SRS mapping | High |

---

## 6. Implementation Plan

### Phase 1: Foundation (Day 1-2)

| Task | Files | Est. Time |
|------|-------|-----------|
| Create SRS data types | `lib/srs-form-utils.ts` | 2h |
| Create SRS prompt generator | `lib/ai/prompts/srs-generator.ts` | 3h |
| Create SRS API endpoint | `app/api/generate-srs/route.ts` | 2h |
| Update Prisma schema (if needed) | `prisma/schema.prisma` | 1h |

### Phase 2: UI Components (Day 3-5)

| Task | Files | Est. Time |
|------|-------|-----------|
| Mode Selection Page | `app/srs/page.tsx` | 3h |
| BRD Selector Component | `components/srs-form/BRDSelector.tsx` | 2h |
| SRS Form Main Page | `app/srs/new/page.tsx` | 4h |
| System Overview Section | `components/srs-form/SystemOverviewSection.tsx` | 2h |
| Actors Section | `components/srs-form/ActorsSection.tsx` | 2h |
| **Use Cases Section** ⭐ | `components/srs-form/UseCasesSection.tsx` | 6h |
| **Use Case Editor** ⭐ | `components/srs-form/UseCaseEditor.tsx` | 4h |
| Flow Step Editor | `components/srs-form/FlowStepEditor.tsx` | 3h |
| NFR Section | `components/srs-form/NFRSection.tsx` | 2h |
| Business Rules Section | `components/srs-form/BusinessRulesSection.tsx` | 2h |

### Phase 3: Integration (Day 6-7)

| Task | Files | Est. Time |
|------|-------|-----------|
| Connect form to API | - | 3h |
| Add AI generation logic | - | 4h |
| Add validation | - | 2h |
| Test all flows | - | 4h |

### Phase 4: Polish (Day 8)

| Task | Files | Est. Time |
|------|-------|-----------|
| Mobile responsiveness | Various | 2h |
| Loading states | Various | 1h |
| Error handling | Various | 2h |
| Home page update (remove "Coming Soon") | `app/page.tsx` | 0.5h |
| Update Header navigation | `components/Header.tsx` | 0.5h |

---

## 7. Technical Specifications

### 7.1 API Endpoint Design

```typescript
// POST /api/generate-srs
interface GenerateSRSRequest {
  inputMethod: 'quick' | 'guided' | 'from-brd';
  data: string | SRSFormData;  // Raw text or structured form
  sourceBrdId?: string;        // If generating from BRD
  template: 'IEEE' | 'IIBA';
  aiProvider: 'gemini' | 'ollama';
  language: 'en' | 'vi';
}

interface GenerateSRSResponse {
  success: boolean;
  document: {
    id: string;
    type: 'SRS';
    title: string;
    markdown: string;
    sourceId?: string;  // BRD reference
  };
  provider: string;
  model: string;
}
```

### 7.2 AI Prompt Structure

```typescript
// Key sections for SRS generation prompt:
const SRS_PROMPT_SECTIONS = {
  SYSTEM_OVERVIEW: '...',
  ACTOR_DEFINITIONS: '...',
  USE_CASES_WITH_TEMPLATE: `
    Generate detailed Use Cases with:
    - UC ID and Name
    - Actors involved
    - Summary Description
    - Priority and Status
    - Pre-conditions and Post-conditions
    - Basic Path with numbered steps (Actor, Action, System Response)
    - Alternative Paths
    - Exception Paths
    - Related Business Rules
    - Non-Functional Requirements
  `,
  NFR_SECTION: '...',
  BUSINESS_RULES: '...',
  TRACEABILITY_MATRIX: '...',
};
```

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Use Case fields coverage | 100% of required fields |
| Form completion time | < 15 minutes for 5 UCs |
| AI generation accuracy | > 85% relevant content |
| Mobile responsiveness | Works on 320px+ screens |
| Page load time | < 2 seconds |

---

## 9. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Use Case form too complex | High | Collapsible sections, progressive disclosure |
| AI not extracting UCs well | High | Detailed prompt engineering, manual editing |
| Performance with many UCs | Medium | Virtual scrolling, lazy rendering |

---

## 10. Next Steps

1. ✅ **Review this plan** with stakeholder
2. 🔲 Start Phase 1: Foundation
3. 🔲 Phase 2: UI Components
4. 🔲 Phase 3: Integration
5. 🔲 Phase 4: Polish & Testing

---

> **Note**: Plan file: `docs/PLAN-srs-generator.md`
> Run `/enhance implement SRS generator` to start implementation
