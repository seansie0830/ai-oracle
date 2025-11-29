/**
 * Mock LLM Service for Development/Testing
 * 
 * This service simulates LLM streaming behavior without making actual API calls.
 */

import { drawRandomCard, drawMultipleCards } from '../../utils/tarotUtils'

class MockLLMService {
  constructor(options = {}) {
    this.thinkingDelay = options.thinkingDelay || 1000; // ms before streaming starts
    this.charDelay = options.charDelay || 30; // ms between characters
  }

  /**
   * Clears the session history (no-op for mock but needed for interface consistency)
   */
  clearHistory() {
    // No-op for mock service as it doesn't maintain history state
  }

  /**
   * Simulates streaming response from LLM
   * @param {string} userMessage - The user's input message
   * @returns {AsyncGenerator<Object>} Yields chunks of the response
   */
  async* streamResponse(userMessage) {
    // Simulate thinking/processing delay
    await this.delay(this.thinkingDelay);

    const command = userMessage.trim().toLowerCase();

    // Check for special commands
    if (command === '/draw' || command === '/card') {
      // Yield component trigger for single TarotCard with random card
      const randomCard = drawRandomCard()
      yield {
        type: 'component',
        componentName: 'TarotCard',
        data: {
          cardName: randomCard.cardName,
          orientation: randomCard.orientation,
          isRevealed: true
        }
      };
      return;
    }

    if (command === '/draw-reversed' || command === '/card-reversed') {
      // Yield reversed tarot card (force reversed orientation)
      const randomCard = drawRandomCard()
      yield {
        type: 'component',
        componentName: 'TarotCard',
        data: {
          cardName: randomCard.cardName,
          orientation: 'reversed',
          isRevealed: true
        }
      };
      return;
    }

    if (command === '/spread' || command === '/spread-three') {
      // Yield three-card spread with random cards
      const randomCards = drawMultipleCards(3)
      yield {
        type: 'component',
        componentName: 'TarotSpread',
        data: {
          spreadType: 'three-card',
          cards: randomCards,
          autoReveal: true,
          revealDelay: 500
        }
      };
      return;
    }

    if (command === '/spread-celtic' || command === '/celtic-cross') {
      // Yield Celtic Cross spread with random cards
      const randomCards = drawMultipleCards(10)
      yield {
        type: 'component',
        componentName: 'TarotSpread',
        data: {
          spreadType: 'celtic-cross',
          cards: randomCards,
          autoReveal: true,
          revealDelay: 400
        }
      };
      return;
    }

    if (command === '/deck') {
      // Yield interactive deck
      yield {
        type: 'component',
        componentName: 'TarotDeck',
        data: {
          mode: 'single',
          count: 1
        }
      };
      return;
    }

    if (command === '/deck-multiple') {
      // Yield interactive deck for multiple cards
      yield {
        type: 'component',
        componentName: 'TarotDeck',
        data: {
          mode: 'multiple',
          count: 3
        }
      };
      return;
    }

    // Error simulation commands for testing
    if (command === '/error' || command === '/error-mystical') {
      const error = new Error('The cosmic energies are in flux. The oracle cannot divine at this moment.');
      error.code = 'MYSTICAL_ERROR';
      throw error;
    }

    if (command === '/error-network') {
      const error = new Error('Network connection lost');
      error.name = 'NetworkError';
      error.code = 'NETWORK_ERROR';
      throw error;
    }

    if (command === '/error-timeout') {
      const error = new Error('Request timeout after 30 seconds');
      error.code = 'TIMEOUT';
      error.timeout = 30000;
      throw error;
    }

    if (command === '/error-stream') {
      // Simulate streaming then error mid-stream
      const partialResponse = 'The cards reveal...';
      let buffer = '';
      for (const char of partialResponse) {
        buffer += char;
        yield {
          type: 'text',
          chunk: char,
          fullText: buffer
        };
        await this.delay(this.charDelay);
      }

      // Then throw error
      const error = new Error('Streaming connection interrupted');
      error.code = 'STREAMING_ERROR';
      throw error;
    }

    if (command === '/error-rate') {
      const error = new Error('Rate limit exceeded. Please try again in 60 seconds.');
      error.code = 'RATE_LIMIT';
      error.retryAfter = 60;
      throw error;
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
