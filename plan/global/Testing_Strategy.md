# Global Testing Strategy

## Objective
Ensure robustness and UI responsiveness without incurring LLM API costs during development.

## 1. Mocking Strategy
Use a **Mock Mode** to simulate the LLM.

### Mock LLM Service
- **Simulated Latency**: `setTimeout` to test "Thinking..." states.
- **Simulated Streaming**: Yield text chunks to test typing effects.
- **Scenario Triggers**:
  - `/draw` -> Returns a component trigger for `TarotCard`.
  - `/error` -> Throws an error to test error handling.

## 2. Automated Testing
Using **Vitest** and **Vue Test Utils**.

### Unit Tests
- Test `MockLLMService` for correct streaming and event emission.

### Component Tests
- Test `ChatBox.vue`:
  - Verify user input rendering.
  - Verify "Thinking" state visibility.
  - **Critical**: Verify that `TarotCard` component renders when the mock service returns a component trigger.

## 3. Test Location
- `src/components/__tests__/`
- `src/services/llm/__tests__/`
