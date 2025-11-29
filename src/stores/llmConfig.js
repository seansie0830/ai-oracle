import { defineStore } from 'pinia'

export const useLLMConfigStore = defineStore('llmConfig', {
  state: () => ({
    provider: 'gemini', // default provider
    apiKey: '',
    isConfigured: false,
    persistKeys: false, // controls whether to persist API keys
  }),

  getters: {
    providerName: (state) => {
      const names = {
        gemini: 'Google Gemini',
        xai: 'xAI (Grok)',
        groq: 'Groq',
        openrouter: 'OpenRouter'
      }
      return names[state.provider] || 'Unknown'
    },
    hasValidConfig: (state) => {
      return state.provider && state.apiKey.length > 0
    },
    isPersistent: (state) => state.persistKeys
  },

  actions: {
    setProvider(provider) {
      this.provider = provider
    },
    setApiKey(apiKey) {
      this.apiKey = apiKey
      this.isConfigured = apiKey.length > 0
    },
    updateConfig(provider, apiKey, persist = false) {
      this.provider = provider
      this.apiKey = apiKey
      this.isConfigured = apiKey.length > 0
      this.persistKeys = persist

      // Handle localStorage persistence
      if (persist) {
        // Store all config including API key
        localStorage.setItem('llmConfig', JSON.stringify({
          provider,
          apiKey,
          persistKeys: true
        }))
      } else {
        // Only store provider preference, not API key
        localStorage.setItem('llmConfig', JSON.stringify({
          provider,
          persistKeys: false
        }))
      }
    },
    clearConfig() {
      this.apiKey = ''
      this.isConfigured = false
      this.persistKeys = false
      localStorage.removeItem('llmConfig')
    },
    togglePersistence(enable) {
      this.persistKeys = enable
      this.updateConfig(this.provider, this.apiKey, enable)
    },
    // Load config from localStorage on init
    loadFromStorage() {
      const stored = localStorage.getItem('llmConfig')
      if (stored) {
        try {
          const config = JSON.parse(stored)
          this.provider = config.provider || 'gemini'
          this.persistKeys = config.persistKeys || false

          // Only restore API key if persistence was enabled
          if (config.persistKeys && config.apiKey) {
            this.apiKey = config.apiKey
            this.isConfigured = true
          }
        } catch (e) {
          console.error('Failed to load LLM config:', e)
        }
      }
    }
  }
})
