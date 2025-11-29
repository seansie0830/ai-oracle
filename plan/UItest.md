# Chat UI Testing Strategy with Mock LLM
// maybe dont use vittest , use only mock object
## Objective
To effectively test the `ChatBox.vue` and related components without incurring costs from real LLM API calls, we will implement a robust mocking strategy. This ensures we can verify the UI's responsiveness, rendering logic (especially for dynamic components like Tarot cards), and error handling.

## 1. Mocking Strategy

### A. The "Mock Mode" Switch
We will introduce a global state or configuration setting (e.g., in Pinia or a simple reactive object) called `isMockMode`.
-   **Location**: `src/services/llm/config.js` or similar.
-   **Control**: A toggle in the `SettingsModal.vue` (only visible in dev mode) or a URL query parameter `?mock=true`.

### B. The Mock LLM Service
We will create a `MockLLMService` that mimics the interface of our real LangChain wrapper.

**Features of the Mock Service:**
1.  **Interface Compliance**: It must implement the same methods as the real service (e.g., `streamResponse(messages)`, `sendMessage(text)`).
2.  **Simulated Latency**: Use `setTimeout` to introduce random delays (e.g., 500ms - 2000ms) to test UI loading states (spinners, "thinking" animations).
3.  **Simulated Streaming**: Instead of returning a full string immediately, it should "stream" text chunk by chunk to test the typing effect in the UI.
4.  **Scenario-Based Responses**:
    -   *Standard Text*: Returns a generic mystical response.
    -   *Card Draw*: Detects keywords (e.g., "/draw") and returns a response that triggers the `TarotCard` component rendering.
    -   *Error*: Detects keywords (e.g., "/error") to simulate an API failure.

## 2. Implementation Plan

### Step 1: Define the Interface
Ensure both the real and mock services adhere to a common contract.

```typescript
// src/services/llm/types.ts
export interface LLMService {
  chat(message: string): AsyncGenerator<string, void, unknown>; // For streaming
}
```

### Step 2: Create the Mock Service
Create `src/services/llm/mockService.js`:

```javascript
export class MockLLMService {
  async *chat(message) {
    // 1. Simulate initial network delay (thinking time)
    await new Promise(r => setTimeout(r, 1000));

    // 2. Determine response type based on input
    let responseText = "";
    
    if (message.includes("draw")) {
      // Simulate a tool call or structured response for a card
      // In our plan, we might use specific markers or JSON
      responseText = "The cards reveal your path... \n\n <component-marker type='TarotCard' data='{\"card\":\"The Fool\"}' />";
    } else if (message.includes("error")) {
      throw new Error("The spirits are silent (Mock Error).");
    } else {
      responseText = "I sense a great disturbance in the ether. You asked: " + message;
    }

    // 3. Stream the response chunk by chunk
    const chunks = responseText.split(/(?=[ \n])/); // Split by words/spaces
    for (const chunk of chunks) {
      await new Promise(r => setTimeout(r, 50 + Math.random() * 50)); // Typing speed
      yield chunk;
    }
  }
}
```

### Step 3: Integrate into the Factory
Modify `src/services/llm/factory.js` to return the mock service when enabled.

```javascript
import { MockLLMService } from './mockService';
// ... imports for real services

export function getLLMService(config) {
  if (config.useMock || import.meta.env.VITE_USE_MOCK === 'true') {
    console.log("🔮 Using Mock Oracle");
    return new MockLLMService();
  }
  // ... return real service
}
```

## 3. Testing Scenarios (Manual & Automated)

### Scenario A: Basic Chat Flow
1.  **Action**: User types "Hello Oracle".
2.  **Expected UI**:
    -   Input clears.
    -   User message appears immediately.
    -   "Thinking..." indicator appears.
    -   After ~1s, text starts streaming in.
    -   "Thinking..." indicator disappears when streaming starts or ends.

### Scenario B: Component Rendering (The "Wow" Factor)
1.  **Action**: User types "Draw a card for me".
2.  **Mock Behavior**: Returns text containing the trigger for the Tarot Card component.
3.  **Expected UI**:
    -   Text appears.
    -   **CRITICAL**: The `ChatBox` correctly parses the response and renders the `TarotCard.vue` component inline (not just displaying the raw JSON/HTML).
    -   The card should have the correct props (e.g., "The Fool").

### Scenario C: Error Handling
1.  **Action**: User types "/error".
2.  **Expected UI**:
    -   A visual error state appears (e.g., a red/cracked message bubble).
    -   The app does not crash.
    -   User can try again.

## 5. Next Steps
1.  Implement `MockLLMService.js`.
2.  Update `ChatBox.vue` to handle the streaming interface.
3.  Create the test files as specified above.
4.  Run `npm run test:unit` to validate.
