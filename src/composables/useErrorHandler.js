/**
 * Error Handler Composable
 * 
 * Provides consistent error handling patterns across components.
 * Use this composable to handle LLM errors, API failures, and network issues.
 */

import { useErrorStore } from '@/stores/errorHandler'
import { useLLMConfigStore } from '@/stores/llmConfig'

export function useErrorHandler() {
    const errorStore = useErrorStore()
    const llmConfig = useLLMConfigStore()

    /**
     * Handle errors from LLM services
     * Maps common error patterns to appropriate error types
     */
    function handleLLMError(error) {
        console.error('[useErrorHandler] LLM Error:', error)

        // Check for specific error patterns
        if (error.code === 'INVALID_API_KEY' || error.message?.includes('API key')) {
            errorStore.showError('API_KEY_INVALID', null, {
                provider: llmConfig.provider,
                stack: error.stack
            })
        } else if (error.code === 'RATE_LIMIT' || error.message?.includes('rate limit')) {
            errorStore.showError('RATE_LIMIT', null, {
                retryAfter: error.retryAfter || 60,
                requestsRemaining: error.requestsRemaining || 0
            })
        } else if (error.name === 'NetworkError' || error.message?.includes('network')) {
            errorStore.showError('NETWORK_ERROR', null, {
                url: error.url,
                status: error.status
            })
        } else if (error.code === 'TIMEOUT' || error.message?.includes('timeout')) {
            errorStore.showError('LLM_TIMEOUT', null, {
                timeout: error.timeout,
                stack: error.stack
            })
        } else if (error.message?.includes('streaming')) {
            errorStore.showError('LLM_STREAMING_ERROR', null, {
                stack: error.stack
            })
        } else if (error.message?.includes('mystical')) {
            // Mock service error
            errorStore.showError('MOCK_MYSTICAL_ERROR', error.message, {
                stack: error.stack
            })
        } else {
            // Unknown error
            errorStore.showError('UNKNOWN_ERROR', error.message, {
                stack: error.stack,
                name: error.name
            })
        }
    }

    /**
     * Handle missing API key
     */
    function handleAPIKeyMissing() {
        errorStore.showError('API_KEY_MISSING')
    }

    /**
     * Retry a function with exponential backoff
     * @param {Function} fn - Async function to retry
     * @param {number} maxRetries - Maximum retry attempts
     * @returns {Promise} Result of the function
     */
    async function retryWithBackoff(fn, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const result = await fn()
                // Success! Reset retry count
                errorStore.resetRetryCount()
                return result
            } catch (error) {
                errorStore.incrementRetryCount()

                // If this was the last retry, throw the error
                if (i === maxRetries - 1) {
                    throw error
                }

                // Wait before retrying (exponential backoff: 1s, 2s, 4s, etc.)
                const delay = Math.pow(2, i) * 1000
                console.log(`[useErrorHandler] Retry ${i + 1}/${maxRetries} after ${delay}ms`)
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }

    /**
     * Wrap an async function with error handling
     * @param {Function} fn - Async function to wrap
     * @param {Object} options - Error handling options
     */
    async function withErrorHandling(fn, options = {}) {
        const { silent = false, retry = false, maxRetries = 3 } = options

        try {
            if (retry) {
                return await retryWithBackoff(fn, maxRetries)
            } else {
                return await fn()
            }
        } catch (error) {
            if (!silent) {
                handleLLMError(error)
            }
            throw error
        }
    }

    return {
        handleLLMError,
        handleAPIKeyMissing,
        retryWithBackoff,
        withErrorHandling,
        showError: errorStore.showError,
        dismissError: errorStore.dismissError
    }
}
