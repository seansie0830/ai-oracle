/**
 * Mock LLM Service for Development/Testing
 * 
 * This service simulates LLM streaming behavior without making actual API calls.
 */

import { drawRandomCard, drawMultipleCards, drawRandomCardFromFullDeck, drawMultipleCardsFromFullDeck } from '../../utils/tarotUtils'
import i18n from '../../i18n'

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
      // Yield component trigger for single TarotCard with random card from full deck
      const randomCard = drawRandomCardFromFullDeck()
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
      // Yield reversed tarot card from full deck (force reversed orientation)
      const randomCard = drawRandomCardFromFullDeck()
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
      // Yield three-card spread with random cards from full deck
      const randomCards = drawMultipleCardsFromFullDeck(3)
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
      // Yield Celtic Cross spread with random cards from full deck
      const randomCards = drawMultipleCardsFromFullDeck(10)
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

    // Major Arcana Only Commands
    if (command === '/draw-major' || command === '/card-major') {
      // Yield single card from MAJOR ARCANA ONLY
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

    if (command === '/spread-major' || command === '/spread-three-major') {
      // Yield three-card spread from MAJOR ARCANA ONLY
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

    if (command === '/celtic-major') {
      // Yield Celtic Cross spread from MAJOR ARCANA ONLY
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

    if (command === '/help') {
      // Show help text with all available commands
      const helpText = i18n.global.t('mock.helpText');

      // Stream the help response
      let buffer = '';
      for (const char of helpText) {
        buffer += char;
        yield {
          type: 'text',
          chunk: char,
          fullText: buffer
        };
        await this.delay(this.charDelay);
      }

      yield {
        type: 'done',
        fullText: buffer
      };
      return;
    }

    if (command === '/markdown' || command === '/md') {
      // Test markdown rendering capabilities
      const markdownDemo = i18n.global.t('mock.markdownDemo');

      // Stream the markdown response
      let buffer = '';
      for (const char of markdownDemo) {
        buffer += char;
        yield {
          type: 'text',
          chunk: char,
          fullText: buffer
        };
        await this.delay(this.charDelay);
      }

      yield {
        type: 'done',
        fullText: buffer
      };
      return;
    }

    // Error simulation commands for testing
    if (command === '/error' || command === '/error-mystical') {
      const error = new Error(i18n.global.t('mock.errors.mystical'));
      error.code = 'MYSTICAL_ERROR';
      throw error;
    }

    if (command === '/error-network') {
      const error = new Error(i18n.global.t('mock.errors.network'));
      error.name = 'NetworkError';
      error.code = 'NETWORK_ERROR';
      throw error;
    }

    if (command === '/error-timeout') {
      const error = new Error(i18n.global.t('mock.errors.timeout'));
      error.code = 'TIMEOUT';
      error.timeout = 30000;
      throw error;
    }

    if (command === '/error-stream') {
      // Simulate streaming then error mid-stream
      const partialResponse = i18n.global.t('chat.thinking'); // Reusing thinking text as partial
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
      const error = new Error(i18n.global.t('mock.errors.streaming'));
      error.code = 'STREAMING_ERROR';
      throw error;
    }

    if (command === '/error-rate') {
      const error = new Error(i18n.global.t('mock.errors.rateLimit'));
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
    const responses = i18n.global.tm('mock.responses');

    // Select a random response
    const randomIndex = Math.floor(Math.random() * responses.length);
    const template = responses[randomIndex];

    return template.replace('{query}', userMessage);
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
      throw new Error(i18n.global.t('mock.errors.generic'));
    }

    return this.generateMockResponse(userMessage);
  }
}

export default MockLLMService;
