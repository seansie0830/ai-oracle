# Tarot Agent Service Plan

## Overview
Implementation of the backend logic using `LangChain.js` to power the Tarot Reader persona.


## 1. Service Architecture

### Location
`src/services/llm/`

### Core Components
1.  **Model Factory** (`factory.js`):
    - Instantiates `ChatModel` based on provider (Gemini, xAI, Groq).
    - Handles API Key injection.
2.  **Tarot Agent** (`agent.js`):
    - Defines the System Prompt (Persona).
    - Manages conversation history (Memory).
    - Integrates Tools.

## 2. Tools
To ensure fairness and randomness, the Agent uses deterministic tools:
- **`draw_cards(count)`**: Randomly selects cards from a 78-card deck. Returns names and orientations.

## 3. System Prompt
> "You are a wise and empathetic Tarot Reader... You will guide them to choose a spread, draw cards (using your tools), and then interpret them..."

## 4. Mocking for Development
Refer to [Testing Strategy](../global/Testing_Strategy.md) for details on the `MockLLMService` used to simulate responses without API costs.
