# LLM Service Implementation Details & Suggestions

## Overview
This document outlines the technical approach for implementing the Tarot Agent using `LangChain.js`. The goal is to create a flexible, provider-agnostic service that supports streaming and custom tool usage (Tarot Deck).

## 1. Dependencies
To support the planned architecture, we need the following core packages:

```bash
npm install langchain @langchain/core @langchain/google-genai @langchain/openai zod
```
*   `@langchain/google-genai`: For Gemini integration.
*   `@langchain/openai`: For xAI and Groq (assuming they use OpenAI-compatible endpoints).
*   `zod`: For schema validation in tools.

## 2. Architecture: The Factory Pattern
We should implement a `ModelFactory` to abstract away provider differences. This allows easy switching between Gemini, xAI, and Groq.

```javascript
// src/services/llm/factory.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

export const createChatModel = (provider, apiKey, modelName) => {
  const commonConfig = {
    apiKey,
    streaming: true,
  };

  switch (provider) {
    case 'gemini':
      return new ChatGoogleGenerativeAI({
        ...commonConfig,
        modelName: modelName || "gemini-1.5-flash",
      });
    
    case 'xai':
      return new ChatOpenAI({
        ...commonConfig,
        baseURL: "https://api.x.ai/v1",
        modelName: modelName || "grok-beta",
      });

    case 'groq':
      return new ChatOpenAI({
        ...commonConfig,
        baseURL: "https://api.groq.com/openai/v1",
        modelName: modelName || "llama3-70b-8192",
      });

    case 'openrouter':
      return new ChatOpenAI({
        ...commonConfig,
        baseURL: "https://openrouter.ai/api/v1",
        modelName: modelName || "anthropic/claude-3-opus", // Example default
        configuration: {
            defaultHeaders: {
                "HTTP-Referer": "https://tarot-app.com", // Required by OpenRouter
                "X-Title": "Tarot Reader", // Optional
            }
        }
      });

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
```

## 3. API Key Verification (Token-Free)
To verify an API key without consuming tokens, we can request the list of available models. This operation requires authentication but does not generate text.

```javascript
// src/services/llm/verifier.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export const verifyApiKey = async (provider, apiKey) => {
  try {
    switch (provider) {
      case 'gemini':
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Gemini doesn't have a simple "list models" in the client SDK easily accessible for auth check 
        // without admin SDK, but we can try a countTokens or similar cheap call, 
        // OR just use the REST API for list models.
        // EASIER: Just try to count tokens on an empty string or "test".
        await model.countTokens("test"); 
        return true;

      case 'xai':
        const xai = new OpenAI({ apiKey, baseURL: "https://api.x.ai/v1", dangerouslyAllowBrowser: true });
        await xai.models.list();
        return true;

      case 'groq':
        const groq = new OpenAI({ apiKey, baseURL: "https://api.groq.com/openai/v1", dangerouslyAllowBrowser: true });
        await groq.models.list();
        return true;

      case 'openrouter':
        const openrouter = new OpenAI({ 
            apiKey, 
            baseURL: "https://openrouter.ai/api/v1", 
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
                "HTTP-Referer": "https://tarot-app.com",
            }
        });
        await openrouter.models.list();
        return true;

      default:
        return false;
    }
  } catch (error) {
    console.warn(`Verification failed for ${provider}:`, error);
    return false;
  }
};
```

## 4. The Tarot Agent (LangGraph vs. RunnableSequence)
For a Tarot Reader that needs to "decide" to draw cards, a **Tool Calling Agent** is best. However, for simpler control, a **RunnableSequence** with bound tools is also effective.

**Recommendation**: Start with a standard `createToolCallingAgent` or `ChatModel.bindTools()` chain. If state management (multi-turn conversation history) becomes complex, upgrade to **LangGraph**.

### Tool Definition
The `draw_cards` tool is critical. It must be deterministic in its "drawing" (random logic) but the *tool definition* just exposes it to the LLM.

```javascript
// src/services/llm/tools/tarotDeck.js
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const drawCardsTool = tool(
  (input) => {
    const count = input.count || 3;
    // ... logic to randomly select 'count' cards from deck ...
    // Return JSON string of drawn cards
    return JSON.stringify(selectedCards);
  },
  {
    name: "draw_cards",
    description: "Draws a specific number of tarot cards from the deck. Use this when the user asks for a reading.",
    schema: z.object({
      count: z.number().describe("The number of cards to draw (usually 1, 3, or 5)"),
    }),
  }
);
```

## 5. Streaming Strategy
The `MockLLMService` simulates streaming. In the real implementation, we use the `.stream()` method.

```javascript
// src/services/llm/TarotService.js
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// ... inside your service class ...

async *streamResponse(userMessage, history = []) {
  const model = createChatModel(this.config.provider, this.config.apiKey);
  const tools = [drawCardsTool];
  const modelWithTools = model.bindTools(tools);
  
  // Construct messages
  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    ...history,
    new HumanMessage(userMessage)
  ];

  // We need a loop or agent executor to handle tool calls + final response
  // For simple "bindTools", if the model calls a tool, it stops. 
  // We need to execute the tool and feed it back.
  
  // BETTER APPROACH: Use a pre-built Agent Executor for automatic tool handling
  const agent = createToolCallingAgent({ llm: model, tools, prompt: chatPrompt });
  const agentExecutor = new AgentExecutor({ agent, tools });

  const eventStream = await agentExecutor.streamEvents(
    { input: userMessage, chat_history: history },
    { version: "v2" }
  );

  for await (const event of eventStream) {
    if (event.event === "on_chat_model_stream") {
      // This is a text chunk
      if (event.data.chunk.content) {
        yield { type: 'text', chunk: event.data.chunk.content };
      }
    } else if (event.event === "on_tool_end") {
      // Tool finished, we can yield a special event to UI if needed
      // e.g., to show the cards immediately
      if (event.name === 'draw_cards') {
        yield { type: 'component', componentName: 'TarotCard', data: JSON.parse(event.data.output) };
      }
    }
  }
}
```

## 6. Key Considerations
1.  **System Prompt Engineering**: The persona relies entirely on the system prompt. It must enforce the "Mystic" tone and strictly instruct the model to *use the tool* rather than inventing cards.
2.  **State Management**: You need to persist `chat_history`. In a browser-only app, this can be in `Pinia` or `localStorage`.
3.  **Error Handling**: Wrap API calls in try/catch blocks and yield a specific error object (like the mock service does) to show a graceful UI error state.
