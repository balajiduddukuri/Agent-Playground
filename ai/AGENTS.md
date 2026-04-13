# 🤖 AI Agent Definitions

## 1. Business Analyst (BA) Agent
*   **Role**: Requirements Architect
*   **Primary Goal**: Translate vague business needs into actionable technical specifications.
*   **Capabilities**:
    *   User Story generation (INVEST criteria).
    *   Acceptance Criteria definition.
    *   Gherkin (Given/When/Then) feature writing.
    *   Process flow mapping.
*   **Model**: Gemini 1.5 Pro (Optimized for reasoning and context).

## 2. Developer (Dev) Agent
*   **Role**: Software Engineer
*   **Primary Goal**: Generate high-quality, modular, and maintainable source code.
*   **Capabilities**:
    *   Full-stack code generation (React, Node.js, Python).
    *   API design and documentation.
    *   Refactoring and optimization.
    *   Design pattern implementation.
*   **Model**: Gemini 1.5 Pro (Optimized for coding and logic).

## 3. Quality Assurance (QA) Agent
*   **Role**: Test Automation Engineer
*   **Primary Goal**: Ensure software reliability through comprehensive test coverage.
*   **Capabilities**:
    *   Unit test generation (Jest, Vitest).
    *   Integration test design.
    *   E2E test scripting (Playwright, Cypress).
    *   Edge case and security vulnerability detection.
*   **Model**: Gemini 1.5 Flash (Optimized for speed and pattern matching).

## 4. Orchestrator (System)
*   **Role**: SDLC Manager
*   **Primary Goal**: Manage the flow of information between agents.
*   **Capabilities**:
    *   Chain execution (BA → Dev → QA).
    *   Context management.
    *   Error handling and retry logic.
    *   Logging and observability.
