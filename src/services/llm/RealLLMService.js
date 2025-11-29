import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

/**
 * Real LLM Service Implementation
 * 
 * Connects to actual LLM providers (Gemini, xAI, Groq, OpenRouter) using LangChain.js.
 * Implements the same interface as MockLLMService for seamless swapping.
 */
class RealLLMService {
    constructor(config = {}) {
        this.config = config; // { provider, apiKey, modelName }
        this.history = []; // Session history
    }

    /**
     * Updates the service configuration
     * @param {Object} newConfig 
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Clears the session history
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Streams the response from the LLM Agent
     * @param {string} userMessage 
     * @returns {AsyncGenerator<Object>} Yields chunks of text or tool events
     */
    async *streamResponse(userMessage) {
        try {
            if (!this.config.apiKey) {
                throw new Error("API Key is missing. Please configure it in settings.");
            }

            const model = this._createModel();
            const tools = [this._getDrawCardsTool()];

            // Create a React agent using the new LangGraph API
            const agent = createReactAgent({
                llm: model,
                tools: tools,
            });

            const eventStream = agent.stream(
                {
                    messages: [
                        new SystemMessage(this._getSystemPrompt()),
                        ...this.history,
                        new HumanMessage(userMessage)
                    ]
                },
                { streamMode: "values" }
            );

            let finalResponseText = "";

            for await (const event of eventStream) {
                // LangGraph streams state updates with messages array
                if (event.messages && event.messages.length > 0) {
                    const lastMessage = event.messages[event.messages.length - 1];

                    // Check if it's an AI message with content
                    if (lastMessage._getType() === 'ai' && lastMessage.content) {
                        // Only yield if this is new content we haven't seen
                        if (lastMessage.content.length > finalResponseText.length) {
                            const newContent = lastMessage.content.substring(finalResponseText.length);
                            yield { type: 'text', chunk: newContent };
                            finalResponseText = lastMessage.content;
                        }
                    }

                    // Check for tool calls
                    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
                        for (const toolCall of lastMessage.tool_calls) {
                            if (toolCall.name === 'draw_cards') {
                                // Find the corresponding tool message in the next events
                                // For now, we'll handle this differently
                            }
                        }
                    }

                    // Check if it's a tool message (result of tool execution)
                    if (lastMessage._getType() === 'tool') {
                        try {
                            const cards = JSON.parse(lastMessage.content);
                            yield {
                                type: 'component',
                                componentName: 'TarotCard',
                                data: { cards }
                            };
                        } catch (e) {
                            console.error("Failed to parse card data", e);
                        }
                    }
                }
            }

            // Update history
            this.history.push(new HumanMessage(userMessage));
            if (finalResponseText) {
                this.history.push(new AIMessage(finalResponseText));
            }

            yield { type: 'done', fullText: finalResponseText };

        } catch (error) {
            console.error("RealLLMService Error:", error);
            yield { type: 'error', message: error.message || "An error occurred." };
        }
    }

    /**
     * Non-streaming version (optional, but good for compatibility)
     */
    async sendMessage(userMessage) {
        const generator = this.streamResponse(userMessage);
        let fullText = "";
        for await (const chunk of generator) {
            if (chunk.type === 'text') fullText += chunk.chunk;
        }
        return fullText;
    }

    /**
     * Factory method to create the Chat Model
     */
    _createModel() {
        const { provider, apiKey, modelName } = this.config;
        const commonConfig = { apiKey, streaming: true };

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
                    modelName: modelName || "anthropic/claude-3-opus",
                    configuration: {
                        defaultHeaders: {
                            "HTTP-Referer": "https://tarot-app.com",
                            "X-Title": "Tarot Reader",
                        }
                    }
                });
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    }

    /**
     * Returns the Tarot Deck Tool
     */
    _getDrawCardsTool() {
        // Simplified deck data
        const TAROT_DECK = [
            "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
            "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
            "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
            "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
            "Judgement", "The World",
            "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands",
            "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups",
            "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords",
            "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles"
        ];

        return tool(
            async (input) => {
                const count = input.count || 3;
                const drawnCards = [];
                const deckCopy = [...TAROT_DECK];

                for (let i = 0; i < count; i++) {
                    if (deckCopy.length === 0) break;
                    const randomIndex = Math.floor(Math.random() * deckCopy.length);
                    const card = deckCopy.splice(randomIndex, 1)[0];
                    const isReversed = Math.random() < 0.3;

                    drawnCards.push({
                        name: card,
                        orientation: isReversed ? "Reversed" : "Upright",
                        description: `The ${card} card, appearing ${isReversed ? "reversed" : "upright"}.`
                    });
                }
                return JSON.stringify(drawnCards);
            },
            {
                name: "draw_cards",
                description: "Draws a specific number of tarot cards from the deck. Use this when the user asks for a reading.",
                schema: z.object({
                    count: z.number().describe("The number of cards to draw (usually 1, 3, or 5)"),
                }),
            }
        );
    }

    /**
     * Returns the System Prompt
     */
    _getSystemPrompt() {
        return `You are a wise, empathetic, and mystical Tarot Reader. 
Your goal is to guide the user through a tarot reading.
1. Always start by understanding the user's question or situation.
2. If the user asks for a reading, you MUST use the 'draw_cards' tool to draw cards. Do not invent cards.
3. Once cards are drawn, interpret them in the context of the user's question.
4. Speak in a soothing, slightly poetic, but clear and grounded manner.
5. Do not be overly fatalistic; emphasize empowerment and reflection.`;
    }
}

export default RealLLMService;
