import { defineStore } from 'pinia'

export const useLLMConfigStore = defineStore('llmConfig', {
  state: () => ({
    provider: 'gemini', // default provider
    apiKey: '',
    selectedModel: '', // selected model for the provider
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
      return state.provider && state.apiKey.length > 0 && state.selectedModel.length > 0
    },
    isPersistent: (state) => state.persistKeys,
    // Available models for each provider (using placeholder names)
    availableModels: (state) => {
      const models = {
        gemini: [
          { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)', description: 'Fastest multimodal model' },
          { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable model' },
          { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and versatile' },
          { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', description: 'Legacy model' }
        ],
        xai: [
          { id: 'grok-beta', name: 'Grok Beta', description: 'Latest Grok model' },
          { id: 'grok-2-latest', name: 'Grok 2', description: 'Most powerful model' },
          { id: 'grok-vision-beta', name: 'Grok Vision', description: 'Vision-capable model' }
        ],
        groq: [
          { id: 'llama-3.1-405b-reasoning', name: 'Llama 3.1 405B', description: 'Largest and most capable' },
          { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', description: 'Versatile model' },
          { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', description: 'Fast instant responses' },
          { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Mixture of experts' },
          { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: 'Efficient instruction model' }
        ],
        openrouter: [
          { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', description: 'OpenAI flagship' },
          { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Anthropic latest' },
          { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', description: 'Google advanced' },
          { id: 'meta-llama/llama-3.1-405b', name: 'Llama 3.1 405B', description: 'Meta open source' },
          { id: 'mistralai/mistral-large', name: 'Mistral Large', description: 'Mistral flagship' }
        ]
      }
      return models[state.provider] || []
    }
  },

  actions: {
    setProvider(provider) {
      this.provider = provider
      // Reset model when provider changes
      this.selectedModel = ''
    },
    setApiKey(apiKey) {
      this.apiKey = apiKey
      this.isConfigured = apiKey.length > 0 && this.selectedModel.length > 0
    },
    setModel(modelId) {
      this.selectedModel = modelId
      this.isConfigured = this.apiKey.length > 0 && modelId.length > 0
    },
    updateConfig(provider, apiKey, modelId, persist = false) {
      this.provider = provider
      this.apiKey = apiKey
      this.selectedModel = modelId
      this.isConfigured = apiKey.length > 0 && modelId.length > 0
      this.persistKeys = persist

      // Handle localStorage persistence
      if (persist) {
        // Store all config including API key
        localStorage.setItem('llmConfig', JSON.stringify({
          provider,
          apiKey,
          selectedModel: modelId,
          persistKeys: true
        }))
      } else {
        // Only store provider preference and model, not API key
        localStorage.setItem('llmConfig', JSON.stringify({
          provider,
          selectedModel: modelId,
          persistKeys: false
        }))
      }
    },
    clearConfig() {
      this.apiKey = ''
      this.selectedModel = ''
      this.isConfigured = false
      this.persistKeys = false
      localStorage.removeItem('llmConfig')
    },
    togglePersistence(enable) {
      this.persistKeys = enable
      this.updateConfig(this.provider, this.apiKey, this.selectedModel, enable)
    },
    // Load config from localStorage on init
    loadFromStorage() {
      const stored = localStorage.getItem('llmConfig')
      if (stored) {
        try {
          const config = JSON.parse(stored)
          this.provider = config.provider || 'gemini'
          this.selectedModel = config.selectedModel || ''
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
