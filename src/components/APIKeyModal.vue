<script setup>
import { ref, computed, watch } from 'vue'
import { useLLMConfigStore } from '@/stores/llmConfig'

// Props and Emits
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

// Store
const llmConfig = useLLMConfigStore()

// Local state
const selectedProvider = ref(llmConfig.provider)
const enteredKey = ref(llmConfig.apiKey)
const selectedModel = ref(llmConfig.selectedModel)
const showKey = ref(false)
const trustDevice = ref(llmConfig.persistKeys)
const showHelp = ref(false)
const modelSearchQuery = ref('')
const isModelDropdownOpen = ref(false)

// Provider metadata
const PROVIDERS = {
  gemini: {
    label: 'Google Gemini',
    icon: '✨',
    placeholder: 'Enter your Gemini API key (AIza...)',
    helpUrl: 'https://aistudio.google.com/app/apikey'
  },
  xai: {
    label: 'xAI (Grok)',
    icon: '🚀',
    placeholder: 'Enter your xAI API key',
    helpUrl: 'https://x.ai/api'
  },
  groq: {
    label: 'Groq',
    icon: '⚡',
    placeholder: 'Enter your Groq API key',
    helpUrl: 'https://console.groq.com/keys'
  },
  openrouter: {
    label: 'OpenRouter',
    icon: '🔀',
    placeholder: 'Enter your OpenRouter API key',
    helpUrl: 'https://openrouter.ai/keys'
  }
}

// Computed
const currentProvider = computed(() => PROVIDERS[selectedProvider.value])
const availableModels = computed(() => llmConfig.availableModels)
const filteredModels = computed(() => {
  if (!modelSearchQuery.value) return availableModels.value
  const query = modelSearchQuery.value.toLowerCase()
  return availableModels.value.filter(model => 
    model.name.toLowerCase().includes(query) || 
    model.description.toLowerCase().includes(query) ||
    model.id.toLowerCase().includes(query)
  )
})
const selectedModelName = computed(() => {
  const model = availableModels.value.find(m => m.id === selectedModel.value)
  return model ? model.name : 'Select a model...'
})
const canSave = computed(() => enteredKey.value.trim().length > 0 && selectedModel.value.trim().length > 0)

// Methods
function selectProvider(provider) {
  selectedProvider.value = provider
  // Reset model selection when provider changes
  selectedModel.value = ''
  modelSearchQuery.value = ''
}

function selectModel(modelId) {
  selectedModel.value = modelId
  isModelDropdownOpen.value = false
  modelSearchQuery.value = ''
}

function toggleModelDropdown() {
  isModelDropdownOpen.value = !isModelDropdownOpen.value
  if (!isModelDropdownOpen.value) {
    modelSearchQuery.value = ''
  }
}

function toggleKeyVisibility() {
  showKey.value = !showKey.value
}

function saveConfig() {
  if (!canSave.value) return
  
  llmConfig.updateConfig(
    selectedProvider.value,
    enteredKey.value.trim(),
    selectedModel.value,
    trustDevice.value
  )
  
  emit('save', {
    provider: selectedProvider.value,
    apiKey: enteredKey.value.trim(),
    model: selectedModel.value,
    persist: trustDevice.value
  })
  emit('close')
}

function cancel() {
  // Reset to stored values
  selectedProvider.value = llmConfig.provider
  enteredKey.value = llmConfig.apiKey
  selectedModel.value = llmConfig.selectedModel
  trustDevice.value = llmConfig.persistKeys
  isModelDropdownOpen.value = false
  modelSearchQuery.value = ''
  emit('close')
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    cancel()
  }
}

function handleEscape(event) {
  if (event.key === 'Escape') {
    cancel()
  }
}

// Watch for modal open to add/remove event listener
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleEscape)
    // Load current values when opening
    selectedProvider.value = llmConfig.provider
    enteredKey.value = llmConfig.apiKey
    selectedModel.value = llmConfig.selectedModel
    trustDevice.value = llmConfig.persistKeys
    isModelDropdownOpen.value = false
    modelSearchQuery.value = ''
  } else {
    document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto
             bg-[rgba(0,0,0,0.85)] backdrop-blur-lg px-4 py-8"
      @click="handleBackdropClick"
    >
      <!-- Modal Panel -->
      <div
        class="glass-panel gilded-border divine-glow
               w-full max-w-2xl rounded-3xl py-8 px-10 
               transform transition-all duration-500 ease-out"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h2 
              style="font-family: var(--font-family-display);"
              class="text-3xl font-black text-[var(--color-secondary-champagne-gold)] 
                     tracking-[0.2em] uppercase mb-2"
            >
              ✦ Configure Your Oracle ✦
            </h2>
            <p 
              style="font-family: var(--font-family-serif);"
              class="text-[var(--color-text-tertiary)] text-sm italic"
            >
              Select your LLM provider and enter your API key
            </p>
          </div>
          
          <!-- Close Button -->
          <button
            @click="cancel"
            class="text-[var(--color-text-tertiary)] hover:text-[var(--color-secondary-champagne-gold)]
                   transition-all duration-300 text-2xl ml-4 hover:rotate-90"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <!-- Provider Selection -->
        <div class="mb-6">
          <label 
            style="font-family: var(--font-family-serif);"
            class="block text-[var(--color-text-secondary)] text-lg font-light mb-3"
          >
            Choose Provider:
          </label>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              v-for="(provider, key) in PROVIDERS"
              :key="key"
              @click="selectProvider(key)"
              class="rounded-2xl py-4 px-3 text-center transition-all duration-300 transform"
              :class="selectedProvider === key 
                ? 'border-4 border-[var(--color-secondary-champagne-gold)] bg-gradient-to-br from-[var(--color-primary-amethyst)]/40 to-[var(--color-primary-royal-purple)]/30 shadow-[0_0_50px_rgba(244,228,193,1),0_0_30px_rgba(244,228,193,0.7),0_0_15px_rgba(157,78,221,0.5)] scale-110 opacity-100 backdrop-blur-xl' 
                : 'border border-[rgba(244,228,193,0.1)] bg-black/50 opacity-60 grayscale hover:opacity-80 hover:grayscale-0 hover:border-[rgba(244,228,193,0.25)] hover:scale-105 backdrop-blur-md'"
            >
              <div 
                class="text-3xl mb-2 transition-transform duration-300"
                :class="selectedProvider === key ? 'scale-125 drop-shadow-[0_0_12px_rgba(244,228,193,0.9)]' : ''"
              >
                {{ provider.icon }}
              </div>
              <div 
                style="font-family: var(--font-family-sans);"
                class="text-sm font-medium transition-colors duration-300"
                :class="selectedProvider === key 
                  ? 'text-[var(--color-secondary-champagne-gold)] font-black uppercase tracking-wider drop-shadow-[0_2px_10px_rgba(244,228,193,0.7)]' 
                  : 'text-[var(--color-text-tertiary)]'"
              >
                {{ provider.label.split(' ')[0] }}
              </div>
            </button>
          </div>
        </div>

        <!-- Model Selection -->
        <div class="mb-6">
          <label 
            style="font-family: var(--font-family-serif);"
            class="block text-[var(--color-text-secondary)] text-lg font-light mb-3"
          >
            Choose Model:
          </label>
          
          <div class="relative">
            <!-- Model Dropdown Button -->
            <button
              @click="toggleModelDropdown"
              type="button"
              class="w-full rounded-2xl glass-panel py-4 px-6 pr-12
                     border-2 border-[rgba(244,228,193,0.25)]
                     text-[var(--color-text-secondary)] text-base text-left
                     hover:border-[rgba(244,228,193,0.5)]
                     focus:outline-none focus:border-[rgba(244,228,193,0.5)]
                     focus:shadow-[0_0_30px_rgba(157,78,221,0.4)]
                     transition-all duration-500 ease-out"
              style="font-family: var(--font-family-sans);"
            >
              <span :class="selectedModel ? '' : 'text-[var(--color-text-tertiary)]/40'">
                {{ selectedModelName }}
              </span>
              <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-tertiary)] transition-transform duration-300"
                    :class="isModelDropdownOpen ? 'rotate-180' : ''">
                ▼
              </span>
            </button>

            <!-- Dropdown Menu -->
            <Transition name="dropdown">
              <div
                v-if="isModelDropdownOpen"
                class="absolute z-10 w-full mt-2 rounded-2xl glass-panel 
                       border-2 border-[rgba(244,228,193,0.25)]
                       shadow-[0_0_50px_rgba(157,78,221,0.3)]
                       overflow-hidden"
              >
                <!-- Search Input -->
                <div class="p-3 border-b border-[rgba(244,228,193,0.15)]">
                  <input
                    v-model="modelSearchQuery"
                    type="text"
                    placeholder="Search models..."
                    class="w-full rounded-xl glass-panel py-2 px-4
                           border border-[rgba(244,228,193,0.15)]
                           text-[var(--color-text-secondary)] text-sm
                           placeholder-[var(--color-text-tertiary)]/40
                           focus:outline-none focus:border-[rgba(244,228,193,0.35)]
                           transition-all duration-300"
                    style="font-family: var(--font-family-sans);"
                    @click.stop
                  />
                </div>

                <!-- Model List -->
                <div class="max-h-64 overflow-y-auto custom-scrollbar">
                  <button
                    v-for="model in filteredModels"
                    :key="model.id"
                    @click="selectModel(model.id)"
                    class="w-full text-left px-4 py-3 transition-all duration-300
                           hover:bg-[rgba(244,228,193,0.1)]
                           border-b border-[rgba(244,228,193,0.05)] last:border-b-0"
                    :class="selectedModel === model.id ? 'bg-[rgba(244,228,193,0.15)]' : ''"
                  >
                    <div class="flex items-start gap-2">
                      <span v-if="selectedModel === model.id" 
                            class="text-[var(--color-secondary-champagne-gold)] text-lg mt-0.5">
                        ✓
                      </span>
                      <div class="flex-1">
                        <div 
                          style="font-family: var(--font-family-sans);"
                          class="text-[var(--color-text-secondary)] text-base font-medium"
                          :class="selectedModel === model.id ? 'text-[var(--color-secondary-champagne-gold)]' : ''"
                        >
                          {{ model.name }}
                        </div>
                        <div 
                          style="font-family: var(--font-family-sans);"
                          class="text-[var(--color-text-tertiary)] text-xs mt-0.5"
                        >
                          {{ model.description }}
                        </div>
                        <div 
                          style="font-family: var(--font-family-sans);"
                          class="text-[var(--color-text-tertiary)]/50 text-xs mt-0.5 font-mono"
                        >
                          {{ model.id }}
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  <!-- No Results Message -->
                  <div v-if="filteredModels.length === 0" 
                       class="px-4 py-6 text-center text-[var(--color-text-tertiary)] text-sm"
                       style="font-family: var(--font-family-sans);">
                    No models found matching "{{ modelSearchQuery }}"
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- API Key Input -->
        <div class="mb-6">
          <label 
            style="font-family: var(--font-family-serif);"
            class="block text-[var(--color-text-secondary)] text-lg font-light mb-3"
          >
            API Key:
          </label>
          
          <div class="relative">
            <input
              v-model="enteredKey"
              :type="showKey ? 'text' : 'password'"
              :placeholder="currentProvider.placeholder"
              class="w-full rounded-2xl glass-panel py-4 px-6 pr-14
                     border-2 border-[rgba(244,228,193,0.25)]
                     text-[var(--color-text-secondary)] text-base
                     placeholder-[var(--color-text-tertiary)]/40
                     focus:outline-none focus:border-[rgba(244,228,193,0.5)]
                     focus:shadow-[0_0_30px_rgba(157,78,221,0.4)]
                     transition-all duration-500 ease-out"
              style="font-family: var(--font-family-sans);"
            />
            
            <!-- Toggle Visibility Button -->
            <button
              @click="toggleKeyVisibility"
              class="absolute right-4 top-1/2 transform -translate-y-1/2
                     text-[var(--color-text-tertiary)] hover:text-[var(--color-secondary-champagne-gold)]
                     transition-all duration-300 text-xl"
              aria-label="Toggle key visibility"
            >
              {{ showKey ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <!-- Trust Device Checkbox -->
        <div class="mb-6 glass-panel rounded-2xl py-4 px-6 border border-[rgba(244,228,193,0.15)]">
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="trustDevice"
              type="checkbox"
              class="mt-1 w-5 h-5 rounded border-2 border-[var(--color-secondary-champagne-gold)]
                     bg-transparent checked:bg-[var(--color-primary-amethyst)]
                     focus:ring-2 focus:ring-[var(--color-primary-amethyst)]
                     transition-all duration-300 cursor-pointer"
            />
            <div class="flex-1">
              <div 
                style="font-family: var(--font-family-sans);"
                class="text-[var(--color-text-secondary)] text-base font-medium"
              >
                Trust this device (persist API key)
              </div>
              <div 
                style="font-family: var(--font-family-sans);"
                class="text-[var(--color-tertiary-emerald)] text-sm mt-1 flex items-center gap-2"
              >
                <span>⚠️</span>
                <span>Only enable on your personal, secure device</span>
              </div>
            </div>
          </label>
        </div>

        <!-- Help Section -->
        <div class="mb-6">
          <button
            @click="showHelp = !showHelp"
            class="text-[var(--color-text-tertiary)] hover:text-[var(--color-secondary-champagne-gold)]
                   transition-all duration-300 text-sm flex items-center gap-2"
            style="font-family: var(--font-family-sans);"
          >
            <span>{{ showHelp ? '▼' : '▶' }}</span>
            <span>How to get your API key</span>
          </button>
          
          <Transition name="slide">
            <div
              v-if="showHelp"
              class="mt-3 glass-panel rounded-2xl py-3 px-5 border border-[rgba(244,228,193,0.15)]"
            >
              <a
                :href="currentProvider.helpUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[var(--color-tertiary-sapphire)] hover:text-[var(--color-secondary-champagne-gold)]
                       transition-all duration-300 text-sm underline"
                style="font-family: var(--font-family-sans);"
              >
                {{ currentProvider.label }} API Key Instructions →
              </a>
            </div>
          </Transition>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <!-- Save Button -->
          <button
            @click="saveConfig"
            :disabled="!canSave"
            style="font-family: var(--font-family-display);"
            class="flex-1 rounded-2xl font-bold text-base py-4 px-8
                   bg-gradient-to-r from-[var(--color-secondary-rose-gold)] 
                   via-[var(--color-secondary-champagne-gold)] 
                   to-[var(--color-secondary-burnished-bronze)]
                   text-[var(--color-background-pure-black)] 
                   uppercase tracking-[0.2em]
                   shadow-[0_0_20px_rgba(244,228,193,0.5)]
                   hover:shadow-[0_0_40px_rgba(244,228,193,0.7)]
                   hover:scale-[1.02]
                   disabled:opacity-40 disabled:cursor-not-allowed
                   disabled:hover:scale-100 disabled:hover:shadow-none
                   transition-all duration-500 ease-out"
          >
            ✨ Save & Close
          </button>
          
          <!-- Cancel Button -->
          <button
            @click="cancel"
            style="font-family: var(--font-family-display);"
            class="rounded-2xl font-bold text-base py-4 px-8
                   text-[var(--color-text-tertiary)]
                   border-2 border-[rgba(244,228,193,0.25)]
                   uppercase tracking-[0.2em]
                   hover:border-[rgba(244,228,193,0.5)]
                   hover:text-[var(--color-text-secondary)]
                   hover:shadow-[0_0_20px_rgba(192,192,192,0.3)]
                   transition-all duration-500 ease-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-active .glass-panel,
.modal-leave-active .glass-panel {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .glass-panel,
.modal-leave-to .glass-panel {
  transform: scale(0.9);
  opacity: 0;
}

/* Help Section Slide */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Dropdown Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(244, 228, 193, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(244, 228, 193, 0.5);
}
</style>
