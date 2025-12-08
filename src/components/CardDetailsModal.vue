<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TarotCard from '@/components/TarotCard.vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  card: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'show-zoom'])

const { t } = useI18n()
const router = useRouter()

function closeModal() {
  emit('close')
}

function handleTagClick(category) {
  if (!category) return
  
  // Navigate to gallery with category filter
  // This will implicitly close the modal because the new URL won't have cardId
  router.push({
    name: 'gallery',
    query: { category: category.toLowerCase() }
  })
}


// Helper to get translation key
function getCardTranslationKey(cardName) {
  if (!cardName) return ''
  return cardName.toLowerCase().replace(/\s+/g, '_')
}

function handleZoom() {
  emit('show-zoom')
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">×</button>
      
      <div v-if="card" class="modal-body">
        <div class="modal-image-container" @click="handleZoom" style="cursor: pointer;">
          <TarotCard 
            :cardName="card.name" 
            size="large"
            :isRevealed="true"
            behavior="one-way"
          />
        </div>
        
        <div class="modal-info">
          <h2 class="modal-title">{{ card.name }}</h2>
          <div class="modal-tags">
            <span 
              class="tag arcana-tag"
              :class="{ clickable: card.arcana === 'major' }"
              @click="card.arcana === 'major' && handleTagClick('major')"
            >
              {{ card.arcana === 'major' ? t('gallery.majorArcana') : t('gallery.minorArcana') }}
            </span>
            <span 
              v-if="card.suit" 
              class="tag suit-tag clickable"
              @click="handleTagClick(card.suit)"
            >
              {{ card.suit }}
            </span>
          </div>

          
          <div class="card-meaning">
            <h3>{{ t('gallery.meaning') }}</h3>
            <p>{{ t(`cards.${getCardTranslationKey(card.name)}.meaning`) }}</p>
            
            <h3>{{ t('gallery.keywords') }}</h3>
            <p>{{ t(`cards.${getCardTranslationKey(card.name)}.keywords`) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: linear-gradient(135deg, #2a1b3d 0%, #1a1025 100%);
  border: 1px solid #d4af37;
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #f4e4c1;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
}

.modal-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  padding: 3rem;
}

.modal-image-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.modal-image-container:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.modal-info {
  color: #f4e4c1;
}

.modal-title {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  margin: 0 0 1rem;
  color: #d4af37;
}

.modal-tags {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable:hover {
  transform: translateY(-2px);
  filter: brightness(1.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.arcana-tag {
  background: rgba(157, 78, 221, 0.3);
  border: 1px solid #9d4edd;
}

.suit-tag {
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid #d4af37;
}

.card-meaning h3 {
  font-family: 'Cinzel', serif;
  color: #d4af37;
  margin: 1.5rem 0 0.5rem;
  font-size: 1.2rem;
}

.card-meaning p {
  line-height: 1.6;
  color: rgba(244, 228, 193, 0.9);
}

@media (max-width: 768px) {
  .modal-body {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem;
  }
  
  .modal-image-container {
    margin-bottom: 1rem;
  }
  
  .modal-title {
    font-size: 2rem;
  }
}
</style>
