/**
 * Error Handler Store (Pinia)
 * 
 * Global state management for error handling and ErrorModal display.
 * This store manages the current error, error history, and modal visibility.
 */

import { defineStore } from 'pinia'

/**
 * Error Type Configurations
 * Each error type defines its severity, visual presentation, available actions,
 * and unique design properties for type-specific styling.
 */
export const ERROR_TYPES = {
    // API & Network Errors
    API_KEY_INVALID: {
        severity: 'error',
        icon: '🔑',
        title: 'Invalid API Key',
        defaultMessage: 'Your API key appears to be invalid or expired.',
        actions: ['reconfigure', 'dismiss'],
        primaryAction: 'reconfigure',
        // Design Config
        primaryColor: '#d97706',
        glowColor: 'rgba(217, 119, 6, 0.5)',
        borderStyle: 'dashed',
        iconAnimation: 'shake',
        suggestions: [
            'Verify key format matches your provider',
            'Check expiration date in provider console',
            'Try regenerating your API key'
        ]
    },
    API_KEY_MISSING: {
        severity: 'warning',
        icon: '🔮',
        title: 'API Key Required',
        defaultMessage: 'Welcome, Seeker! To begin your journey with the Mystic Oracle, please configure your LLM provider.',
        actions: ['configure', 'dismiss'],
        primaryAction: 'configure',
        // Design Config
        primaryColor: '#9d4edd',
        glowColor: 'rgba(157, 78, 221, 0.4)',
        borderStyle: 'gradient',
        iconAnimation: 'float',
        tone: 'welcoming',
        providerList: ['Google Gemini', 'xAI (Grok)', 'Groq', 'OpenRouter']
    },
    NETWORK_ERROR: {
        severity: 'error',
        icon: '🌐',
        title: 'Connection Failed',
        defaultMessage: 'Unable to reach the server. Please check your internet connection.',
        actions: ['retry', 'dismiss'],
        primaryAction: 'retry',
        retryable: true,
        // Design Config
        primaryColor: '#0ea5e9',
        glowColor: 'rgba(14, 165, 233, 0.5)',
        borderStyle: 'dotted',
        iconAnimation: 'flicker',
        suggestions: [
            'Check your internet connection',
            'Try disabling VPN or proxy',
            'Check firewall settings'
        ]
    },
    RATE_LIMIT: {
        severity: 'warning',
        icon: '⏱️',
        title: 'Rate Limit Exceeded',
        defaultMessage: 'You\'ve exceeded the API rate limit. Please wait before trying again.',
        actions: ['wait', 'dismiss'],
        showCooldown: true,
        // Design Config
        primaryColor: '#eab308',
        glowColor: 'rgba(234, 179, 8, 0.5)',
        borderStyle: 'solid',
        iconAnimation: 'pulse',
        showTimer: true,
        showProgress: true
    },

    // LLM Service Errors
    LLM_TIMEOUT: {
        severity: 'error',
        icon: '⏰',
        title: 'Request Timeout',
        defaultMessage: 'The request took too long to complete. Please try again.',
        actions: ['retry', 'dismiss'],
        primaryAction: 'retry',
        retryable: true,
        // Design Config
        primaryColor: '#f97316',
        glowColor: 'rgba(249, 115, 22, 0.5)',
        borderStyle: 'double',
        iconAnimation: 'shake',
        suggestions: [
            'Your query may be too complex',
            'Try breaking it into smaller parts',
            'Server might be under heavy load'
        ]
    },
    LLM_STREAMING_ERROR: {
        severity: 'error',
        icon: '📡',
        title: 'Streaming Interrupted',
        defaultMessage: 'Connection lost while streaming the response.',
        actions: ['retry', 'dismiss'],
        primaryAction: 'retry',
        retryable: true,
        // Design Config
        primaryColor: '#a855f7',
        glowColor: 'rgba(168, 85, 247, 0.5)',
        borderStyle: 'animated',
        iconAnimation: 'glitch',
        showPartialContent: true
    },
    LLM_INVALID_RESPONSE: {
        severity: 'error',
        icon: '❌',
        title: 'Invalid Response',
        defaultMessage: 'The LLM returned an unexpected response format.',
        actions: ['retry', 'report', 'dismiss'],
        primaryAction: 'retry',
        // Design Config
        primaryColor: '#dc2626',
        glowColor: 'rgba(220, 38, 38, 0.5)',
        borderStyle: 'solid',
        iconAnimation: 'shake',
        developerFocused: true
    },

    // Validation & User Input Errors
    VALIDATION_ERROR: {
        severity: 'warning',
        icon: '⚠️',
        title: 'Validation Failed',
        defaultMessage: 'Please check your input and try again.',
        actions: ['dismiss'],
        primaryAction: 'dismiss',
        // Design Config
        primaryColor: '#ec4899',
        glowColor: 'rgba(236, 72, 153, 0.5)',
        borderStyle: 'soft',
        iconAnimation: 'bounce',
        tone: 'friendly'
    },

    // System & Component Errors
    COMPONENT_LOAD_ERROR: {
        severity: 'error',
        icon: '🔧',
        title: 'Component Failed to Load',
        defaultMessage: 'A required component failed to load. Please refresh the page.',
        actions: ['refresh', 'dismiss'],
        primaryAction: 'refresh',
        // Design Config
        primaryColor: '#14b8a6',
        glowColor: 'rgba(20, 184, 166, 0.5)',
        borderStyle: 'tech',
        iconAnimation: 'spin',
        suggestions: [
            'Refresh the page',
            'Clear browser cache',
            'Check browser console for details'
        ]
    },
    TAROT_DRAW_ERROR: {
        severity: 'error',
        icon: '🃏',
        title: 'Tarot Draw Failed',
        defaultMessage: 'The cards resist being drawn... The cosmic energies are misaligned.',
        actions: ['retry', 'dismiss'],
        primaryAction: 'retry',
        retryable: true,
        // Design Config
        primaryColor: '#9333ea',
        glowColor: 'rgba(147, 51, 234, 0.5)',
        borderStyle: 'ornate',
        iconAnimation: 'spin',
        tone: 'mystical',
        mysticalMessage: 'Please wait a moment and try again. The oracle suggests patience...'
    },

    // Mock Service Errors (for testing)
    MOCK_MYSTICAL_ERROR: {
        severity: 'error',
        icon: '🌙',
        title: 'Mystical Connection Disrupted',
        defaultMessage: 'The cosmic energies are in flux. The oracle cannot divine at this moment.',
        actions: ['retry', 'dismiss'],
        primaryAction: 'retry',
        retryable: true,
        // Design Config
        primaryColor: '#6366f1',
        glowColor: 'rgba(99, 102, 241, 0.5)',
        borderStyle: 'celestial',
        iconAnimation: 'float',
        tone: 'mystical',
        isMockError: true
    },

    // Generic Errors
    UNKNOWN_ERROR: {
        severity: 'error',
        icon: '❓',
        title: 'Unexpected Error',
        defaultMessage: 'An unexpected error occurred. Please try again.',
        actions: ['retry', 'report', 'dismiss'],
        primaryAction: 'retry',
        // Design Config
        primaryColor: '#8b5cf6',
        glowColor: 'rgba(139, 92, 246, 0.5)',
        borderStyle: 'gradient',
        iconAnimation: 'pulse'
    }
}

export const useErrorStore = defineStore('errorHandler', {
    state: () => ({
        currentError: null,
        errorHistory: [], // Last 10 errors
        isModalOpen: false,
        autoRetryCount: 0,
        maxAutoRetries: 2
    }),

    getters: {
        hasActiveError: (state) => state.currentError !== null,

        errorSeverity: (state) => state.currentError?.severity || 'error',

        canRetry: (state) => {
            if (!state.currentError) return false
            const errorConfig = ERROR_TYPES[state.currentError.type]
            return errorConfig?.retryable && state.autoRetryCount < state.maxAutoRetries
        },

        recentErrors: (state) => state.errorHistory.slice(0, 10),

        errorConfig: (state) => {
            if (!state.currentError) return null
            return ERROR_TYPES[state.currentError.type] || ERROR_TYPES.UNKNOWN_ERROR
        }
    },

    actions: {
        /**
         * Display an error in the modal
         * @param {string} errorType - Key from ERROR_TYPES
         * @param {string|null} customMessage - Override default message
         * @param {object} metadata - Additional error context (stack, codes, etc.)
         */
        showError(errorType, customMessage = null, metadata = {}) {
            const errorConfig = ERROR_TYPES[errorType] || ERROR_TYPES.UNKNOWN_ERROR

            this.currentError = {
                type: errorType,
                ...errorConfig, // Include all config properties
                message: customMessage || errorConfig.defaultMessage,
                timestamp: new Date().toISOString(),
                metadata // Can include stack trace, error codes, etc.
            }

            // Add to history
            this.errorHistory.unshift({ ...this.currentError })
            if (this.errorHistory.length > 10) {
                this.errorHistory = this.errorHistory.slice(0, 10)
            }

            this.isModalOpen = true

            console.warn('[ErrorStore] Error shown:', errorType, this.currentError)
        },

        /**
         * Dismiss the current error and close modal
         */
        dismissError() {
            this.currentError = null
            this.isModalOpen = false
            this.autoRetryCount = 0
        },

        /**
         * Increment retry counter for auto-retry logic
         */
        incrementRetryCount() {
            this.autoRetryCount++
        },

        /**
         * Reset retry counter (call after successful operation)
         */
        resetRetryCount() {
            this.autoRetryCount = 0
        },

        /**
         * Clear error history
         */
        clearHistory() {
            this.errorHistory = []
        }
    }
})
