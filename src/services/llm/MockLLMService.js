/**
 * Mock LLM Service for Development/Testing
 * 
 * This service simulates LLM streaming behavior without making actual API calls.
 * Use this during development to test UI responsiveness and streaming effects.
 * 
 * Features:
 * - Simulated latency (thinking state)
 * - Character-by-character streaming
 * - Special command triggers:
 *   - /draw -> Returns component trigger for TarotCard
 *   - /error -> Throws error for error handling testing
 */

class MockLLMService {
  constructor(options = {}) {
    this.thinkingDelay = options.thinkingDelay || 1000; // ms before streaming starts
    this.charDelay = options.charDelay || 30; // ms between characters
  }

  /**
   * Simulates streaming response from LLM
   * @param {string} userMessage - The user's input message
   * @returns {AsyncGenerator<Object>} Yields chunks of the response
   */
  async* streamResponse(userMessage) {
    // Simulate thinking/processing delay
    await this.delay(this.thinkingDelay);

    // Check for special commands
    if (userMessage.trim().toLowerCase() === '/draw') {
      // Yield component trigger for TarotCard
      yield {
        type: 'component',
        componentName: 'TarotCard',
        data: {
          cardName: 'The Fool',
          description: 'New beginnings, innocence, spontaneity',
          imageUrl: '/cards/the-fool.jpg'
        }
      };
      return;
    }

    if (userMessage.trim().toLowerCase() === '/error') {
      // Simulate an error
      throw new Error('Mock LLM Error: Something went wrong with the mystical connection');
    }

    // Generate a mock response based on input
    const response = this.generateMockResponse(userMessage);

    // Stream the response character by character
    let buffer = '';
    for (const char of response) {
      buffer += char;
      yield {
        type: 'text',
        chunk: char,
        fullText: buffer
      };
      await this.delay(this.charDelay);
    }

    // Final yield to indicate completion
    yield {
      type: 'done',
      fullText: buffer
    };
  }

  /**
   * Generates a contextual mock response
   * @param {string} userMessage 
   * @returns {string}
   */
  generateMockResponse(userMessage) {
    const responses = [
      `The cards whisper secrets about "${userMessage}"... The mystic energies reveal a path of transformation and enlightenment ahead.`,
      `I sense your question about "${userMessage}" carries great weight. The oracle shows a journey of discovery awaits you.`,
      `The cosmic forces align in response to your query: "${userMessage}". Look within, for the answer has always resided in your soul.`,
      `Ah, you seek wisdom regarding "${userMessage}". The ancient tarot speaks of balance, patience, and hidden truths yet to be unveiled.`,
      `Your words "${userMessage}" resonate with the ethereal realm. The spirits suggest caution mixed with courage on your path forward.`
    ];

    // Select a random response
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  /**
   * Helper function for delays
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Non-streaming version for simple requests
   * @param {string} userMessage 
   * @returns {Promise<string>}
   */
  async sendMessage(userMessage) {
    await this.delay(this.thinkingDelay);

    if (userMessage.trim().toLowerCase() === '/error') {
      throw new Error('Mock LLM Error: Something went wrong with the mystical connection');
    }

    return this.generateMockResponse(userMessage);
  }
}

export default MockLLMService;
