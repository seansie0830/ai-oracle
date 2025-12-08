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
    validator: (value) => ['small', 'medium', 'large', 'modal'].includes(value)
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
    large: { width: '200px', height: '350px' },
    modal: { width: '400px', height: '700px' }
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
  // Don't flip in modal mode - we want zoom/pan instead
  if (props.size === 'modal') {
    return
  }
  
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

// Emit events
const emit = defineEmits(['close'])

// Handle modal close
function closeModal() {
  if (props.size === 'modal') {
    emit('close')
  }
}

// Handle escape key for modal
function handleEscape(event) {
  if (event.key === 'Escape' && props.size === 'modal') {
    closeModal()
  }
}

// Handle backdrop click
function handleBackdropClick(event) {
  if (event.target === event.currentTarget && props.size === 'modal') {
    closeModal()
  }
}

// Zoom and Pan functionality for modal
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const lastPanX = ref(0)
const lastPanY = ref(0)

// Touch zoom tracking
let initialDistance = 0
let initialZoom = 1

// Computed transform for the card
const cardTransform = computed(() => {
  if (props.size !== 'modal') return ''
  return `scale(${zoomLevel.value}) translate(${panX.value}px, ${panY.value}px)`
})

// Handle mouse wheel zoom
function handleWheel(event) {
  if (props.size !== 'modal') return
  event.preventDefault()
  
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  const newZoom = Math.max(0.5, Math.min(3, zoomLevel.value + delta))
  
  zoomLevel.value = newZoom
  
  // Reset pan if zoomed out to 1x or below
  if (newZoom <= 1) {
    panX.value = 0
    panY.value = 0
  }
}

// Handle double-click to reset zoom
function handleDoubleClick() {
  if (props.size !== 'modal') return
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
}

// Handle mouse drag start
function handleDragStart(event) {
  if (props.size !== 'modal' || zoomLevel.value <= 1) return
  
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartY.value = event.clientY
  lastPanX.value = panX.value
  lastPanY.value = panY.value
  
  event.preventDefault()
}

// Handle mouse drag move
function handleDragMove(event) {
  if (!isDragging.value || props.size !== 'modal') return
  
  const deltaX = event.clientX - dragStartX.value
  const deltaY = event.clientY - dragStartY.value
  
  panX.value = lastPanX.value + deltaX / zoomLevel.value
  panY.value = lastPanY.value + deltaY / zoomLevel.value
  
  event.preventDefault()
}

// Handle mouse drag end
function handleDragEnd() {
  isDragging.value = false
}

// Handle touch start for pinch zoom
function handleTouchStart(event) {
  if (props.size !== 'modal' || event.touches.length !== 2) return
  
  const touch1 = event.touches[0]
  const touch2 = event.touches[1]
  
  initialDistance = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  )
  initialZoom = zoomLevel.value
}

// Handle touch move for pinch zoom
function handleTouchMove(event) {
  if (props.size !== 'modal' || event.touches.length !== 2) return
  
  const touch1 = event.touches[0]
  const touch2 = event.touches[1]
  
  const currentDistance = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  )
  
  const scale = currentDistance / initialDistance
  const newZoom = Math.max(0.5, Math.min(3, initialZoom * scale))
  
  zoomLevel.value = newZoom
  
  // Reset pan if zoomed out to 1x or below
  if (newZoom <= 1) {
    panX.value = 0
    panY.value = 0
  }
  
  event.preventDefault()
}

// Reset zoom when modal closes
function resetZoom() {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
  isDragging.value = false
}

// Override closeModal to reset zoom
function closeModalWithReset() {
  resetZoom()
  closeModal()
}

defineExpose({ reveal, flip })
</script>

<template>
  <!-- Modal Backdrop -->
  <div 
    v-if="size === 'modal'" 
    class="modal-backdrop"
    @click="handleBackdropClick"
    @keydown="handleEscape"
    tabindex="0"
  >
    <div 
      class="tarot-card-container modal-container"
      :style="{ 
        width: cardDimensions.width, 
        height: cardDimensions.height,
        cursor: isDragging ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'pointer')
      }"
      @click.stop="flip"
      @wheel="handleWheel"
      @dblclick="handleDoubleClick"
      @mousedown="handleDragStart"
      @mousemove="handleDragMove"
      @mouseup="handleDragEnd"
      @mouseleave="handleDragEnd"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
    >
      <button class="modal-close-btn" @click.stop="closeModalWithReset" aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <!-- Zoom wrapper to separate zoom transform from flip transform -->
      <div class="zoom-wrapper" :style="{ transform: cardTransform }">
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
          :loading="size === 'modal' ? 'eager' : 'lazy'"
          class="card-image"
        />
        <div class="card-glow"></div>
      </div>
      
      <!-- Card Front -->
      <div class="tarot-card-face tarot-card-front">
        <img 
          :src="frontImage" 
          :alt="cardName"
          :loading="size === 'modal' ? 'eager' : 'lazy'"
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
    
    <!-- Zoom Indicator -->
    <div v-if="zoomLevel !== 1" class="zoom-indicator">
      {{ Math.round(zoomLevel * 100) }}%
    </div>
    </div>
  </div>
  
  <!-- Regular Card (non-modal) -->
  <div 
    v-else
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

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
  padding: 2rem;
  box-sizing: border-box;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  position: relative;
  animation: modalAppear 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  user-select: none;
  touch-action: none;
}

/* Zoom wrapper - handles zoom/pan transform */
.zoom-wrapper {
  width: 100%;
  height: 100%;
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.modal-container .tarot-card {
  /* Card handles flip transform only */
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid var(--color-secondary-champagne-gold);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary-champagne-gold);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.modal-close-btn:hover {
  background: var(--color-secondary-champagne-gold);
  color: var(--color-primary-deep-indigo);
  transform: rotate(90deg);
}

.modal-close-btn:focus {
  outline: 2px solid var(--color-secondary-champagne-gold);
  outline-offset: 4px;
}

/* Scale modal card for better visibility */
.modal-container .tarot-card-face {
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(157, 78, 221, 0.5),
    0 0 0 3px var(--color-secondary-champagne-gold),
    inset 0 0 0 2px rgba(244, 228, 193, 0.3);
}

.modal-container:hover .tarot-card-face {
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.9),
    0 0 100px rgba(157, 78, 221, 0.6),
    0 0 0 3px var(--color-secondary-champagne-gold),
    inset 0 0 0 2px rgba(244, 228, 193, 0.4);
}

/* Zoom Indicator */
.zoom-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: var(--color-secondary-champagne-gold);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  border: 1px solid var(--color-secondary-champagne-gold);
  backdrop-filter: blur(4px);
  z-index: 10001;
  pointer-events: none;
  animation: fadeInZoom 0.2s ease;
}

@keyframes fadeInZoom {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

/* Responsive modal size */
@media (max-width: 768px) {
  .modal-container {
    width: 280px !important;
    height: 490px !important;
  }
  
  .modal-close-btn {
    top: 0.75rem;
    right: 0.75rem;
    width: 2rem;
    height: 2rem;
  }
  
  .zoom-indicator {
    bottom: 1rem;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
