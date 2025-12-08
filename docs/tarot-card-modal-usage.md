# TarotCard Modal Size Option

## Overview

The `TarotCard` component now supports a `modal` size option that displays the card in a full-screen modal view with built-in functionality for:
- Full-screen backdrop overlay
- Close button (styled to match the tarot theme)
- Click-outside to close
- Escape key to close
- Smooth animations

## Usage

### Basic Example

```vue
<template>
  <div>
    <!-- Trigger button or card -->
    <button @click="showModal = true">View Card</button>
    
    <!-- Modal card -->
    <TarotCard 
      v-if="showModal"
      cardName="The Fool" 
      size="modal"
      :isRevealed="true"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TarotCard from '@/components/TarotCard.vue'

const showModal = ref(false)
</script>
```

### Size Options

The `size` prop now accepts four values:
- `'small'` - 120px × 210px
- `'medium'` - 160px × 280px (default)
- `'large'` - 200px × 350px
- `'modal'` - 400px × 700px with full-screen overlay

### Modal-Specific Features

When `size="modal"`:

1. **Full-screen backdrop**: Semi-transparent black background with blur effect
2. **Close button**: Positioned above the card with hover/focus effects
3. **Close event**: The component emits a `@close` event when:
   - User clicks the close button
   - User clicks outside the card (on the backdrop)
   - User presses the Escape key
4. **Animations**: Smooth fade-in for backdrop and scale-up for the card
5. **Responsive**: On mobile (< 768px), the card scales down to 280px × 490px

### Real-World Example (CardGallery.vue)

```vue
<template>
  <div>
    <!-- Card grid -->
    <div class="cards-grid">
      <div 
        v-for="card in cards" 
        :key="card.name"
        @click="openCardDetails(card)"
      >
        <TarotCard 
          :cardName="card.name" 
          size="medium"
          :isRevealed="true"
        />
      </div>
    </div>
    
    <!-- Modal view -->
    <TarotCard 
      v-if="isModalOpen && selectedCard"
      :cardName="selectedCard.name" 
      size="modal"
      :isRevealed="true"
      behavior="one-way"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TarotCard from '@/components/TarotCard.vue'

const selectedCard = ref(null)
const isModalOpen = ref(false)

function openCardDetails(card) {
  selectedCard.value = card
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedCard.value = null
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | String | `'medium'` | Card size: `'small'`, `'medium'`, `'large'`, or `'modal'` |
| `cardName` | String | *required* | Name of the tarot card |
| `orientation` | String | `'upright'` | Card orientation: `'upright'` or `'reversed'` |
| `isRevealed` | Boolean | `false` | Whether the card is face-up |
| `behavior` | String | `'normal'` | Flip behavior: `'normal'`, `'one-way'`, or `'block'` |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `@close` | none | Emitted when modal is closed (only for `size="modal"`) |

## Styling

The modal uses the following z-index and styling:
- Backdrop: `z-index: 9999`
- Close button: `z-index: 10000`
- Theme-aware colors matching the application's tarot aesthetic

## Notes

- The `@close` event is **only emitted when `size="modal"`**. Other sizes don't emit this event.
- The modal handles its own focus management and keyboard events.
- The backdrop and close button are only rendered when `size="modal"`.
- For non-modal sizes, the card is rendered inline as a regular component.
