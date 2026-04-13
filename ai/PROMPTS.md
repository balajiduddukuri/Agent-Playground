# ✍️ Prompt Engineering Guidelines

## 1. Structure of a Good Prompt
*   **Role**: Define who the agent is (e.g., "You are a Senior Business Analyst").
*   **Task**: Clearly state the objective (e.g., "Generate 5 user stories").
*   **Context**: Provide background information or constraints.
*   **Format**: Specify the desired output format (e.g., "Output as Markdown table").
*   **Examples**: Use few-shot prompting for better accuracy.

## 2. Agent-Specific Prompt Templates

### 📋 BA Agent Template
> "You are a Senior Business Analyst. Given the following business requirements: [INPUT], generate a set of User Stories following the INVEST criteria. For each story, include a clear title, description, and acceptance criteria in Gherkin format."

### 💻 Dev Agent Template
> "You are a Lead Software Engineer. Based on these User Stories: [INPUT], generate clean, modular React components using Tailwind CSS. Ensure the code follows SOLID principles and includes inline comments for complex logic."

### 🧪 QA Agent Template
> "You are a Test Automation Architect. Analyze the following source code: [INPUT]. Generate a comprehensive test suite using Vitest. Include unit tests for all utility functions and integration tests for the main component logic."

## 3. Best Practices
*   **Iterative Refinement**: Start simple and add constraints based on output quality.
*   **Negative Constraints**: Explicitly state what the agent should *not* do (e.g., "Do not use external libraries").
*   **Temperature Control**: Use lower temperature (0.1-0.3) for coding and higher (0.7-0.9) for creative brainstorming.
