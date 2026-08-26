# OptiCode AI — Architecture and Product Decisions

This document records major product and technical decisions that are considered intentional for the MVP.

The purpose is to prevent important decisions from being changed casually during implementation.

---

## D-001 — MVP Scope: Code Snippets and Functions

### Decision

The MVP will analyze single code snippets, functions, and relatively self-contained pieces of code.

### Reason

Repository-level and multi-file analysis would significantly increase complexity because the system would need to understand:

- File relationships.
- Imports and dependencies.
- Project structure.
- Cross-file data flow.
- Multiple execution contexts.

Starting with self-contained code allows the project to focus on delivering meaningful analysis and optimization.

### Status

Accepted.

---

## D-002 — Supported Programming Languages

### Decision

The MVP will support:

- Python
- C++
- Java

### Reason

These languages provide strong variety and demonstrate that the platform is designed around a multi-language architecture rather than a single-language prototype.

### Implementation Principle

The languages will share a common analysis pipeline while using language-specific analyzers.

### Status

Accepted.

---

## D-003 — No Database in the MVP

### Decision

The initial MVP will not use a database.

### Reason

The MVP does not require:

- User accounts.
- Authentication.
- Saved analysis history.
- Persistent results.

Removing the database reduces development time and operational complexity.

### Future Reconsideration

A database may be introduced when persistent user features are added.

### Status

Accepted.

---

## D-004 — Frontend Technology

### Decision

The frontend will use:

- React
- TypeScript
- Vite
- Tailwind CSS

### Reason

This combination provides:

- Fast development.
- A modern user interface.
- Strong TypeScript support.
- A simple project structure.
- Good compatibility with component-based development.

### Status

Accepted.

---

## D-005 — Code Editor

### Decision

The application will use Monaco Editor for source code input.

### Reason

Monaco Editor provides:

- Professional code-editing experience.
- Syntax highlighting.
- Support for multiple programming languages.
- A familiar VS Code-like interface.

### Status

Accepted.

---

## D-006 — Backend Technology

### Decision

The backend will use:

- Python
- FastAPI

### Reason

FastAPI provides:

- Fast development.
- Clear request validation.
- Strong support for structured APIs.
- A suitable ecosystem for AI and analysis tooling.

Using Python for the backend does not prevent analysis of C++ and Java because source code is processed as text and passed through language-specific analyzers.

### Status

Accepted.

---

## D-007 — Deterministic Analysis Before AI Reasoning

### Decision

The system will use deterministic analysis for patterns that can be reliably detected.

AI will then interpret those findings and perform higher-level reasoning.

### Reason

This provides:

- More reliable findings.
- Better transparency.
- Less dependence on AI guessing.
- Easier debugging.
- Clear separation between detected facts and AI inference.

### Status

Accepted.

---

## D-008 — Limited Deterministic Analysis

### Decision

The MVP will not attempt to build a complete static analyzer for Python, C++, and Java.

Instead, deterministic analysis will focus on selected high-value patterns.

### Examples

- Nested loops.
- Repeated operations inside loops.
- Repeated sorting.
- Repeated searching.
- Redundant calculations.
- Selected structural issues.

### Reason

A complete static-analysis engine for three languages would be outside the realistic scope of the MVP.

### Status

Accepted.

---

## D-009 — Structured AI Output

### Decision

The AI reasoning layer should return structured data rather than only free-form text.

### Reason

Structured output makes it easier to:

- Validate results.
- Display information in the frontend.
- Separate different result categories.
- Handle errors.
- Keep the API predictable.

### Status

Accepted.

---

## D-010 — AI Provider Abstraction

### Decision

The application will isolate AI-provider-specific code behind a small service layer.

### Reason

This allows the AI provider to be changed later without rewriting the entire backend.

### Important Limitation

The project will not build a complex multi-provider framework.

Only the required abstraction will be created.

### Status

Accepted.

---

## D-011 — No Forced Optimization

### Decision

The system is allowed to conclude that no significant optimization opportunity was identified.

### Reason

Generating a different implementation simply to appear useful would reduce trust.

The optimized code should only be produced when an improvement is justified.

### Status

Accepted.

---

## D-012 — No Unsupported Performance Claims

### Decision

The system will not claim specific runtime improvements without actual measurement.

### Allowed

- Estimated complexity improvement.
- Expected reduction in repeated work.
- Expected improvement in scalability.

### Not Allowed Without Measurement

- "50% faster."
- "Twice as fast."
- Any specific benchmark claim.

### Reason

The MVP does not include full benchmarking infrastructure.

### Status

Accepted.

---

## D-013 — Transparent Result Categories

### Decision

Results should distinguish between concepts such as:

- Detected.
- AI-Inferred.
- Estimated.
- Unknown.
- Not Measured.

### Reason

This prevents users from treating every result as equally certain.

### Status

Accepted.

---

## D-014 — Single Main Analysis Endpoint

### Decision

The initial backend API will use a primary endpoint conceptually similar to:

```text
POST /api/analyze
```

### Reason

A single analysis workflow is sufficient for the MVP and keeps the initial API simple.

Additional endpoints can be introduced later if implementation requires them.

### Status

Accepted.

---

## D-015 — No Microservices

### Decision

The MVP will use a single backend application rather than a microservice architecture.

### Reason

Microservices would introduce unnecessary:

- Deployment complexity.
- Communication complexity.
- Debugging overhead.
- Infrastructure requirements.

The project does not currently require independent services.

### Status

Accepted.

---

## D-016 — No Repository or GitHub Analysis in MVP

### Decision

The MVP will not analyze:

- GitHub repositories.
- Entire projects.
- Multiple files.
- Pull requests.

### Reason

The initial goal is high-quality analysis of individual code snippets.

Repository analysis can be considered as a future extension.

### Status

Accepted.

---

## D-017 — Incremental Development Workflow

### Decision

The project will be implemented in small, controlled milestones.

### Workflow

```text
Plan
  ↓
Small Implementation Task
  ↓
Implement
  ↓
Test
  ↓
Review
  ↓
Commit
  ↓
Push
  ↓
Next Task
```

### Reason

This reduces the risk of:

- Large broken changes.
- Difficult debugging.
- Lost context.
- Excessive AI token usage.

### Status

Accepted.

---

# Decision Change Policy

A decision in this document should not be changed casually.

Before changing a major decision, evaluate:

1. Why the change is needed.
2. Whether the change improves the MVP.
3. What additional complexity it introduces.
4. Whether it affects existing architecture.
5. Whether the current decision should remain for Version 1.

Major decision changes should be documented with a new decision entry rather than silently modifying previous project assumptions.