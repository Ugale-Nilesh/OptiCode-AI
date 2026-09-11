# OptiCode AI

> An explainable AI-powered code analysis and optimization assistant for Python, C++, and Java.

**Live app:** https://opti-code-ai-beige.vercel.app
(Backend runs on a free tier and may take 30-60 seconds to respond on the first request after a period of inactivity.)

OptiCode AI helps developers understand their code, identify potential inefficiencies, explore optimization opportunities, and compare original implementations with improved alternatives.

The project focuses on an important question:

> What can be improved, why does it matter, and how would the improved approach work?

---

## Overview

Developers often write code that works correctly but may not be efficient, scalable, or well structured.

OptiCode AI combines:

- Deterministic code analysis.
- AI-powered reasoning.
- Complexity analysis.
- Optimization suggestions.
- Explainable results.
- Original versus optimized code comparison.

The goal is not simply to generate different code.

OptiCode AI is designed to help users understand:

- What potential issues exist.
- Why those issues may matter.
- How an implementation could be improved.
- What trade-offs an optimization introduces.

---

## Supported Languages

The MVP supports:

- Python
- C++
- Java

The initial version focuses on:

- Code snippets.
- Functions.
- Relatively self-contained pieces of code.

It does not initially support full repositories or multi-file project analysis.

---

## Core Features

### Code Analysis

Users can submit source code and select the programming language.

The system analyzes the code for selected patterns and potential optimization opportunities.

### Deterministic Analysis

The deterministic analysis layer identifies patterns that can be detected without relying entirely on AI reasoning.

Examples include:

- Nested loops.
- Repeated operations inside loops.
- Repeated sorting.
- Repeated searching.
- Redundant calculations.
- Selected inefficient patterns.

### AI-Powered Reasoning

The AI reasoning layer helps explain:

- What the code does.
- What potential issues were identified.
- Why those issues may matter.
- How the implementation could be improved.
- What trade-offs may exist.

### Complexity Analysis

The system provides estimated:

- Time complexity.
- Space complexity.

Results are presented transparently when they are estimated rather than mathematically proven.

### Optimization Suggestions

Significant suggestions explain:

- The issue.
- Why it matters.
- The suggested improvement.
- The expected effect.
- Important assumptions or limitations.

### Optimized Code

When an improvement is justified, OptiCode AI can generate an optimized version of the submitted code.

The system is also allowed to conclude that:

> No significant optimization opportunity was identified.

### Code Comparison

Users can compare:

- Original code.
- Optimized code.
- Complexity estimates.
- Important implementation changes.

---

## Architecture

OptiCode AI follows a modular client-server architecture.

```text
User
  ↓
Frontend
  ↓
Backend API
  ↓
Input Validation
  ↓
Language Selection
  ↓
Deterministic Analysis
  ↓
AI Reasoning
  ↓
Result Normalization
  ↓
Frontend Results Interface
```

The architecture separates deterministic analysis from AI reasoning.

This allows reliably detectable patterns to be identified programmatically while AI is used for explanation, interpretation, and higher-level optimization reasoning.

For more details, see `ARCHITECTURE.md`.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Monaco Editor

### Backend

- Python
- FastAPI

### Analysis

- Language-specific analyzers.
- Deterministic pattern detection.
- AI reasoning layer (Google Gemini).

---

## Project Structure

The current project structure is:

```text
OptiCode-AI/
  backend/
    app/
      analyzers/       # Language-specific deterministic analyzers (Python, C++, Java)
      api/             # FastAPI routes
      core/            # Configuration (env vars)
      schemas/         # Pydantic request/response models
      services/        # Analysis orchestration and AI provider integration
    requirements.txt
    .env.example
  frontend/
    src/
      api/             # Backend API client
      components/      # React components
      types/           # TypeScript types
    package.json
  README.md
  PROJECT_SPEC.md
  ARCHITECTURE.md
  TASKS.md
  DECISIONS.md
  CONTRIBUTING.md
  .gitignore
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- A free Google Gemini API key from https://aistudio.google.com/apikey

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1   # Windows PowerShell
pip install -r requirements.txt

# Create a .env file (see .env.example) and set:
# GEMINI_API_KEY=your-key-here
# GEMINI_MODEL=gemini-3.5-flash-lite

uvicorn app.main:app --reload --port 8000
```

The backend runs at http://localhost:8000. Check http://localhost:8000/api/health to confirm it started correctly.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at http://localhost:5173.

## Example Inputs

Paste any of these into the live app to see a representative result.

**Python — nested loop:**
```python
def find_max(numbers):
    result = []
    for i in range(len(numbers)):
        for j in range(len(numbers)):
            if numbers[j] > numbers[i]:
                break
        else:
            result.append(numbers[i])
    return result
```

**C++ — pass-by-value / STL alternative:**
```cpp
bool contains(std::vector<int> items, int target) {
    for (int i = 0; i < items.size(); i++) {
        if (items[i] == target) {
            return true;
        }
    }
    return false;
}
```

**Java — string concatenation in a loop:**
```java
public String buildMessage(String[] words) {
    String result = "";
    for (String word : words) {
        result = result + word + " ";
    }
    return result;
}
```

---

## Result Transparency

OptiCode AI distinguishes between different types of conclusions.

Results may be described as:

- **Detected** — identified directly by deterministic analysis.
- **AI-Inferred** — concluded through AI reasoning.
- **Estimated** — based on analysis but not mathematically proven.
- **Unknown** — insufficient information is available.
- **Not Measured** — no runtime benchmark was performed.

This distinction is important because not every analysis result has the same level of certainty.

---

## Important Principle

OptiCode AI does not make unsupported performance claims.

For example, without actual benchmarking, the system may state:

> The estimated complexity changes from O(n²) to O(n).

However, it should not claim:

> This code is 50% faster.

unless the performance difference has actually been measured.

---

## Development Roadmap

### Milestone 1 — Repository Foundation

Project documentation and repository configuration.

### Milestone 2 — Application Foundation

Create the frontend and backend and establish communication between them.

### Milestone 3 — Code Input

Add code editing and Python, C++, and Java language selection.

### Milestone 4 — Analysis Pipeline

Create the common deterministic analysis pipeline and language-specific analyzers.

### Milestone 5 — AI Analysis

Integrate AI-powered explanation and optimization reasoning.

### Milestone 6 — Results Interface

Create a clear interface for displaying structured analysis results.

### Milestone 7 — Code Comparison

Allow users to compare original and optimized implementations.

### Milestone 8 — Robustness

Improve error handling and application reliability.

### Milestone 9 — Testing

Test the application using representative examples.

### Milestone 10 — Final Polish

Prepare the project as a stable and presentable product.

For the detailed task breakdown, see `TASKS.md`.

---

## Development Workflow

The project follows an incremental development process:

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

Large uncontrolled changes should be avoided.

For contribution and development rules, see `CONTRIBUTING.md`.

---

## Current Status

The project has completed 9 of its 10 planned milestones.

The full pipeline is functional end-to-end: frontend code input, deterministic analysis for Python/C++/Java, AI-powered reasoning via Google Gemini, transparent results, side-by-side code comparison, and error-handling robustness are all implemented and tested.

Only Milestone 10 (Final Polish and Demo Preparation) remains. See `TASKS.md` for the detailed, current status of every task.

---

## Future Possibilities

Potential future versions may explore:

- Additional programming languages.
- Multi-file analysis.
- Repository analysis.
- GitHub integration.
- User accounts.
- Saved analysis history.
- Benchmarking.
- IDE extensions.
- CI/CD integration.

These features are intentionally outside the initial MVP scope.

---

## Documentation

The repository documentation is organized as follows:

- `PROJECT_SPEC.md` — product requirements and MVP definition.
- `ARCHITECTURE.md` — system architecture.
- `TASKS.md` — development roadmap and milestones.
- `DECISIONS.md` — major product and technical decisions.
- `CONTRIBUTING.md` — development workflow and contribution rules.

---

## Project Goal

The goal of OptiCode AI is not simply to make code shorter.

The goal is to help developers understand:

> What can be improved, why it should be improved, and how the improved approach works.