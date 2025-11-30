import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { useErrorHandler } from '@/composables/useErrorHandler';
import { drawRandomCard, drawMultipleCards } from '@/utils/tarotUtils';
import { useI18nStore } from '@/stores/i18n';

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
     * Fetches the list of available models from the specified provider
     * @param {string} provider - The LLM provider (gemini, xai, groq, openrouter)
     * @param {string} apiKey - The API key for the provider
     * @returns {Promise<Array<{id: string, name: string}>>} List of models
     */
    static async fetchAvailableModels(provider, apiKey) {
        if (!apiKey && provider !== 'openrouter') {
            throw new Error("API Key is required to fetch models.");
        }

        try {
            let models = [];

            switch (provider) {
                case 'gemini':
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                    if (!response.ok) throw new Error(`Gemini API Error: ${response.statusText}`);
                    const data = await response.json();
                    // Filter for 'generateContent' capable models and map
                    models = data.models
                        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                        .map(m => ({
                            id: m.name.replace("models/", ""), // Remove 'models/' prefix
                            name: m.displayName
                        }));
                    break;

                case 'xai':
                case 'groq':
                case 'openrouter':
                    let baseUrl = "";
                    if (provider === 'xai') baseUrl = "https://api.x.ai/v1/models";
                    if (provider === 'groq') baseUrl = "https://api.groq.com/openai/v1/models";
                    if (provider === 'openrouter') baseUrl = "https://openrouter.ai/api/v1/models";

                    const headers = {
                        "Content-Type": "application/json"
                    };
                    if (apiKey) {
                        headers["Authorization"] = `Bearer ${apiKey}`;
                    }

                    const openAiResponse = await fetch(baseUrl, {
                        headers: headers
                    });

                    if (!openAiResponse.ok) throw new Error(`${provider.toUpperCase()} API Error: ${openAiResponse.statusText}`);
                    const openAiData = await openAiResponse.json();

                    models = openAiData.data.map(m => ({
                        id: m.id,
                        name: m.id // OpenAI format usually just has ID, sometimes name is same
                    }));
                    break;

                default:
                    throw new Error(`Unsupported provider for fetching models: ${provider}`);
            }

            // Sort models alphabetically by name
            models.sort((a, b) => a.name.localeCompare(b.name));

            return models;
        } catch (error) {
            console.error(`Failed to fetch models for ${provider}:`, error);
            throw error;
        }
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
            const tools = [
                this._getDrawSingleCardTool(),
                this._getDrawThreeCardSpreadTool(),
                this._getDrawCelticCrossSpreadTool(),
                this._getInteractiveDeckTool()
            ];

            // Create a React agent using the new LangGraph API
            const agent = createReactAgent({
                llm: model,
                tools: tools,
            });

            const eventStream = await agent.stream(
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
                        let contentStr = "";
                        if (typeof lastMessage.content === 'string') {
                            contentStr = lastMessage.content;
                        } else if (Array.isArray(lastMessage.content)) {
                            // Handle array content (e.g. text blocks + tool use)
                            // Extract text parts
                            contentStr = lastMessage.content
                                .filter(c => c.type === 'text')
                                .map(c => c.text)
                                .join('');
                        }

                        // Only yield if this is new content we haven't seen
                        if (contentStr && contentStr.length > finalResponseText.length) {
                            const newContent = contentStr.substring(finalResponseText.length);
                            finalResponseText = contentStr;
                            yield { type: 'text', chunk: newContent, fullText: finalResponseText };
                        }
                    }

                    // Check if it's a tool message (result of tool execution)
                    if (lastMessage._getType() === 'tool') {
                        try {
                            const toolResult = JSON.parse(lastMessage.content);

                            // Check if this is an interactive deck tool result
                            if (toolResult.componentType === 'TarotDeck') {
                                yield {
                                    type: 'component',
                                    componentName: 'TarotDeck',
                                    data: {
                                        mode: toolResult.mode,
                                        count: toolResult.count
                                    }
                                };
                            } else if (Array.isArray(toolResult)) {
                                // This is a card draw result
                                const cards = toolResult;

                                // Determine component type based on number of cards
                                if (cards.length === 1) {
                                    // Single card - use TarotCard component
                                    yield {
                                        type: 'component',
                                        componentName: 'TarotCard',
                                        data: {
                                            cardName: cards[0].cardName,
                                            orientation: cards[0].orientation,
                                            isRevealed: true
                                        }
                                    };
                                } else {
                                    // Multiple cards - use TarotSpread component
                                    yield {
                                        type: 'component',
                                        componentName: 'TarotSpread',
                                        data: {
                                            spreadType: cards.length === 3 ? 'three-card' : 'celtic-cross',
                                            cards: cards.map(c => ({
                                                cardName: c.cardName,
                                                orientation: c.orientation
                                            })),
                                            autoReveal: true,
                                            revealDelay: 500
                                        }
                                    };
                                }
                            }
                        } catch (e) {
                            console.error("Failed to parse tool result", e);
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

            // Trigger Error Modal via useErrorHandler
            try {
                const { handleLLMError } = useErrorHandler();
                handleLLMError(error);
            } catch (e) {
                console.warn("Failed to trigger error modal:", e);
            }

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
        // Extract config values, handling both plain objects and Pinia stores
        const provider = this.config.provider;
        const apiKey = this.config.apiKey;
        // Support both modelName (config) and selectedModel (store)
        const modelName = this.config.modelName || this.config.selectedModel;

        console.log(`[RealLLMService] Creating model: provider=${provider}, model=${modelName}, apiKey=${apiKey ? '***' : 'missing'}`);

        const commonConfig = {
            apiKey: String(apiKey), // Ensure it's a primitive string
            streaming: true
        };

        switch (provider) {
            case 'gemini':
                return new ChatGoogleGenerativeAI({
                    ...commonConfig,
                    model: modelName || "gemini-1.5-flash", // Use 'model' instead of 'modelName'
                    googleApiKey: commonConfig.apiKey, // Explicitly map to googleApiKey
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
     * Returns the Draw Single Card Tool
     */
    _getDrawSingleCardTool() {
        return tool(
            async () => {
                const randomCard = drawRandomCard();
                return JSON.stringify([{
                    cardName: randomCard.cardName,
                    orientation: randomCard.orientation
                }]);
            },
            {
                name: "draw_single_card",
                description: "Draws a single tarot card for a quick reading or answer to a specific question. Use this when the user wants a simple, focused card draw.",
                schema: z.object({}),
            }
        );
    }

    /**
     * Returns the Draw Three-Card Spread Tool
     */
    _getDrawThreeCardSpreadTool() {
        return tool(
            async () => {
                const cards = drawMultipleCards(3);
                return JSON.stringify(cards.map(c => ({
                    cardName: c.cardName,
                    orientation: c.orientation
                })));
            },
            {
                name: "draw_three_card_spread",
                description: "Draws a three-card spread, typically representing past, present, and future. Use this when the user wants insight into a situation's progression or timeline.",
                schema: z.object({}),
            }
        );
    }

    /**
     * Returns the Draw Celtic Cross Spread Tool
     */
    _getDrawCelticCrossSpreadTool() {
        return tool(
            async () => {
                const cards = drawMultipleCards(10);
                return JSON.stringify(cards.map(c => ({
                    cardName: c.cardName,
                    orientation: c.orientation
                })));
            },
            {
                name: "draw_celtic_cross_spread",
                description: "Draws a Celtic Cross spread (10 cards) for a comprehensive, in-depth reading covering multiple aspects of a situation. Use this for complex questions or when the user wants a detailed, thorough reading.",
                schema: z.object({}),
            }
        );
    }

    /**
     * Returns the Interactive Deck Tool
     */
    _getInteractiveDeckTool() {
        return tool(
            async (input) => {
                const mode = input.mode || 'single';
                const count = input.count || 1;
                // Return instructions for the interactive deck component
                return JSON.stringify({
                    mode: mode,
                    count: count,
                    componentType: 'TarotDeck'
                });
            },
            {
                name: "show_interactive_deck",
                description: "Shows an interactive tarot deck where the user can select their own cards. Use this when the user wants to be more involved in the card selection process or prefers choosing cards themselves.",
                schema: z.object({
                    mode: z.enum(['single', 'multiple']).describe("Whether to draw a single card or multiple cards"),
                    count: z.number().optional().describe("Number of cards to draw (for 'multiple' mode)")
                }),
            }
        );
    }

    /**
     * Returns the System Prompt
     */
    _getSystemPrompt() {
        const i18nStore = useI18nStore();
        const isTraditionalChinese = i18nStore.locale === 'zh-TW'; // Adjust 'locale' and 'zh-TW' as per your store's state

        const englishPrompt = `You are a wise, empathetic, and mystical Tarot Reader. 
Your goal is to guide the user through a tarot reading.

**Important Guidelines:**
1. Always start by understanding the user's question or situation.
2. When the user asks for a reading, you MUST use one of the available tools. Do not invent cards.
3. Choose the appropriate tool based on the user's request:
   - **draw_single_card**: For quick, focused questions or when the user wants a single card
   - **draw_three_card_spread**: For past/present/future readings or when user asks for a "spread" or "3 cards"
   - **draw_celtic_cross_spread**: For comprehensive, in-depth readings (10 cards) or when user asks for detailed analysis
   - **show_interactive_deck**: When the user wants to personally select their own cards from the deck
4. Once cards are drawn, interpret them meaningfully in the context of the user's question.
5. Speak in a soothing, slightly poetic, but clear and grounded manner.
6. Do not be overly fatalistic; emphasize empowerment and reflection.
7. Trust the tools to provide actual cards - never make up card names or results.`;

        const traditionalChinesePrompt = `您是一位睿智、富有同情心且神秘的塔羅牌讀者。
您的目標是引導使用者完成塔羅牌閱讀。

**重要指南：**
1. 始終從理解使用者的問題或情況開始。
2. 當使用者要求進行閱讀時，您必須使用其中一個可用的工具。不要憑空創造卡牌。
3. 根據使用者的請求選擇適當的工具：
   - **draw_single_card**：適用於快速、集中的問題，或當使用者想要單張卡牌時。
   - **draw_three_card_spread**：適用於過去/現在/未來閱讀，或當使用者要求「牌陣」或「三張牌」時。
   - **draw_celtic_cross_spread**：適用於全面、深入的閱讀（10張牌），或當使用者要求詳細分析時。
   - **show_interactive_deck**：當使用者希望親自從牌組中選擇卡牌時。
4. 一旦抽取了卡牌，請根據使用者的問題進行有意義的解釋。
5. 以一種撫慰人心、略帶詩意，但清晰而務實的方式說話。
6. 不要過於宿命論；強調賦權和反思。
7. 相信工具會提供實際的卡牌——絕不要編造卡牌名稱或結果。`;

        return isTraditionalChinese ? traditionalChinesePrompt : englishPrompt;
    }
}

export default RealLLMService;
