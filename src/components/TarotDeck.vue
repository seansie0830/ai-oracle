<script setup>
import { ref, computed } from 'vue'
import { getCardBack, drawRandomCard, drawMultipleCards } from '@/utils/tarotUtils'
import TarotCard from './TarotCard.vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'single', // 'single' or 'multiple'
    validator: (value) => ['single', 'multiple'].includes(value)
  },
  count: {
    type: Number,
    default: 3,
    validator: (value) => value >= 1 && value <= 10
  }
})

const emit = defineEmits(['draw', 'cardDrawn'])

// State
const isDrawing = ref(false)
const drawnCards = ref([])


// Get card back image
const backImage = computed(() => getCardBack())

// Handle card draw
async function handleDraw() {
  if (isDrawing.value) return
  
  isDrawing.value = true
  
  // Simulate drawing animation delay
  setTimeout(() => {
    let newCards
    
    if (props.mode === 'single') {
      newCards = [drawRandomCard()]
    } else {
      newCards = drawMultipleCards(props.count)
    }
    
    drawnCards.value = newCards
    
    // Emit events
    emit('draw', newCards)
    newCards.forEach(card => {
      emit('cardDrawn', card)
    })
    
    isDrawing.value = false
  }, 600) // Animation delay
}

// Reset deck
function reset() {
  drawnCards.value = []
  isDrawing.value = false
}

defineExpose({ reset })
</script>

<template>
  <div class="tarot-deck-container">
    <!-- Deck Display -->
    <div 
      class="deck-stack"
      :class="{ 'is-drawing': isDrawing, 'has-drawn': drawnCards.length > 0 }"
      @click="handleDraw"
    >
      <!-- Multiple card layers for 3D effect -->
      <div 
        v-for="i in 5" 
        :key="i"
        class="deck-card-layer"
        :style="{ 
          transform: `translateY(${-i * 2}px) translateX(${i * 1}px)`,
          zIndex: 10 - i,
          opacity: 1 - (i * 0.1)
        }"
      >
        <img 
          :src="backImage" 
          alt="Tarot deck"
          class="deck-card-image"
        />
      </div>
      
      <!-- Hover glow effect -->
      <div class="deck-glow"></div>
      
      <!-- Draw prompt -->
      <div class="deck-prompt">
        <p v-if="!isDrawing && drawnCards.length === 0">
          ✨ Click to Draw {{ mode === 'single' ? 'a Card' : `${count} Cards` }}
        </p>
        <p v-else-if="isDrawing" class="drawing-text">
          🔮 Drawing...
        </p>
        <p v-else>
          ↻ Click to Draw Again
        </p>
      </div>
    </div>
    
    <!-- Instructions -->
    <div class="deck-instructions">
      <p class="instruction-text">
        Focus on your question and draw from the mystic deck
      </p>
    </div>
    
    <!-- Drawn Cards Display -->
    <div v-if="drawnCards.length > 0" class="drawn-cards-container">
      <div class="drawn-cards-divider">
        <span class="divider-text">✦ Your Cards ✦</span>
      </div>
      <div class="drawn-cards-grid">
        <TarotCard
          v-for="(card, index) in drawnCards"
          :key="`drawn-${index}`"
          :card-name="card.cardName"
          :orientation="card.orientation"
          :is-revealed="true"
          size="medium"
          behavior="one-way"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tarot-deck-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.deck-stack {
  position: relative;
  width: 200px;
  height: 350px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.deck-stack:hover {
  transform: translateY(-8px);
}

.deck-stack.is-drawing {
  animation: deckShake 0.6s ease;
  pointer-events: none;
}

.deck-stack.has-drawn {
  opacity: 0.7;
}

.deck-card-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 350px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 0 2px var(--color-secondary-champagne-gold);
  transition: all 0.3s ease;
}

.deck-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.deck-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 16px;
  background: radial-gradient(
    circle at center,
    rgba(157, 78, 221, 0.6) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 0;
}

.deck-stack:hover .deck-glow {
  opacity: 1;
  animation: pulseGlow 2s ease-in-out infinite;
}

.deck-prompt {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 20;
}

.deck-prompt p {
  font-family: var(--font-family-serif);
  font-size: 1rem;
  color: var(--color-secondary-champagne-gold);
  font-weight: 600;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.05em;
}

.drawing-text {
  animation: pulse 1s ease-in-out infinite;
}

.deck-instructions {
  max-width: 300px;
  text-align: center;
}

.instruction-text {
  font-family: var(--font-family-serif);
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  font-style: italic;
  line-height: 1.6;
}

/* Animations */
@keyframes deckShake {
  0%, 100% {
    transform: translateY(-8px) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(-2deg);
  }
  75% {
    transform: translateY(-8px) rotate(2deg);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Hover effects for card layers */
.deck-stack:hover .deck-card-layer {
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(157, 78, 221, 0.4),
    0 0 0 2px var(--color-secondary-champagne-gold);
}

/* Container animation */
.tarot-deck-container {
  animation: deckAppear 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes deckAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Drawn Cards Display */
.drawn-cards-container {
  width: 100%;
  max-width: 800px;
  margin-top: 3rem;
  animation: fadeSlideIn 0.6s ease-out;
}

.drawn-cards-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
}

.drawn-cards-divider::before,
.drawn-cards-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--color-secondary-champagne-gold),
    transparent
  );
}

.divider-text {
  font-family: var(--font-family-display);
  font-size: 1.125rem;
  color: var(--color-secondary-champagne-gold);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  padding: 0 1.5rem;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
}

.drawn-cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: flex-start;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
