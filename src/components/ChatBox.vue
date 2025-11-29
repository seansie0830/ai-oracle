<script setup>
import { ref, nextTick, onMounted } from 'vue'
import MockLLMService from '@/services/llm/MockLLMService'

// State
const messages = ref([])
const input = ref('')
const isThinking = ref(false)
const chatContainer = ref(null)
const shouldAutoScroll = ref(true)

// Initialize mock LLM service
const llmService = new MockLLMService({
  thinkingDelay: 1200,
  charDelay: 25
})

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
  messages.value.push(userMessage)
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
  messages.value.push(oracleMessage)

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
        const index = messages.value.findIndex(m => m.id === oracleMessageId)
        if (index !== -1) {
          messages.value[index] = componentMessage
        }
      } else if (chunk.type === 'text') {
        // Update streaming text
        const index = messages.value.findIndex(m => m.id === oracleMessageId)
        if (index !== -1) {
          messages.value[index].text = chunk.fullText
        }
        if (shouldAutoScroll.value) {
          await scrollToBottom()
        }
      } else if (chunk.type === 'done') {
        // Mark streaming complete
        const index = messages.value.findIndex(m => m.id === oracleMessageId)
        if (index !== -1) {
          messages.value[index].isStreaming = false
        }
      }
    }
  } catch (error) {
    // Handle errors
    isThinking.value = false
    const errorMessage = {
      id: `msg-${messageIdCounter++}`,
      text: `⚠️ ${error.message}`,
      sender: 'system',
      type: 'error'
    }
    messages.value.push(errorMessage)
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

// Welcome message on mount
onMounted(() => {
  messages.value.push({
    id: `msg-${messageIdCounter++}`,
    text: 'Welcome, seeker. I am the Mystic Oracle. Ask me anything, or try /draw to reveal a tarot card.',
    sender: 'oracle',
    type: 'text'
  })
})
</script>

<template>
  <!-- Outer centered wrapper for wide screens -->
  <div class="flex justify-center min-h-screen w-full bg-transparent">
    <div class="flex flex-col h-screen w-full max-w-5xl">
      <!-- Premium Header with Gilded Border -->
    <header class="glass-panel border-b border-[rgba(244,228,193,0.3)] shimmer py-2 px-6">
      <div class="max-w-4xl mx-auto ">
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
            <p style="font-family: var(--font-family-serif);" 
               class="text-[var(--color-text-primary)] font-light leading-relaxed text-lg">
              {{ message.text }}
              <span v-if="message.isStreaming" class="typing-cursor"></span>
            </p>
          </div>

          <!-- Component Message with Divine Glow -->
          <div
            v-else-if="message.type === 'component'"
            class="glass-panel gilded-border divine-glow hover-lift rounded-3xl max-w-md py-6 px-8"
          >
            <div class="text-center">
              <div class="mb-4">
                <div class="text-6xl mb-3">🎴</div>
              </div>
              <p style="font-family: var(--font-family-display);" 
                 class="text-[var(--color-secondary-champagne-gold)] text-2xl mb-4 tracking-wide font-bold">
                {{ message.data.cardName }}
              </p>
              <p style="font-family: var(--font-family-serif);" 
                 class="text-[var(--color-text-secondary)] text-base italic leading-relaxed">
                {{ message.data.description }}
              </p>
              <p class="text-[var(--color-tertiary-celestial)] text-xs mt-5 opacity-70 tracking-wider">
                ✨ {{ message.componentName }} Component
              </p>
            </div>
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
</template>


<style scoped>
/* Component-specific styles if needed */
</style>
