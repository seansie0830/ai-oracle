<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import MockLLMService from '@/services/llm/MockLLMService'
import RealLLMService from '@/services/llm/RealLLMService'
import APIKeyModal from './APIKeyModal.vue'
import ErrorModal from './ErrorModal.vue'
import TarotCard from './TarotCard.vue'
import TarotSpread from './TarotSpread.vue'
import TarotDeck from './TarotDeck.vue'
import { useLLMConfigStore } from '@/stores/llmConfig'
import { useChatStore } from '@/stores/chat'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useMarkdown } from '@/composables/useMarkdown'
import { storeToRefs } from 'pinia'
import { tarotComponentRegistry, isValidComponent } from '@/utils/componentRegistry'

import { useI18n } from 'vue-i18n'

// ... (existing imports)

// Store
const llmConfig = useLLMConfigStore()
const chatStore = useChatStore()
const { t, locale } = useI18n()

// Error Handler
const { handleLLMError } = useErrorHandler()

// Markdown Renderer
const { renderMarkdown } = useMarkdown()

// State
const { messages } = storeToRefs(chatStore)
const input = ref('')
const isThinking = ref(false)
const chatContainer = ref(null)
const shouldAutoScroll = ref(true)
const showApiKeyModal = ref(false)

// Initialize LLM service based on URL query param
const urlParams = new URLSearchParams(window.location.search)
const useMock = urlParams.has('mock')

const llmService = useMock 
  ? new MockLLMService({ thinkingDelay: 1200, charDelay: 25 })
  : new RealLLMService(llmConfig) // Pass store as config source

// Message ID counter
let messageIdCounter = 0

// Send message
async function sendMessage() {
  const userInput = input.value.trim()
  if (!userInput || isThinking.value) return

  // Add user message
  const userMessage = {
    id: `msg-${messageIdCounter++}`,
    text: userInput,
    sender: 'user',
    type: 'text'
  }

  chatStore.addMessage(userMessage)
  input.value = ''
  
  await scrollToBottom()

  // Show thinking state
  isThinking.value = true

  // Create oracle message placeholder
  const oracleMessageId = `msg-${messageIdCounter++}`
  const oracleMessage = {
    id: oracleMessageId,
    text: '',
    sender: 'oracle',
    type: 'text',
    isStreaming: true
  }

  chatStore.addMessage(oracleMessage)

  try {
    // Stream response from mock LLM
    for await (const chunk of llmService.streamResponse(userInput)) {
      isThinking.value = false

      if (chunk.type === 'component') {
        // Handle component injection (e.g., TarotCard)
        const componentMessage = {
          id: oracleMessageId,
          sender: 'oracle',
          type: 'component',
          componentName: chunk.componentName,
          data: chunk.data,
          isStreaming: false
        }
        // Replace the placeholder message
        chatStore.replaceMessage(oracleMessageId, componentMessage)
      } else if (chunk.type === 'text') {
        // Update streaming text
        chatStore.updateMessage(oracleMessageId, { text: chunk.fullText })
        if (shouldAutoScroll.value) {
          await scrollToBottom()
        }
      } else if (chunk.type === 'done') {
        // Mark streaming complete
        chatStore.updateMessage(oracleMessageId, { isStreaming: false })
      }
    }
  } catch (error) {
    // Handle errors with error modal
    isThinking.value = false
    handleLLMError(error)
  }

  await scrollToBottom()
}

// Handle Enter key
function handleKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// Scroll to bottom
async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Detect manual scroll
function handleScroll() {
  if (!chatContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = chatContainer.value
  // If user is near bottom (within 100px), enable auto-scroll
  shouldAutoScroll.value = scrollHeight - scrollTop - clientHeight < 100
}

// Handle retry action from error modal
function handleRetry() {
  // Retry the last user message
  const lastUserMessage = messages.value
    .slice()
    .reverse()
    .find(m => m.sender === 'user')
  
  if (lastUserMessage) {
    input.value = lastUserMessage.text
    nextTick(() => {
      sendMessage()
    })
  }
}

// Handle configure action from error modal
function handleConfigure() {
  showApiKeyModal.value = true
}

// Handle clear chat
function handleClearChat() {
  chatStore.clearMessages()
  llmService.clearHistory()
}

// Welcome message ID tracking
const welcomeMessageId = ref(null)

// Watch for language changes to update welcome message
watch(locale, () => {
  if (welcomeMessageId.value) {
    const newText = useMock 
      ? t('chat.welcomeDebug')
      : t('chat.welcome')
    
    chatStore.updateMessage(welcomeMessageId.value, { text: newText })
  }
})

// Welcome message on mount
onMounted(() => {
  // Load persisted config if available
  llmConfig.loadFromStorage()
  
  // Show welcome message
  const welcomeText = useMock 
    ? t('chat.welcomeDebug')
    : t('chat.welcome')
  
  const id = `msg-${messageIdCounter++}`
  welcomeMessageId.value = id

  chatStore.addMessage({
    id: id,
    text: welcomeText,
    sender: 'oracle',
    type: 'text'
  })
  
  // Auto-show modal if not configured (only in normal mode, not debug/mock mode)
  if (!useMock && !llmConfig.hasValidConfig) {
    setTimeout(() => {
      showApiKeyModal.value = true
    }, 2000) // 2 second delay for better UX
  }
})
</script>

<template>
  <!-- Outer centered wrapper for wide screens -->
  <div class="flex justify-center min-h-screen w-full bg-transparent">
    <div class="flex flex-col h-screen w-full max-w-5xl">
    <!-- Premium Header with Gilded Border -->
    <header class="glass-panel border-b border-[rgba(244,228,193,0.3)] shimmer py-2 px-6">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <!-- Clear Button -->
        <button
          @click="handleClearChat"
          class="mr-4 text-2xl text-[var(--color-text-tertiary)] 
                 hover:text-[var(--color-secondary-rose-gold)]
                 hover:scale-110 transition-all duration-300"
          aria-label="Clear Chat"
          title="Clear Chat History"
        >
          🧹
        </button>

        <div class="flex-1">
          <h1 style="font-family: var(--font-family-display);" 
              class="text-4xl  font-black text-[var(--color-secondary-champagne-gold)] 
                     tracking-[0.3em] text-center uppercase drop-shadow-[0_2px_10px_rgba(244,228,193,0.3)]">
            ✦ Mystic Oracle ✦
          </h1>
          <p style="font-family: var(--font-family-serif);" 
             class="text-center text-[var(--color-text-tertiary)] text-sm mt-3 italic tracking-widest">
            The Divine Divination Experience
          </p>
        </div>
        
        <!-- Settings Button -->
        <button
          @click="showApiKeyModal = true"
          class="ml-4 text-2xl text-[var(--color-text-tertiary)] 
                 hover:text-[var(--color-secondary-champagne-gold)]
                 hover:rotate-45 transition-all duration-300
                 relative"
          :class="{ 'text-[var(--color-tertiary-emerald)]': llmConfig.hasValidConfig }"
          aria-label="Settings"
          title="Configure API Key"
        >
          ⚙️
          <span 
            v-if="llmConfig.hasValidConfig && llmConfig.isPersistent"
            class="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-tertiary-emerald)] 
                   rounded-full border border-[var(--color-background-pure-black)]"
            title="API key persisted"
          ></span>
        </button>
      </div>
    </header>

    <!-- Luxury Chat Area with Max Width -->
    <div 
      ref="chatContainer"
      @scroll="handleScroll"
      class="flex-1 overflow-y-auto custom-scrollbar"
    >
      <div class="max-w-4xl mx-auto py-6 px-6 space-y-6">
        <!-- Messages -->
        <div
          v-for="message in messages"
          :key="message.id"
          class="fade-in"
          :class="message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'"
        >
          <!-- User Message with Elegant Style -->
          <div
            v-if="message.sender === 'user'"
            class="glass-panel border border-[rgba(244,228,193,0.2)] hover-lift
                   rounded-3xl max-w-md py-4 px-6"
          >
            <p class="text-[var(--color-text-secondary)] leading-relaxed">{{ message.text }}</p>
          </div>

          <!-- Oracle Message with Gilded Border -->
          <div
            v-else-if="message.sender === 'oracle' && message.type === 'text'"
            class="glass-panel gilded-border hover-lift rounded-3xl max-w-2xl py-5 px-7"
          >
            <div 
              style="font-family: var(--font-family-serif);" 
              class="markdown-content text-[var(--color-text-primary)] font-light leading-relaxed text-lg"
              v-html="renderMarkdown(message.text)"
            ></div>
            <span v-if="message.isStreaming" class="typing-cursor"></span>
          </div>

          <!-- Component Message with Divine Glow -->
          <div
            v-else-if="message.type === 'component' && isValidComponent(message.componentName)"
            class="glass-panel gilded-border divine-glow hover-lift rounded-3xl py-6 px-8"
            :class="message.componentName === 'TarotSpread' || message.componentName === 'TarotDeck' ? 'max-w-4xl' : 'max-w-md'"
          >
            <component 
              :is="tarotComponentRegistry[message.componentName]"
              v-bind="message.data"
            />
          </div>

          <!-- System/Error Message -->
          <div
            v-else-if="message.sender === 'system'"
            class="glass-panel rounded-3xl max-w-md py-5 px-7
                   border-2 border-red-400/40 bg-red-900/20"
          >
            <p class="text-red-200 text-sm font-medium">{{ message.text }}</p>
          </div>
        </div>

        <!-- Sophisticated Thinking State -->
        <div v-if="isThinking" class="flex justify-start fade-in">
          <div class="glass-panel gilded-border thinking-animation rounded-3xl py-5 px-7">
            <div class="flex items-center gap-3">
              <div class="text-2xl">🔮</div>
              <p style="font-family: var(--font-family-serif);" 
                 class="text-[var(--color-primary-amethyst)] text-lg tracking-wide">
                Divining the cosmic energies...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Luxury Input Area with Max Width -->
    <div class="glass-panel border-t border-[rgba(244,228,193,0.3)] py-6 px-6">
      <div class="flex gap-4 max-w-4xl mx-auto">
        <input
          v-model="input"
          @keypress="handleKeyPress"
          type="text"
          placeholder="Seek the wisdom of the oracle..."
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          class="flex-1 rounded-2xl glass-panel py-5 px-7
                 border-2 border-[rgba(244,228,193,0.25)]
                 text-[var(--color-text-secondary)] text-lg
                 placeholder-[var(--color-text-tertiary)]/40
                 focus:outline-none focus:border-[rgba(244,228,193,0.5)] 
                 focus:shadow-[0_0_30px_rgba(157,78,221,0.4)]
                 transition-all duration-500 ease-out
                 disabled:opacity-40 disabled:cursor-not-allowed"
          style="font-family: var(--font-family-sans);"
          :disabled="isThinking"
        />
        <button
          @click="sendMessage"
          :disabled="!input.trim() || isThinking"
          style="font-family: var(--font-family-display);"
          class="rounded-2xl font-bold text-base py-5 px-10
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
          ✨ Send
        </button>
      </div>
    </div>
  </div>
</div>

  <!-- API Key Modal -->
  <APIKeyModal 
    :isOpen="showApiKeyModal"
    :isDebugMode="useMock"
    @close="showApiKeyModal = false"
    @save="showApiKeyModal = false"
  />
  
  <!-- Error Modal -->
  <ErrorModal 
    @retry="handleRetry"
    @configure="handleConfigure"
  />
</template>


<style scoped>
/* Markdown Content Styling */
.markdown-content :deep(p) {
  margin-bottom: 1em;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  font-family: var(--font-family-display);
  color: var(--color-secondary-champagne-gold);
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-weight: 700;
  line-height: 1.3;
}

.markdown-content :deep(h1) { font-size: 2em; }
.markdown-content :deep(h2) { font-size: 1.75em; }
.markdown-content :deep(h3) { font-size: 1.5em; }
.markdown-content :deep(h4) { font-size: 1.25em; }
.markdown-content :deep(h5) { font-size: 1.1em; }
.markdown-content :deep(h6) { font-size: 1em; }

.markdown-content :deep(strong) {
  font-weight: 700;
  color: var(--color-secondary-rose-gold);
}

.markdown-content :deep(em) {
  font-style: italic;
  color: var(--color-text-secondary);
}

.markdown-content :deep(code.inline-code) {
  background: rgba(157, 78, 221, 0.15);
  color: var(--color-tertiary-violet);
  padding: 0.2em 0.5em;
  border-radius: 0.375rem;
  font-size: 0.9em;
  font-family: 'Courier New', monospace;
  border: 1px solid rgba(157, 78, 221, 0.3);
}

.markdown-content :deep(pre) {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(244, 228, 193, 0.2);
  border-radius: 0.75rem;
  padding: 1em;
  overflow-x: auto;
  margin: 1em 0;
  box-shadow: 0 0 20px rgba(157, 78, 221, 0.2);
}

.markdown-content :deep(pre code) {
  background: transparent;
  color: var(--color-text-secondary);
  padding: 0;
  border: none;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.6;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid var(--color-secondary-champagne-gold);
  padding-left: 1.25em;
  margin: 1em 0;
  color: var(--color-text-tertiary);
  font-style: italic;
  background: rgba(244, 228, 193, 0.05);
  padding: 1em 1.25em;
  border-radius: 0.5rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5em;
}

.markdown-content :deep(ul li) {
  list-style-type: disc;
}

.markdown-content :deep(ol li) {
  list-style-type: decimal;
}

.markdown-content :deep(a) {
  color: var(--color-tertiary-violet);
  text-decoration: underline;
  transition: color 0.3s ease;
}

.markdown-content :deep(a:hover) {
  color: var(--color-secondary-rose-gold);
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(244, 228, 193, 0.3);
  margin: 2em 0;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid rgba(244, 228, 193, 0.2);
  padding: 0.75em;
  text-align: left;
}

.markdown-content :deep(th) {
  background: rgba(157, 78, 221, 0.15);
  color: var(--color-secondary-champagne-gold);
  font-weight: 700;
}

.markdown-content :deep(tr:nth-child(even)) {
  background: rgba(0, 0, 0, 0.2);
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin: 1em 0;
  box-shadow: 0 0 20px rgba(157, 78, 221, 0.3);
}
</style>

