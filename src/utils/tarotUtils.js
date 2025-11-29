/**
 * Tarot Card Utility Functions
 * Helper functions for managing tarot card assets and data
 */

// Use Vite's glob import to eagerly load all card images
const cardImages = import.meta.glob('../assets/tarot-deck/major-arcana/*.{png,jpg,webp}', {
    eager: true,
    import: 'default'
})

// Map card names to their numeric index (matching the file naming: 0.png, 1.png, etc.)
const CARD_INDEX_MAP = {
    'The Fool': 0,
    'The Magician': 1,
    'The High Priestess': 2,
    'The Empress': 3,
    'The Emperor': 4,
    'The Hierophant': 5,
    'The Lovers': 6,
    'The Chariot': 7,
    'Strength': 8,
    'The Hermit': 9,
    'Wheel of Fortune': 10,
    'Justice': 11,
    'The Hanged Man': 12,
    'Death': 13,
    'Temperance': 14,
    'The Devil': 15,
    'The Tower': 16,
    'The Star': 17,
    'The Moon': 18,
    'The Sun': 19,
    'Judgement': 20,
    'The World': 21
}

/**
 * Get the image path for a tarot card
 * Tries to load real image first, falls back to procedural generation
 * @param {string} cardName - The name of the card (e.g., "The Fool")
 * @returns {string} - Image URL or data URI
 */
export function getCardImage(cardName) {
    const index = CARD_INDEX_MAP[cardName]

    if (index !== undefined) {
        // Try different file extensions
        const extensions = ['png', 'jpg', 'webp']

        for (const ext of extensions) {
            const imagePath = `../assets/tarot-deck/major-arcana/${index}.${ext}`
            if (cardImages[imagePath]) {
                return cardImages[imagePath]
            }
        }
    }

    // Fallback to procedural generation if image not found
    console.warn(`Card image not found for: ${cardName}, using procedural fallback`)
    return generatePlaceholderCard(cardName)
}

/**
 * Get card back image
 * Tries to load real card back, falls back to procedural generation
 * @returns {string} - Card back image URL or data URI
 */
export function getCardBack() {
    // Try to load card-back image
    const extensions = ['png', 'jpg', 'webp']

    for (const ext of extensions) {
        const backPath = `../assets/tarot-deck/card-back.${ext}`
        if (cardImages[backPath]) {
            return cardImages[backPath]
        }
    }

    // Fallback to procedural generation
    return generatePlaceholderCardBack()
}

/**
 * Fallback: Generate placeholder card using canvas
 * @param {string} cardName - The name of the card
 * @returns {string} - Data URI for the generated card
 */
function generatePlaceholderCard(cardName) {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 350
    const ctx = canvas.getContext('2d')

    // Create a beautiful gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 350)
    gradient.addColorStop(0, '#3d2463')    // Royal purple
    gradient.addColorStop(0.5, '#1a1338')  // Deep indigo
    gradient.addColorStop(1, '#1c1129')    // Dark violet

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 200, 350)

    // Add mystical border
    ctx.strokeStyle = '#f4e4c1' // Champagne gold
    ctx.lineWidth = 3
    ctx.strokeRect(10, 10, 180, 330)

    // Add decorative corners
    ctx.fillStyle = '#f4e4c1'
    const cornerSize = 15
    // Top-left
    ctx.fillRect(8, 8, cornerSize, 3)
    ctx.fillRect(8, 8, 3, cornerSize)
    // Top-right
    ctx.fillRect(200 - 8 - cornerSize, 8, cornerSize, 3)
    ctx.fillRect(200 - 11, 8, 3, cornerSize)
    // Bottom-left
    ctx.fillRect(8, 350 - 11, cornerSize, 3)
    ctx.fillRect(8, 350 - 8 - cornerSize, 3, cornerSize)
    // Bottom-right
    ctx.fillRect(200 - 8 - cornerSize, 350 - 11, cornerSize, 3)
    ctx.fillRect(200 - 11, 350 - 8 - cornerSize, 3, cornerSize)

    // Add card name
    ctx.fillStyle = '#f4e4c1'
    ctx.font = 'bold 16px Cinzel, serif'
    ctx.textAlign = 'center'
    ctx.fillText(cardName.toUpperCase(), 100, 180)

    // Add mystical symbol (simplified)
    ctx.font = '48px serif'
    ctx.fillText('✦', 100, 140)

    return canvas.toDataURL()
}

/**
 * Fallback: Generate placeholder card back using canvas
 * @returns {string} - Data URI for the generated card back
 */
function generatePlaceholderCardBack() {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 350
    const ctx = canvas.getContext('2d')

    // Deep purple background
    ctx.fillStyle = '#3d2463'
    ctx.fillRect(0, 0, 200, 350)

    // Gold border
    ctx.strokeStyle = '#f4e4c1'
    ctx.lineWidth = 3
    ctx.strokeRect(10, 10, 180, 330)

    // Create mystical pattern
    ctx.fillStyle = 'rgba(157, 78, 221, 0.3)'
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 5; j++) {
            ctx.beginPath()
            ctx.arc(40 + i * 20, 40 + j * 60, 5, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    // Central mystical symbol
    ctx.fillStyle = '#f4e4c1'
    ctx.font = '64px serif'
    ctx.textAlign = 'center'
    ctx.fillText('🔮', 100, 195)

    return canvas.toDataURL()
}

/**
 * Convert card name to kebab-case for file naming
 * @param {string} name - Card name
 * @returns {string} - Kebab-case filename
 */
export function toKebabCase(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
}

/**
 * Major Arcana card list
 */
export const MAJOR_ARCANA = [
    'The Fool',
    'The Magician',
    'The High Priestess',
    'The Empress',
    'The Emperor',
    'The Hierophant',
    'The Lovers',
    'The Chariot',
    'Strength',
    'The Hermit',
    'Wheel of Fortune',
    'Justice',
    'The Hanged Man',
    'Death',
    'Temperance',
    'The Devil',
    'The Tower',
    'The Star',
    'The Moon',
    'The Sun',
    'Judgement',
    'The World'
]

/**
 * Get a random card from Major Arcana
 * @returns {Object} - Card object with name and orientation
 */
export function drawRandomCard() {
    const randomCard = MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)]
    const randomOrientation = Math.random() > 0.5 ? 'upright' : 'reversed'

    return {
        cardName: randomCard,
        orientation: randomOrientation
    }
}

/**
 * Draw multiple random cards (no duplicates)
 * Uses Fisher-Yates shuffle for true randomization
 * @param {number} count - Number of cards to draw
 * @returns {Array} - Array of card objects
 */
export function drawMultipleCards(count = 3) {
    // Create a copy of the array to shuffle
    const deck = [...MAJOR_ARCANA]

    // Fisher-Yates shuffle algorithm for true randomization
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]
    }

    // Take the first 'count' cards and assign random orientations
    return deck.slice(0, count).map(cardName => ({
        cardName,
        orientation: Math.random() > 0.5 ? 'upright' : 'reversed'
    }))
}
