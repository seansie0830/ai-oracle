<script setup>
import { computed } from 'vue'
import { useErrorStore } from '@/stores/errorHandler'
import { useI18n } from 'vue-i18n'

// Store
const errorStore = useErrorStore()
const { t } = useI18n()

// Emits for action handlers
const emit = defineEmits(['retry', 'configure', 'report', 'refresh'])

// Computed: Type-specific styling
const errorConfig = computed(() => errorStore.errorConfig)

const modalStyles = computed(() => {
  if (!errorConfig.value) return {}
  
  return {
    borderColor: errorConfig.value.primaryColor,
    boxShadow: `0 0 40px ${errorConfig.value.glowColor}`
  }
})

const modalClasses = computed(() => {
  if (!errorConfig.value) return ''
  
  const borderStyles = {
    'dashed': 'border-dashed',
    'dotted': 'border-dotted',
    'solid': 'border-solid',
    'double': 'border-double border-4',
    'gradient': 'border-2',
    'animated': 'border-2 animate-border',
    'soft': 'border',
    'tech': 'border-2',
    'ornate': 'border-2',
    'celestial': 'border-2'
  }
  
  return borderStyles[errorConfig.value.borderStyle] || 'border-2'
})

const iconClasses = computed(() => {
  if (!errorConfig.value?.iconAnimation) return ''
  
  const animations = {
    'shake': 'animate-shake',
    'float': 'animate-float',
    'spin': 'animate-spin-slow',
    'flicker': 'animate-flicker',
    'glitch': 'animate-glitch',
    'pulse': 'animate-pulse',
    'bounce': 'animate-bounce-subtle'
  }
  
  return animations[errorConfig.value.iconAnimation] || 'animate-pulse'
})

const titleColor = computed(() => {
  if (!errorConfig.value) return '#ef4444'
  return errorConfig.value.primaryColor
})

// Action Handlers
function handleAction(action) {
  switch (action) {
    case 'retry':
      emit('retry')
      errorStore.dismissError()
      break
    case 'configure':
    case 'reconfigure':
      emit('configure')
      errorStore.dismissError()
      break
    case 'report':
      handleReport()
      break
    case 'refresh':
      window.location.reload()
      break
    case 'dismiss':
    case 'wait':
      errorStore.dismissError()
      break
  }
}

function handleReport() {
  if (!errorStore.currentError) return
  
  const errorReport = {
    type: errorStore.currentError.type,
    message: errorStore.currentError.message,
    timestamp: errorStore.currentError.timestamp,
    metadata: errorStore.currentError.metadata
  }
  
  navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
    .then(() => {
      console.log('[ErrorModal] Error copied to clipboard')
    })
    .catch(err => {
      console.error('[ErrorModal] Failed to copy error:', err)
    })
  
  emit('report', errorStore.currentError)
}

function handleBackdropClick() {
  errorStore.dismissError()
}

function handleModalClick(event) {
  event.stopPropagation()
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    errorStore.dismissError()
  }
}
</script>

<template>
  <!-- Error Modal Overlay -->
  <Transition name="modal-fade">
    <div
      v-if="errorStore.isModalOpen && errorStore.currentError"
      class="fixed inset-0 z-50 flex items-center justify-center 
             bg-[rgba(0,0,0,0.9)] backdrop-blur-xl"
      @click="handleBackdropClick"
      @keydown="handleKeydown"
      tabindex="-1"
    >
      <!-- Modal Panel -->
      <Transition name="modal-bounce">
        <div
          v-if="errorStore.isModalOpen"
          :class="[
            'backdrop-blur-xl bg-gradient-to-br rounded-3xl',
            'from-black/40 to-black/60',
            'max-w-md w-full mx-4 p-6',
            'transform transition-all duration-500',
            modalClasses
          ]"
          :style="modalStyles"
          @click="handleModalClick"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="`error-title-${errorStore.currentError.type}`"
          :aria-describedby="`error-message-${errorStore.currentError.type}`"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-4">
              <!-- Type-Specific Animated Icon -->
              <div 
                :class="['text-5xl', iconClasses]"
                :style="{ filter: `drop-shadow(0 0 12px ${errorConfig?.glowColor})` }"
              >
                {{ errorStore.currentError.icon }}
              </div>
              
              <!-- Title -->
              <div>
                <h2
                  :id="`error-title-${errorStore.currentError.type}`"
                  class="font-bold tracking-[0.15em] uppercase text-xl"
                  style="font-family: var(--font-family-display);"
                  :style="{ color: titleColor }"
                >
                  {{ errorStore.currentError.title }}
                </h2>
                
                <!-- Severity Badge -->
                <span
                  class="text-xs uppercase tracking-wider opacity-60 mt-1 block"
                  style="font-family: var(--font-family-sans);"
                >
                  {{ errorStore.currentError.severity }}
                </span>
              </div>
            </div>
            
            <!-- Close Button -->
            <button
              @click="errorStore.dismissError()"
              class="text-2xl text-[var(--color-text-tertiary)]
                     hover:text-[var(--color-secondary-champagne-gold)]
                     transition-all duration-300 hover:rotate-90"
              aria-label="Close error modal"
            >
              ✕
            </button>
          </div>
          
          <!-- Error Content -->
          <div class="space-y-4 mb-6">
            <!-- Primary Message -->
            <p
              :id="`error-message-${errorStore.currentError.type}`"
              class="text-[var(--color-text-secondary)] leading-relaxed text-base"
              style="font-family: var(--font-family-serif);"
            >
              {{ errorStore.currentError.message }}
            </p>
            
            <!-- Type-Specific Features -->
            
            <!-- Suggestions List (for errors with suggestions) -->
            <div
              v-if="errorConfig?.suggestions && errorConfig.suggestions.length > 0"
              class="glass-panel rounded-xl p-4 border border-white/5"
            >
              <p class="text-[var(--color-secondary-champagne-gold)] text-sm uppercase tracking-wider mb-2 font-bold">
                💡 {{ t('errorModal.suggestions') }}
              </p>
              <ul class="space-y-1">
                <li
                  v-for="(suggestion, index) in errorConfig.suggestions"
                  :key="index"
                  class="text-[var(--color-text-tertiary)] text-sm flex items-start"
                >
                  <span class="mr-2">•</span>
                  <span>{{ suggestion }}</span>
                </li>
              </ul>
            </div>
            
            <!-- Provider List (for API_KEY_MISSING) -->
            <div
              v-if="errorConfig?.providerList && errorConfig.providerList.length > 0"
              class="glass-panel rounded-xl p-4 border border-white/5"
            >
              <p class="text-[var(--color-secondary-champagne-gold)] text-sm uppercase tracking-wider mb-2 font-bold">
                ✨ {{ t('errorModal.supportedProviders') }}
              </p>
              <ul class="space-y-1">
                <li
                  v-for="provider in errorConfig.providerList"
                  :key="provider"
                  class="text-[var(--color-text-tertiary)] text-sm flex items-start"
                >
                  <span class="mr-2">•</span>
                  <span>{{ provider }}</span>
                </li>
              </ul>
            </div>
            
            <!-- Mystical Message (for mystical errors) -->
            <div
              v-if="errorConfig?.mysticalMessage"
              class="glass-panel rounded-xl p-4 border border-purple-500/20 bg-purple-900/10"
            >
              <p class="text-purple-300 text-sm italic">
                {{ errorConfig.mysticalMessage }}
              </p>
            </div>
            
            <!-- Mock Error Badge -->
            <div
              v-if="errorConfig?.isMockError"
              class="glass-panel rounded-xl p-3 border border-indigo-500/30 bg-indigo-900/20"
            >
              <p class="text-indigo-300 text-xs">
                🧪 <strong>{{ t('errorModal.testMode') }}</strong> {{ t('errorModal.testModeMessage') }}
              </p>
            </div>
            
            <!-- Technical Details (collapsible) -->
            <div
              v-if="errorStore.currentError.metadata && Object.keys(errorStore.currentError.metadata).length > 0"
              class="glass-panel rounded-xl p-4 border border-white/5"
            >
              <details class="cursor-pointer">
                <summary class="text-[var(--color-text-tertiary)] text-sm uppercase tracking-wider mb-2 select-none hover:text-[var(--color-secondary-champagne-gold)] transition-colors">
                  {{ t('errorModal.technicalDetails') }}
                </summary>
                <div class="text-xs text-[var(--color-text-tertiary)] space-y-1 mt-2 font-mono bg-black/30 p-3 rounded-lg">
                  <div v-if="errorStore.currentError.type">
                    <span class="opacity-60">{{ t('errorModal.errorCode') }}</span> 
                    <span class="text-amber-400">{{ errorStore.currentError.type }}</span>
                  </div>
                  <div v-if="errorStore.currentError.timestamp">
                    <span class="opacity-60">{{ t('errorModal.timestamp') }}</span> 
                    <span class="text-cyan-400">{{ new Date(errorStore.currentError.timestamp).toLocaleString() }}</span>
                  </div>
                  <div v-for="(value, key) in errorStore.currentError.metadata" :key="key">
                    <span class="opacity-60">{{ key }}:</span> 
                    <span class="text-green-400">{{ value }}</span>
                  </div>
                </div>
              </details>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3">
            <!-- Primary Action -->
            <button
              v-if="errorStore.currentError.primaryAction"
              @click="handleAction(errorStore.currentError.primaryAction)"
              class="flex-1 py-3 px-6 rounded-xl font-bold uppercase tracking-wider text-sm
                     transition-all duration-300
                     bg-gradient-to-r from-[var(--color-secondary-rose-gold)] 
                     via-[var(--color-secondary-champagne-gold)] 
                     to-[var(--color-secondary-burnished-bronze)]
                     text-[var(--color-background-pure-black)]
                     hover:scale-[1.02]"
              :style="{ boxShadow: `0 0 30px ${errorConfig?.glowColor}` }"
              style="font-family: var(--font-family-display);"
            >
              {{ errorStore.currentError.primaryAction }}
            </button>
            
            <!-- Secondary Action: Dismiss -->
            <button
              @click="handleAction('dismiss')"
              class="flex-1 py-3 px-6 rounded-xl font-medium uppercase tracking-wider text-sm
                     text-[var(--color-text-tertiary)] border border-white/20
                     hover:border-[var(--color-secondary-champagne-gold)]/40
                     hover:text-[var(--color-text-secondary)]
                     transition-all duration-300"
              style="font-family: var(--font-family-display);"
            >
              {{ t('common.dismiss') }}
            </button>
          </div>
          
          <!-- Optional: Report Button -->
          <div
            v-if="errorStore.currentError.actions.includes('report')"
            class="mt-3"
          >
            <button
              @click="handleReport()"
              class="w-full py-2 text-xs text-[var(--color-text-tertiary)]
                     hover:text-[var(--color-tertiary-celestial)]
                     transition-colors duration-300"
            >
              📋 {{ t('errorModal.copyError') }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
<style scoped>
/* Modal Fade Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Modal Bounce Transition */
.modal-bounce-enter-active {
  transition: all 0.5s ease-out;
}

.modal-bounce-leave-active {
  transition: all 0.3s ease-in;
}

.modal-bounce-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-bounce-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Type-Specific Animations */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

.animate-shake {
  animation: shake 0.5s infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

.animate-flicker {
  animation: flicker 1.5s ease-in-out infinite;
}

.animate-glitch {
  animation: glitch 0.3s infinite;
}

.animate-bounce-subtle {
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animated Border */
@keyframes borderGlow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-border {
  animation: borderGlow 2s ease-in-out infinite;
}
</style>
