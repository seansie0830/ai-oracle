<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useI18nStore } from '@/stores/i18n'
import { FULL_DECK } from '@/utils/tarotUtils'
import TarotCard from '@/components/TarotCard.vue'
import CardDetailsModal from '@/components/CardDetailsModal.vue'

// Reactive route query params (e.g., /gallery?search=foo&cardId=bar&category=major&page=2&perPage=24)
const route = useRoute()
const searchParam = computed(() => route.query.search ?? '')
const cardIdParam = computed(() => route.query.cardId ?? '')
const categoryParam = computed(() => route.query.category ?? 'all')
const pageParam = computed(() => {
  const page = parseInt(route.query.page ?? '1', 10)
  return page > 0 ? page : 1
})
const perPageParam = computed(() => {
  const perPage = parseInt(route.query.perPage ?? '24', 10)
  const validSizes = [12, 24, 48, 78]
  return validSizes.includes(perPage) ? perPage : 24
})

const router = useRouter()
const { t, locale } = useI18n()
const i18nStore = useI18nStore()

// State
const searchQuery = ref('')
const selectedSuit = ref('all')
const selectedCard = ref(null)
const isModalOpen = ref(false)
const showCardModal = ref(false)


// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(24)
const perPageOptions = [12, 24, 48, 78] // Available items per page options
const isSyncingFromURL = ref(false) // Flag to prevent circular updates

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

// Pagination computed properties
const totalPages = computed(() => {
  return Math.ceil(filteredCards.value.length / itemsPerPage.value) || 1
})

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCards.value.slice(start, end)
})

const pageNumbers = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Always show first page
  pages.push(1)
  
  // Show current page and neighbors
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i)
    }
  }
  
  // Always show last page if there are multiple pages
  if (total > 1 && !pages.includes(total)) {
    pages.push(total)
  }
  
  return pages
})

// Methods
function openCardDetails(card) {
  selectedCard.value = card
  isModalOpen.value = true
  // Update URL with cardId
  updateURL({ cardId: card.name })
}

function closeModal() {
  isModalOpen.value = false
  selectedCard.value = null
  // Remove cardId from URL
  updateURL({ cardId: undefined })
}

function goBack() {
  router.push('/')
}

// Helper to update URL query params
function updateURL(params) {
  const query = { ...route.query, ...params }
  // Remove undefined values
  Object.keys(query).forEach(key => query[key] === undefined && delete query[key])
  router.replace({ query })
}




// Pagination methods
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to top of gallery
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function nextPage() {
  goToPage(currentPage.value + 1)
}

function prevPage() {
  goToPage(currentPage.value - 1)
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
  // Initialize from route query params
  isSyncingFromURL.value = true
  
  if (searchParam.value) {
    searchQuery.value = searchParam.value
  }
  if (categoryParam.value && suits.includes(categoryParam.value)) {
    selectedSuit.value = categoryParam.value
  }
  if (perPageParam.value) {
    itemsPerPage.value = perPageParam.value
  }
  if (pageParam.value) {
    currentPage.value = pageParam.value
  }
  if (cardIdParam.value) {
    const card = FULL_DECK.find(c => c.id === cardIdParam.value || c.name === cardIdParam.value)
    if (card) {
      selectedCard.value = card
      isModalOpen.value = true
    }
  }
  
  // Reset flag after initialization
  setTimeout(() => {
    isSyncingFromURL.value = false
  }, 100)
})

// Watch URL query params → update UI state
watch(searchParam, (newVal) => {
  searchQuery.value = newVal || ''
})
watch(categoryParam, (newVal) => {
  if (suits.includes(newVal)) {
    selectedSuit.value = newVal
  }
})
watch(pageParam, (newVal) => {
  if (newVal > 0 && newVal !== currentPage.value) {
    currentPage.value = newVal
  }
})
watch(perPageParam, (newVal) => {
  if (perPageOptions.includes(newVal) && newVal !== itemsPerPage.value) {
    itemsPerPage.value = newVal
  }
})
watch(cardIdParam, (newVal) => {
  if (newVal) {
    const card = FULL_DECK.find(c => c.id === newVal || c.name === newVal)
    if (card) {
      selectedCard.value = card
      isModalOpen.value = true
    }
  } else {
    isModalOpen.value = false
    selectedCard.value = null
  }
})

// Watch UI state → update URL query params
watch(searchQuery, (newVal) => {
  updateURL({ search: newVal || undefined })
  // Reset to first page when search changes
  currentPage.value = 1
})
watch(selectedSuit, (newVal) => {
  updateURL({ category: newVal === 'all' ? undefined : newVal })
  // Reset to first page when filter changes
  currentPage.value = 1
})
watch(currentPage, (newVal) => {
  updateURL({ page: newVal > 1 ? String(newVal) : undefined })
})
watch(itemsPerPage, (newVal, oldVal) => {
  // Only update URL if value actually changed
  if (newVal !== oldVal) {
    updateURL({ perPage: newVal !== 24 ? String(newVal) : undefined })
    // Only reset to page 1 if not syncing from URL
    if (!isSyncingFromURL.value) {
      currentPage.value = 1
    }
  }
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
        v-for="card in paginatedCards" 
        :key="card.name"
        class="card-item"
        @click="openCardDetails(card)"
      >
        <TarotCard 
          :cardName="card.name" 
          size="medium"
          :isRevealed="true"
          behavior="one-way"
          class="gallery-card"
        />
        <div class="card-label">{{ card.name }}</div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="filteredCards.length > 0" class="pagination-container">
      <div class="pagination-header">
        <div class="pagination-info">
          {{ t('gallery.showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredCards.length) }} {{ t('gallery.of') }} {{ filteredCards.length }} {{ t('gallery.cards') }}
        </div>
        
        <div class="per-page-selector">
          <label for="itemsPerPage">{{ t('gallery.itemsPerPage') }}:</label>
          <select 
            id="itemsPerPage"
            v-model.number="itemsPerPage" 
            class="per-page-select"
          >
            <option 
              v-for="option in perPageOptions" 
              :key="option" 
              :value="option"
            >
              {{ option === 78 ? t('gallery.all') : option }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="pagination-controls">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          ‹ {{ t('gallery.previous') }}
        </button>
        
        <div class="page-numbers">
          <button
            v-for="page in pageNumbers"
            :key="page"
            class="page-number"
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          {{ t('gallery.next') }} ›
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredCards.length === 0" class="empty-state">
      <p>{{ t('gallery.noCardsFound') }}</p>
    </div>

    <!-- Details Modal -->
    <CardDetailsModal 
      :isOpen="isModalOpen" 
      :card="selectedCard" 
      @close="closeModal" 
      @show-zoom="showCardModal = true"
    />

    <!-- TarotCard Modal Overlay (upper layer) -->
    <TarotCard 
      v-if="isModalOpen && selectedCard && showCardModal"
      :cardName="selectedCard.name" 
      size="modal"
      :isRevealed="true"
      behavior="one-way"
      @close="showCardModal = false"
    />
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

/* Pagination */
.pagination-container {
  max-width: 1400px;
  margin: 3rem auto 2rem;
  padding: 0 1rem;
}

.pagination-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: rgba(244, 228, 193, 0.7);
  font-size: 0.95rem;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(244, 228, 193, 0.7);
  font-size: 0.95rem;
}

.per-page-select {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(244, 228, 193, 0.2);
  color: #f4e4c1;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23f4e4c1' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
}

.per-page-select:hover {
  background-color: rgba(0, 0, 0, 0.5);
  border-color: #d4af37;
}

.per-page-select:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.per-page-select option {
  background: #1a1025;
  color: #f4e4c1;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-btn {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(244, 228, 193, 0.2);
  color: #f4e4c1;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-number {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(244, 228, 193, 0.2);
  color: #f4e4c1;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  transform: scale(1.1);
}

.page-number.active {
  background: rgba(212, 175, 55, 0.3);
  border-color: #d4af37;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
  font-weight: bold;
}



@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
  
  .pagination-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .pagination-info {
    font-size: 0.85rem;
  }
  
  .per-page-selector {
    font-size: 0.85rem;
  }
  
  .pagination-controls {
    gap: 0.5rem;
  }
  
  .page-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .page-number {
    width: 35px;
    height: 35px;
    font-size: 0.85rem;
  }
}
</style>
