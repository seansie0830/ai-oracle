<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useLLMConfigStore } from '@/stores/llmConfig'
import { useI18nStore } from '@/stores/i18n'
import RealLLMService from '@/services/llm/RealLLMService'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  isOpen: Boolean,
  isDebugMode: Boolean
})

const emit = defineEmits(['close', 'save'])

const llmConfig = useLLMConfigStore()
const i18nStore = useI18nStore()
const { t, locale } = useI18n()

// State
const selectedProvider = ref('gemini')
const enteredKey = ref('')
const selectedModel = ref('')
const persistKeys = ref(false)
const isLoadingModels = ref(false)
const fetchError = ref('')
const showKey = ref(false)

// Providers Metadata
const PROVIDERS = {
  gemini: {
    id: 'gemini',
    label: 'Google Gemini',
    icon: '✨',
    placeholder: 'Enter your Gemini API key (AIza...)',
    helpUrl: 'https://aistudio.google.com/app/apikey'
  }
  ,
  huggingface: {
    id: 'huggingface',
    label: 'HuggingFace',
    icon: '🤗',
    placeholder: 'Enter your HuggingFace token (hf_...)',
    helpUrl: 'https://huggingface.co/settings/tokens'
  },
  groq: {
    id: 'groq',
    label: 'Groq',
    icon: '⚡',
    placeholder: 'Enter your Groq API key',
    helpUrl: 'https://console.groq.com/keys'
  },
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    icon: '🔀',
    placeholder: 'Enter your OpenRouter API key',
    helpUrl: 'https://openrouter.ai/keys'}
    

}

// Computed
const currentProvider = computed(() => PROVIDERS[selectedProvider.value])
const availableModels = computed(() => llmConfig.availableModels)
const hasModels = computed(() => availableModels.value && availableModels.value.length > 0)

// Watchers

// Reset state when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedProvider.value = llmConfig.provider
    enteredKey.value = llmConfig.apiKey
    selectedModel.value = llmConfig.selectedModel
    persistKeys.value = llmConfig.persistKeys
    fetchError.value = ''
    
    // Sync language from store
    selectedLanguage.value = i18nStore.language
    
    // If we have a key but no models, try fetching
    if (enteredKey.value && (!availableModels.value || availableModels.value.length === 0)) {
      fetchModels()
    }
  }
})

// Watch provider change to clear models and key if needed (optional, maybe keep key if switching same provider type?)
watch(selectedProvider, () => {
  // Reset model selection on provider change
  selectedModel.value = ''
  llmConfig.setAvailableModels([]) // Clear models in store
  fetchError.value = ''
  
  // If we have a key for this new provider (re-entered), fetch models
  // Or if it's OpenRouter (public list)
  if (enteredKey.value || selectedProvider.value === 'openrouter') {
      fetchModels()
  }
})

// Watch key to auto-fetch models
let debounceTimer = null
watch(enteredKey, (newKey) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  
  if (!newKey || newKey.length < 10) {
    // OpenRouter allows public listing, so we can fetch without key
    if (selectedProvider.value === 'openrouter') {
      fetchModels()
      return
    }
    llmConfig.setAvailableModels([])
    return
  }

  debounceTimer = setTimeout(() => {
    fetchModels()
  }, 800) // Debounce fetch
})

async function fetchModels() {
  // Allow OpenRouter to fetch without key
  if (!enteredKey.value && selectedProvider.value !== 'openrouter') return
  
  isLoadingModels.value = true
  fetchError.value = ''
  
  try {
    const models = await RealLLMService.fetchAvailableModels(selectedProvider.value, enteredKey.value)
    llmConfig.setAvailableModels(models)
    
    // Auto-select first model if none selected or current selection not in list
    if (models.length > 0) {
      const currentExists = models.find(m => m.id === selectedModel.value)
      if (!currentExists) {
        selectedModel.value = models[0].id
      }
    }
  } catch (error) {
    console.error("Failed to fetch models:", error)
    fetchError.value = "Failed to fetch models. Check your API Key."
    llmConfig.setAvailableModels([])
  } finally {
    isLoadingModels.value = false
  }
}

const isDropdownOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = ref(null)
const dropdownRef = ref(null)

const filteredModels = computed(() => {
  if (!searchQuery.value) return availableModels.value
  const query = searchQuery.value.toLowerCase()
  return availableModels.value.filter(m => 
    m.name.toLowerCase().includes(query) || 
    m.id.toLowerCase().includes(query)
  )
})

const selectedModelName = computed(() => {
  const model = availableModels.value.find(m => m.id === selectedModel.value)
  return model ? model.name : ''
})

function toggleDropdown() {
  if (isLoadingModels.value || !hasModels.value) return
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    setTimeout(() => {
      searchInputRef.value?.focus()
    }, 100)
  } else {
    searchQuery.value = ''
  }
}

function selectModel(model) {
  selectedModel.value = model.id
  isDropdownOpen.value = false
  searchQuery.value = ''
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  i18nStore.initLanguage()
})

// Clean up listener (optional but good practice)
// onUnmounted(() => {
//   document.removeEventListener('click', handleClickOutside)
// })

// Toast notification for debug mode clicks
const showDebugToast = ref(false)
let toastTimer = null

// Language settings
const selectedLanguage = ref('en')
const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'

  },
  {
    code: 'zh-TW',
    name: 'Traditional Chinese (Taiwan)',
    nativeName: '繁體中文',
    flag: '🇹🇼'
  }
]

async function handleLanguageChange(languageCode) {
  selectedLanguage.value = languageCode
  await i18nStore.setLanguage(languageCode)
  locale.value = languageCode
}

function handleDebugModeClick() {
  if (!props.isDebugMode) return
  
  // Show toast
  showDebugToast.value = true
  
  // Clear existing timer
  if (toastTimer) clearTimeout(toastTimer)
  
  // Auto-hide after 4 seconds
  toastTimer = setTimeout(() => {
    showDebugToast.value = false
  }, 4000)
}

function dismissToast() {
  showDebugToast.value = false
  if (toastTimer) clearTimeout(toastTimer)
}

function handleSave() {
  if (!enteredKey.value) return
  
  llmConfig.updateConfig(
    selectedProvider.value, 
    enteredKey.value, 
    selectedModel.value,
    persistKeys.value
  )
  
  // Language is already saved via handleLanguageChange -> store action
  
  emit('save')
}

function handleClose() {
  emit('close')
  dismissToast() // Clear toast when closing
}
</script>
<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-[rgba(0,0,0,0.85)] backdrop-blur-lg" @click="handleClose"></div>

      <!-- Modal Panel -->
      <div class="relative w-full max-w-lg glass-panel gilded-border 
                  bg-gradient-to-br from-[rgba(45,20,60,0.9)] to-[rgba(20,10,30,0.95)]
                  rounded-3xl shadow-[0_0_50px_rgba(157,78,221,0.2)]
                  transform transition-all duration-300 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <!-- Header -->
        <div class="p-6 border-b border-[rgba(244,228,193,0.1)] flex justify-between items-start">
          <div>
            <h2 style="font-family: var(--font-family-display);" 
                class="text-2xl text-[var(--color-secondary-champagne-gold)] tracking-[0.15em] uppercase font-bold">
              {{ t('apiKeyModal.title') }}
            </h2>
            <p class="text-[var(--color-text-tertiary)] text-sm mt-1 font-light">
              {{ t('apiKeyModal.subtitle') }}
            </p>
          </div>
          <button @click="handleClose" 
                  class="text-[var(--color-text-tertiary)] hover:text-[var(--color-secondary-rose-gold)] transition-colors text-2xl leading-none">
            &times;
          </button>
        </div>

        <!-- Debug Mode Banner -->
        <div v-if="isDebugMode" class="mx-6 mt-4 p-4 rounded-xl bg-gradient-to-r from-[rgba(59,130,246,0.15)] to-[rgba(99,102,241,0.15)] border-2 border-[rgba(59,130,246,0.4)]">
          <div class="flex items-start gap-3">
            <div class="text-2xl">🧪</div>
            <div class="flex-1">
              <h3 class="text-[var(--color-text-primary)] font-bold text-sm mb-1">{{ t('common.debugMode') }}</h3>
              <p class="text-[var(--color-text-secondary)] text-xs leading-relaxed mb-3">
                {{ t('apiKeyModal.debugMessage') }}
              </p>
              <a :href="window.location.pathname" 
                 class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(59,130,246,0.2)] hover:bg-[rgba(59,130,246,0.3)] border border-[rgba(59,130,246,0.5)] text-[var(--color-text-primary)] text-xs font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <span>🚀</span>
                <span>{{ t('common.switchToReal') }}</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 space-y-8" :class="{ 'opacity-50 pointer-events-none': isDebugMode }">
          
          <!-- Provider Selection -->
          <div class="space-y-3">
            <label class="text-[var(--color-text-secondary)] text-sm uppercase tracking-widest opacity-80">
              {{ t('apiKeyModal.chooseProvider') }}
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button 
                v-for="provider in PROVIDERS" 
                :key="provider.id"
                @click="isDebugMode ? handleDebugModeClick() : (selectedProvider = provider.id)"
                :disabled="isDebugMode"
                class="relative p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 group"
                :class="[
                  selectedProvider === provider.id 
                    ? 'bg-[rgba(157,78,221,0.15)] border-[var(--color-secondary-champagne-gold)] shadow-[0_0_20px_rgba(157,78,221,0.3)]' 
                    : 'bg-[rgba(255,255,255,0.03)] border-transparent hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(244,228,193,0.3)]',
                  isDebugMode ? 'cursor-not-allowed' : 'cursor-pointer'
                ]"
                :title="isDebugMode ? t('apiKeyModal.disabledInDebug') : ''"
              >
                <span class="text-2xl filter drop-shadow-lg">{{ provider.icon }}</span>
                <span class="text-sm font-medium text-[var(--color-text-primary)]">{{ provider.label }}</span>
                
                <!-- Active Indicator -->
                <div v-if="selectedProvider === provider.id" 
                     class="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-tertiary-emerald)] shadow-[0_0_8px_var(--color-tertiary-emerald)]"></div>
              </button>
            </div>
          </div>

          <!-- API Key Input -->
          <div class="space-y-3 ">
            <div class="flex justify-between">
              <label class="text-[var(--color-text-secondary)] text-sm uppercase tracking-widest opacity-80">
                {{ t('apiKeyModal.apiKey') }}
              </label>
              <a :href="currentProvider.helpUrl" target="_blank" 
                 class="text-xs text-[var(--color-secondary-champagne-gold)] hover:underline opacity-80 hover:opacity-100 flex items-center gap-1">
                {{ t('apiKeyModal.getKey') }} <span>&nearr;</span>
              </a>
            </div>
            
            <div class="relative group" @click="handleDebugModeClick">
              <input 
                :type="showKey ? 'text' : 'password'"
                v-model="enteredKey"
                :placeholder="currentProvider.placeholder"
                :disabled="isDebugMode"
                :title="isDebugMode ? t('apiKeyModal.disabledInDebug') : ''"
                class="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(244,228,193,0.2)] rounded-xl px-4 py-3 pr-12
                       text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)]/30
                       focus:outline-none focus:border-[var(--color-secondary-champagne-gold)] focus:shadow-[0_0_15px_rgba(244,228,193,0.2)]
                       transition-all duration-300 font-mono text-sm
                       disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button 
                @click.stop="isDebugMode ? handleDebugModeClick() : (showKey = !showKey)"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                :class="{ 'cursor-not-allowed': isDebugMode }"
              >
                {{ showKey ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Model Selection -->
          <div class="space-y-3">
            <label class="text-[var(--color-text-secondary)] text-sm uppercase tracking-widest opacity-80">
              {{ t('apiKeyModal.model') }}
            </label>
            <div class="relative mt-4" ref="dropdownRef">
              <!-- Dropdown Trigger -->
              <button 
                @click="toggleDropdown"
                :disabled="isLoadingModels || !hasModels"
                class="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(244,228,193,0.2)] rounded-xl px-4 py-3 pr-10
                       text-[var(--color-text-primary)] text-left flex items-center justify-between
                       focus:outline-none focus:border-[var(--color-secondary-champagne-gold)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
              >
                <span class="truncate">
                  {{ selectedModelName || (isLoadingModels ? t('apiKeyModal.fetchingModels') : (hasModels ? t('apiKeyModal.selectModel') : t('apiKeyModal.enterKeyToFetch'))) }}
                </span>
                
                <!-- Spinner or Arrow -->
                <div class="pointer-events-none">
                  <div v-if="isLoadingModels" class="animate-spin h-4 w-4 border-2 border-[var(--color-secondary-champagne-gold)] border-t-transparent rounded-full"></div>
                  <span v-else class="text-[var(--color-text-tertiary)]">▼</span>
                </div>
              </button>

              <!-- Dropdown Panel -->
              <Transition name="dropdown-fade">
                <div v-if="isDropdownOpen" 
                     class="absolute z-50 w-full mt-2 bg-[rgba(20,10,30,0.95)] border border-[var(--color-secondary-champagne-gold)] 
                            rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden">
                  
                  <!-- Search Input -->
                  <div class="p-2 border-b border-[rgba(244,228,193,0.1)]">
                    <input 
                      ref="searchInputRef"
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search models..."
                      class="w-full bg-[rgba(255,255,255,0.05)] border border-transparent rounded-lg px-3 py-2
                             text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)]/50 text-sm
                             focus:outline-none focus:border-[rgba(244,228,193,0.3)]
                             transition-all duration-200"
                      @click.stop
                    />
                  </div>

                  <!-- Options List -->
                  <div class="max-h-60 overflow-y-auto custom-scrollbar">
                    <div v-if="filteredModels.length === 0" class="p-4 text-center text-[var(--color-text-tertiary)] text-sm">
                      {{ t('apiKeyModal.noModelsFound') }}
                    </div>
                    <button 
                      v-for="model in filteredModels" 
                      :key="model.id"
                      @click="selectModel(model)"
                      class="w-full text-left px-4 py-3 text-sm transition-colors duration-150
                             hover:bg-[rgba(244,228,193,0.1)] flex items-center justify-between group"
                      :class="selectedModel === model.id ? 'bg-[rgba(157,78,221,0.2)] text-[var(--color-secondary-champagne-gold)]' : 'text-[var(--color-text-secondary)]'"
                    >
                      <span>{{ model.name }}</span>
                      <span v-if="selectedModel === model.id" class="text-[var(--color-secondary-champagne-gold)]">✓</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
            <p v-if="fetchError" class="text-red-400 text-xs mt-1">{{ fetchError }}</p>
          </div>

          <!-- Persistence Option -->
          <div class="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
            <input 
              type="checkbox" 
              id="persist" 
              v-model="persistKeys"
              class="mt-1 accent-[var(--color-secondary-champagne-gold)] w-4 h-4 cursor-pointer" 
            />
            <label for="persist" class="cursor-pointer">
              <span class="block text-[var(--color-text-primary)] text-sm font-medium">{{ t('apiKeyModal.trustDevice') }}</span>
              <span class="block text-[var(--color-text-tertiary)] text-xs mt-0.5">
                {{ t('apiKeyModal.trustDeviceSubtitle') }}
              </span>
            </label>
          </div>

          <!-- Language Selection -->
          <div class="space-y-3">
            <label class="text-[var(--color-text-secondary)] text-sm uppercase tracking-widest opacity-80 ">
              {{ t('apiKeyModal.language') }}
            </label>
            <div class="grid grid-cols-2 gap-3 mt-4">
              <button 
                v-for="language in LANGUAGES" 
                :key="language.code"
                @click="handleLanguageChange(language.code)"
                class="relative p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 group cursor-pointer"
                :class="[
                  selectedLanguage === language.code 
                    ? 'bg-[rgba(157,78,221,0.15)] border-[var(--color-secondary-champagne-gold)] shadow-[0_0_20px_rgba(157,78,221,0.3)]' 
                    : 'bg-[rgba(255,255,255,0.03)] border-transparent hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(244,228,193,0.3)]'
                ]"
              >
                <span class="text-2xl filter drop-shadow-lg">{{ language.flag }}</span>
                <span class="text-sm font-medium text-[var(--color-text-primary)]">{{ language.nativeName }}</span>
                
                <!-- Active Indicator -->
                <div v-if="selectedLanguage === language.code" 
                     class="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-tertiary-emerald)] shadow-[0_0_8px_var(--color-tertiary-emerald)]"></div>
              </button>
            </div>
          </div>
        </div>


        <!-- Footer -->
        <div class="p-6 border-t border-[rgba(244,228,193,0.1)] flex gap-4">
          <button 
            @click="handleClose"
            class="flex-1 py-3 rounded-xl border border-[rgba(244,228,193,0.2)] text-[var(--color-text-secondary)]
                   hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--color-text-primary)] transition-all duration-300"
          >
            {{ t('common.cancel') }}
          </button>
          <button 
            @click="isDebugMode ? handleDebugModeClick() : handleSave()"
            :disabled="isDebugMode || !enteredKey || !selectedModel"
            :title="isDebugMode ? t('apiKeyModal.disabledInDebug') : ''"
            class="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--color-secondary-rose-gold)] to-[var(--color-secondary-burnished-bronze)]
                   text-[var(--color-background-pure-black)] font-bold tracking-wide uppercase
                   shadow-[0_0_20px_rgba(244,228,193,0.3)]
                   hover:shadow-[0_0_30px_rgba(244,228,193,0.5)] hover:scale-[1.02]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   transition-all duration-300"
          >
            {{ isDebugMode ? t('common.debugMode') : t('apiKeyModal.saveConfig') }}
          </button>
        </div>

      </div>

      <!-- Debug Mode Toast Notification -->
      <Transition name="toast-slide">
        <div v-if="showDebugToast" 
             class="fixed top-6 right-6 z-[60] max-w-md glass-panel border-2 border-[rgba(59,130,246,0.6)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(59,130,246,0.3)] overflow-hidden">
          <div class="relative bg-gradient-to-br from-[rgba(59,130,246,0.15)] to-[rgba(99,102,241,0.15)] p-5">
            <button 
              @click="dismissToast"
              class="absolute top-3 right-3 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors text-xl leading-none"
            >
              ×
            </button>
            
            <div class="flex items-start gap-4 pr-6">
              <div class="text-3xl flex-shrink-0">🧪</div>
              <div>
                <h4 class="text-[var(--color-text-primary)] font-bold text-base mb-2">
                  {{ t('common.debugMode') }}
                </h4>
                <p class="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-3">
                  {{ t('apiKeyModal.disabledInDebug') }}
                </p>
                <a :href="window.location.pathname" 
                   class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(59,130,246,0.3)] hover:bg-[rgba(59,130,246,0.4)] border border-[rgba(59,130,246,0.6)] text-[var(--color-text-primary)] text-sm font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                  <span>🚀</span>
                  <span>{{ t('common.switchToReal') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .glass-panel,
.modal-fade-leave-active .glass-panel {
  transition: transform 0.3s ease-out;
}

.modal-fade-enter-from .glass-panel,
.modal-fade-leave-to .glass-panel {
  transform: scale(0.95);
}

/* Custom Scrollbar for modal content */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(244, 228, 193, 0.2);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(244, 228, 193, 0.4);
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease-out;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Toast notification animations */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(100%) translateY(-20px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
