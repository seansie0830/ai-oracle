<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useI18nStore } from '@/stores/i18n'
import { FULL_DECK, getCardImage } from '@/utils/tarotUtils'
import TarotCard from '@/components/TarotCard.vue'

const router = useRouter()
const { t, locale } = useI18n()
const i18nStore = useI18nStore()

// State
const searchQuery = ref('')
const selectedSuit = ref('all')
const selectedCard = ref(null)
const isModalOpen = ref(false)

// Filter options
const suits = ['all', 'major', 'wands', 'cups', 'swords', 'pentacles']

// Filtered cards
const filteredCards = computed(() => {
  return FULL_DECK.filter(card => {
    // Filter by search query
    const query = searchQuery.value.toLowerCase()
    const nameMatch = card.name.toLowerCase().includes(query)
    
    // Filter by suit/arcana
    let suitMatch = true
    if (selectedSuit.value !== 'all') {
      if (selectedSuit.value === 'major') {
        suitMatch = card.arcana === 'major'
      } else {
        suitMatch = card.suit && card.suit.toLowerCase() === selectedSuit.value
      }
    }
    
    return nameMatch && suitMatch
  })
})

// Methods
function openCardDetails(card) {
  selectedCard.value = card
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedCard.value = null
}

function goBack() {
  router.push('/')
}

// Helper to get translation key for card
function getCardTranslationKey(cardName) {
  // Convert "The Fool" to "the_fool", "Ace of Cups" to "ace_of_cups"
  return cardName.toLowerCase().replace(/\s+/g, '_')
}

// Language handling
const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh-TW', name: 'Traditional Chinese', flag: '🇹🇼' }
]

const currentLanguage = computed(() => i18nStore.language)

async function setLanguage(lang) {
  await i18nStore.setLanguage(lang)
  locale.value = lang
}

onMounted(() => {
  i18nStore.initLanguage()
})
</script>

<template>
  <div class="gallery-page">
    <!-- Header -->
    <header class="gallery-header">
      <button class="back-button" @click="goBack">
        <span class="icon">←</span> {{ t('gallery.backToOracle') }}
      </button>
      
      <div class="language-selector">
        <button 
          v-for="lang in availableLanguages" 
          :key="lang.code"
          class="lang-btn"
          :class="{ active: currentLanguage === lang.code }"
          @click="setLanguage(lang.code)"
          :title="lang.name"
        >
          {{ lang.flag }}
        </button>
      </div>

      <h1 class="title">{{ t('gallery.title') }}</h1>
      <p class="subtitle">{{ t('gallery.subtitle') }}</p>
    </header>

    <!-- Controls -->
    <div class="gallery-controls">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="t('gallery.searchPlaceholder')"
          class="search-input"
        />
      </div>
      
      <div class="filter-tabs">
        <button 
          v-for="suit in suits" 
          :key="suit"
          class="filter-tab"
          :class="{ active: selectedSuit === suit }"
          @click="selectedSuit = suit"
        >
          {{ t(`gallery.filters.${suit}`) }}
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="cards-grid">
      <div 
        v-for="card in filteredCards" 
        :key="card.name"
        class="card-item"
        @click="openCardDetails(card)"
      >
        <TarotCard 
          :cardName="card.name" 
          size="medium"
          :isRevealed="true"
          class="gallery-card"
        />
        <div class="card-label">{{ card.name }}</div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredCards.length === 0" class="empty-state">
      <p>{{ t('gallery.noCardsFound') }}</p>
    </div>

    <!-- Details Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">×</button>
        
        <div class="modal-body">
          <div class="modal-image-container">
            <TarotCard 
              :cardName="selectedCard.name" 
              size="large"
              :isRevealed="true"
            />
          </div>
          
          <div class="modal-info">
            <h2 class="modal-title">{{ selectedCard.name }}</h2>
            <div class="modal-tags">
              <span class="tag arcana-tag">
                {{ selectedCard.arcana === 'major' ? t('gallery.majorArcana') : t('gallery.minorArcana') }}
              </span>
              <span v-if="selectedCard.suit" class="tag suit-tag">
                {{ selectedCard.suit }}
              </span>
            </div>
            
            <div class="card-meaning">
              <h3>{{ t('gallery.meaning') }}</h3>
              <p>{{ t(`cards.${getCardTranslationKey(selectedCard.name)}.meaning`) }}</p>
              
              <h3>{{ t('gallery.keywords') }}</h3>
              <p>{{ t(`cards.${getCardTranslationKey(selectedCard.name)}.keywords`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-page {
  min-height: 100vh;
  background: radial-gradient(circle at top center, #2a1b3d 0%, #1a1025 100%);
  color: #f4e4c1;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.back-button {
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: 1px solid rgba(244, 228, 193, 0.3);
  color: #f4e4c1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-button:hover {
  background: rgba(244, 228, 193, 0.1);
  border-color: #f4e4c1;
}

.language-selector {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  background: none;
  border: 1px solid rgba(244, 228, 193, 0.3);
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.lang-btn:hover {
  background: rgba(244, 228, 193, 0.1);
  border-color: #f4e4c1;
  transform: scale(1.1);
}

.lang-btn.active {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.title {
  font-family: 'Cinzel', serif;
  font-size: 3rem;
  margin: 0;
  background: linear-gradient(to right, #f4e4c1, #d4af37);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.subtitle {
  color: rgba(244, 228, 193, 0.7);
  margin-top: 0.5rem;
}

.gallery-controls {
  max-width: 1200px;
  margin: 0 auto 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.7;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(244, 228, 193, 0.2);
  border-radius: 30px;
  color: #f4e4c1;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #f4e4c1;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-tab {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(244, 228, 193, 0.2);
  color: rgba(244, 228, 193, 0.7);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: capitalize;
}

.filter-tab:hover, .filter-tab.active {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  color: #f4e4c1;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card-item:hover {
  transform: translateY(-5px);
}

.card-label {
  margin-top: 1rem;
  font-family: 'Cinzel', serif;
  color: #f4e4c1;
  text-align: center;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: rgba(244, 228, 193, 0.5);
}

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
  
  .title {
    font-size: 2rem;
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
}
</style>
