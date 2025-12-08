<script setup>
import { ref, computed } from 'vue'
import { getCardImage, getCardBack } from '@/utils/tarotUtils'

const props = defineProps({
  cardName: {
    type: String,
    required: true
  },
  orientation: {
    type: String,
    default: 'upright',
    validator: (value) => ['upright', 'reversed'].includes(value)
  },
  isRevealed: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  behavior: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'one-way', 'block'].includes(value)
  }
})

// Local state for animation control
const localRevealed = ref(props.isRevealed)

// Computed card dimensions based on size
const cardDimensions = computed(() => {
  const sizes = {
    small: { width: '120px', height: '210px' },
    medium: { width: '160px', height: '280px' },
    large: { width: '200px', height: '350px' }
  }
  return sizes[props.size]
})

// Get card images
const frontImage = computed(() => getCardImage(props.cardName))
const backImage = computed(() => getCardBack())

// Handle reveal animation
function reveal() {
  if (!localRevealed.value) {
    localRevealed.value = true
  }
}

// Flip manually (for interactive mode)
function flip() {
  // Respect the behavior prop
  if (props.behavior === 'block') {
    // Do nothing, flipping is disabled
    return
  }
  if (props.behavior === 'one-way') {
    // Allow flip only if currently not revealed
    if (!localRevealed.value) {
      localRevealed.value = true
    }
    return
  }
  // Normal behavior: toggle freely
  localRevealed.value = !localRevealed.value
}

defineExpose({ reveal, flip })
</script>

<template>
  <div 
    class="tarot-card-container"
    :style="{ 
      width: cardDimensions.width, 
      height: cardDimensions.height 
    }"
    @click="flip"
  >
    <div 
      class="tarot-card"
      :class="{ 
        'is-flipped': localRevealed, 
        'is-reversed': orientation === 'reversed' && localRevealed 
      }"
    >
      <!-- Card Back -->
      <div class="tarot-card-face tarot-card-back">
        <img 
          :src="backImage" 
          :alt="`Tarot card back`"
          loading="lazy"
          class="card-image"
        />
        <div class="card-glow"></div>
      </div>
      
      <!-- Card Front -->
      <div class="tarot-card-face tarot-card-front">
        <img 
          :src="frontImage" 
          :alt="cardName"
          loading="lazy"
          class="card-image"
        />
        <div class="card-name-overlay">
          <p class="card-name">{{ cardName }}</p>
          <p v-if="orientation === 'reversed'" class="card-orientation">
            ⟲ Reversed
          </p>
        </div>
        <div class="card-glow"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tarot-card-container {
  perspective: 1000px;
  cursor: pointer;
  display: inline-block;
  margin: 0.5rem;
}

.tarot-card {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.tarot-card.is-flipped {
  transform: rotateY(180deg);
}

.tarot-card.is-reversed {
  transform: rotateY(180deg) rotateZ(180deg);
}

.tarot-card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 0 2px var(--color-secondary-champagne-gold),
    inset 0 0 0 1px rgba(244, 228, 193, 0.2);
}

.tarot-card-back {
  background: var(--color-primary-royal-purple);
}

.tarot-card-front {
  background: var(--color-primary-deep-indigo);
  transform: rotateY(180deg);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
  background: radial-gradient(
    circle at center,
    rgba(157, 78, 221, 0.4) 0%,
    transparent 70%
  );
}

.tarot-card-container:hover .card-glow {
  opacity: 1;
}

.card-name-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 70%,
    transparent 100%
  );
  text-align: center;
}

.card-name {
  font-family: var(--font-family-display);
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-secondary-champagne-gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.card-orientation {
  font-family: var(--font-family-serif);
  font-size: 0.75rem;
  color: var(--color-tertiary-celestial);
  font-style: italic;
  margin-top: 0.25rem;
}

/* Animation on mount */
.tarot-card-container {
  animation: cardAppear 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Hover effect */
.tarot-card-container:hover {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
}

.tarot-card-container:hover .tarot-card-face {
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(157, 78, 221, 0.4),
    0 0 0 2px var(--color-secondary-champagne-gold),
    inset 0 0 0 1px rgba(244, 228, 193, 0.3);
}
</style>
