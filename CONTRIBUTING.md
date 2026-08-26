# Contributing to OptiCode AI

## 1. Purpose

This document defines how development work should be performed in the OptiCode AI repository.

The goal is to keep development controlled, understandable, and incremental.

This project should prioritize correctness and maintainability over unnecessary speed or feature expansion.

---

## 2. Development Workflow

Follow this workflow for meaningful implementation tasks:

```text
Understand Task
      ↓
Check Relevant Documentation
      ↓
Plan Small Change
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
```

Do not make large, uncontrolled changes across unrelated parts of the project.

---

## 3. Before Starting a Task

Before implementing a feature:

1. Read the relevant sections of `PROJECT_SPEC.md`.
2. Read the relevant sections of `ARCHITECTURE.md`.
3. Check `TASKS.md` for the current milestone.
4. Check `DECISIONS.md` for existing constraints.
5. Understand exactly what the current task requires.

Do not begin implementation based only on assumptions.

---

## 4. Task Size

Implementation tasks should be small enough to:

- Understand clearly.
- Implement in a focused session.
- Test independently.
- Review easily.
- Commit as a meaningful unit.

Avoid combining multiple unrelated features into one task.

---

## 5. Scope Control

Do not add features simply because they might be useful.

Before adding a feature, ask:

- Is it required for the current milestone?
- Does it support the MVP?
- Does it introduce unnecessary complexity?
- Can it be postponed?

If the feature is not required, it should normally be postponed.

---

## 6. Code Quality

Code should aim to be:

- Clear.
- Readable.
- Modular.
- Reasonably documented.
- Consistent with the existing architecture.

Avoid unnecessary abstraction.

Do not create complex frameworks for functionality that has only one current use.

---

## 7. Error Handling

New functionality should handle expected failures appropriately.

User-facing errors should be understandable.

Internal implementation details should not be exposed directly to users.

---

## 8. Testing

Each meaningful feature should be tested before being considered complete.

Testing may include:

- Manual testing.
- Unit tests.
- API tests.
- Integration tests.

The appropriate test level depends on the feature.

Do not mark a task as complete without verifying that the expected behavior works.

---

## 9. Documentation

Documentation should be updated when a change affects:

- Product scope.
- Architecture.
- Major technical decisions.
- API behavior.
- Development workflow.

Minor implementation details do not require updates to every document.

---

## 10. Git Workflow

The recommended workflow is:

```text
Make Small Change
      ↓
Test
      ↓
Review
      ↓
git status
      ↓
git add
      ↓
git commit
      ↓
git push
```

Before committing, check what files have changed.

Avoid committing:

- Unrelated changes.
- Secrets.
- API keys.
- Environment files containing private credentials.
- Generated dependency folders.
- Temporary files.

---

## 11. Commit Messages

Use clear commit messages that describe what changed.

Good examples:

```text
docs: add project architecture
```

```text
feat: add code input interface
```

```text
feat: add Python analyzer
```

```text
fix: handle empty code submission
```

```text
test: add analyzer tests
```

Avoid vague commit messages such as:

```text
update
```

```text
changes
```

```text
final
```

---

## 12. AI-Assisted Development Workflow

AI tools may be used to assist with planning, implementation, debugging, and testing.

However, AI-generated code should not be accepted blindly.

For each implementation task:

1. Provide the AI with the relevant project context.
2. Give the AI a small, clearly defined task.
3. Review the proposed changes.
4. Implement or apply the changes.
5. Test the result.
6. Fix issues before continuing.
7. Commit stable work.

AI should be treated as a development assistant, not as an automatic source of truth.

---

## 13. Claude Implementation Workflow

When using Claude or another coding assistant:

1. Start by providing the current project context.
2. Ask the AI to read the relevant repository documentation.
3. Give only the current implementation task.
4. Avoid requesting multiple large features at once.
5. Ask for clear file-by-file changes.
6. Implement the changes locally.
7. Test before moving forward.

Do not allow an AI assistant to silently redesign the architecture without reviewing the existing project decisions.

---

## 14. Definition of a Completed Task

A task is considered complete when:

- The required functionality is implemented.
- The functionality has been tested.
- Expected errors are handled where relevant.
- The implementation follows the current architecture.
- The code is reviewed.
- Documentation is updated if necessary.
- The changes are committed.

---

## 15. Project Principle

OptiCode AI should be developed incrementally.

The priority order is:

1. Correctness.
2. Clear architecture.
3. Working functionality.
4. Explainability.
5. Reliability.
6. User experience.
7. Feature expansion.

Do not sacrifice the first five priorities merely to add more features.