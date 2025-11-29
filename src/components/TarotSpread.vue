<script setup>
import { ref, computed } from 'vue'
import TarotCard from './TarotCard.vue'

const props = defineProps({
  spreadType: {
    type: String,
    default: 'three-card',
    validator: (value) => ['three-card', 'celtic-cross', 'single-card'].includes(value)
  },
  cards: {
    type: Array,
    required: true,
    validator: (cards) => cards.every(card => card.cardName && card.orientation)
  },
  autoReveal: {
    type: Boolean,
    default: true
  },
  revealDelay: {
    type: Number,
    default: 500 // ms between each card reveal
  }
})

// Track which cards have been revealed
const revealedCards = ref([])

// Computed layout class
const layoutClass = computed(() => {
  return `spread-layout-${props.spreadType}`
})

// Auto-reveal cards sequentially
if (props.autoReveal) {
  props.cards.forEach((_, index) => {
    setTimeout(() => {
      revealedCards.value.push(index)
    }, index * props.revealDelay + 500) // Initial delay of 500ms
  })
}

// Manual reveal all
function revealAll() {
  revealedCards.value = props.cards.map((_, index) => index)
}

// Check if card is revealed
function isCardRevealed(index) {
  return revealedCards.value.includes(index)
}

// Get card position label for Celtic Cross
function getPositionLabel(index) {
  const labels = {
    'celtic-cross': [
      'Present',
      'Challenge',
      'Past',
      'Future',
      'Above',
      'Below',
      'Advice',
      'External',
      'Hopes',
      'Outcome'
    ],
    'three-card': ['Past', 'Present', 'Future']
  }
  return labels[props.spreadType]?.[index] || ''
}

defineExpose({ revealAll })
</script>

<template>
  <div class="tarot-spread-container">
    <div 
      class="tarot-spread"
      :class="layoutClass"
    >
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card-position"
        :class="`position-${index}`"
      >
        <TarotCard
          :card-name="card.cardName"
          :orientation="card.orientation"
          :is-revealed="isCardRevealed(index)"
          :size="spreadType === 'celtic-cross' ? 'small' : 'medium'"
        />
        <div 
          v-if="getPositionLabel(index)" 
          class="position-label"
        >
          {{ getPositionLabel(index) }}
        </div>
      </div>
    </div>
    
    <!-- Reveal All Button (if not auto-reveal) -->
    <div v-if="!autoReveal && revealedCards.length < cards.length" class="reveal-controls">
      <button 
        @click="revealAll"
        class="reveal-button"
      >
        ✨ Reveal All Cards
      </button>
    </div>
  </div>
</template>

<style scoped>
.tarot-spread-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.tarot-spread {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 300px;
}

/* Three-Card Spread Layout */
.spread-layout-three-card {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  flex-wrap: wrap;
}

/* Single Card Layout */
.spread-layout-single-card {
  display: flex;
  justify-content: center;
}

/* Celtic Cross Layout - Complex Grid */
.spread-layout-celtic-cross {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0.5rem;
  max-width: 600px;
}

.spread-layout-celtic-cross .card-position {
  position: relative;
}

/* Celtic Cross specific positions */
.spread-layout-celtic-cross .position-0 {
  grid-column: 2;
  grid-row: 2;
  z-index: 1;
}

.spread-layout-celtic-cross .position-1 {
  grid-column: 2;
  grid-row: 2;
  z-index: 2;
  transform: rotate(90deg);
}

.spread-layout-celtic-cross .position-2 {
  grid-column: 1;
  grid-row: 2;
}

.spread-layout-celtic-cross .position-3 {
  grid-column: 3;
  grid-row: 2;
}

.spread-layout-celtic-cross .position-4 {
  grid-column: 2;
  grid-row: 1;
}

.spread-layout-celtic-cross .position-5 {
  grid-column: 2;
  grid-row: 3;
}

.spread-layout-celtic-cross .position-6 {
  grid-column: 4;
  grid-row: 4;
}

.spread-layout-celtic-cross .position-7 {
  grid-column: 4;
  grid-row: 3;
}

.spread-layout-celtic-cross .position-8 {
  grid-column: 4;
  grid-row: 2;
}

.spread-layout-celtic-cross .position-9 {
  grid-column: 4;
  grid-row: 1;
}

.card-position {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.position-label {
  font-family: var(--font-family-serif);
  font-size: 0.875rem;
  color: var(--color-secondary-champagne-gold);
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  margin-top: 0.5rem;
}

.reveal-controls {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.reveal-button {
  font-family: var(--font-family-display);
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: linear-gradient(
    135deg,
    var(--color-secondary-rose-gold),
    var(--color-secondary-champagne-gold)
  );
  color: var(--color-background-pure-black);
  border: none;
  cursor: pointer;
  box-shadow: 
    0 4px 20px rgba(244, 228, 193, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.reveal-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 30px rgba(244, 228, 193, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.reveal-button:active {
  transform: translateY(0);
}

/* Container animation */
.tarot-spread-container {
  animation: spreadAppear 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes spreadAppear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .spread-layout-three-card {
    flex-direction: column;
  }
  
  .spread-layout-celtic-cross {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
  
  .spread-layout-celtic-cross .card-position {
    grid-column: auto !important;
    grid-row: auto !important;
    transform: none !important;
  }
}
</style>
