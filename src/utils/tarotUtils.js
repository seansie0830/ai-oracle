/**
 * Tarot Card Utility Functions
 * Helper functions for managing tarot card assets and data
 * 
 * FALLBACK STRATEGY:
 * 1. Primary: Load real image assets via Vite glob imports
 * 2. Format Support: Checks for .png, .jpg, and .webp extensions
 * 3. Graceful Degradation: Falls back to procedural canvas generation if assets missing
 * 
 * This ensures the app works seamlessly with or without image files.
 */

// Use Vite's glob import to eagerly load all card images from major arcana
const cardImages = import.meta.glob('../assets/tarot-deck/major-arcana/*.{png,jpg,webp}', {
    eager: true,
    import: 'default'
})

// Use Vite's glob import to eagerly load minor arcana card images
const minorArcanaImages = {
    pentacles: import.meta.glob('../assets/tarot-deck/minor-arcna/pentacles/*.{png,jpg,webp}', {
        eager: true,
        import: 'default'
    }),
    cups: import.meta.glob('../assets/tarot-deck/minor-arcna/cup/*.{png,jpg,webp}', {
        eager: true,
        import: 'default'
    }),
    wands: import.meta.glob('../assets/tarot-deck/minor-arcna/wand/*.{png,jpg,webp}', {
        eager: true,
        import: 'default'
    }),
    swords: import.meta.glob('../assets/tarot-deck/minor-arcna/sword/*.{png,jpg,webp}', {
        eager: true,
        import: 'default'
    })
}

// Use Vite's glob import to eagerly load card back images (supports multiple formats)
const cardBackImages = import.meta.glob('../assets/tarot-deck/card-back.{png,jpg,webp}', {
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
    'Wheel of Fortune': 'major_10',
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
 * Get the image path for a minor arcana card
 * Tries to load real image first, falls back to procedural generation
 * @param {string} suit - The suit (pentacles, cups, wands, swords)
 * @param {string|number} rank - The rank (1-10, 'page', 'knight', 'queen', 'king')
 * @returns {string} - Image URL or data URI
 */
export function getMinorArcanaImage(suit, rank) {
    const normalizedSuit = suit.toLowerCase()
    const normalizedRank = String(rank).toLowerCase()

    // Map 'cups' to 'cup' directory, keep others as-is
    const suitKey = normalizedSuit === 'cups' ? 'cups' : normalizedSuit
    const dirName = normalizedSuit === 'cups' ? 'cup' : normalizedSuit === 'wands' ? 'wand' : normalizedSuit === 'swords' ? 'sword' : normalizedSuit

    if (minorArcanaImages[suitKey]) {
        const extensions = ['png', 'jpg', 'webp']

        for (const ext of extensions) {
            const imagePath = `../assets/tarot-deck/minor-arcna/${dirName}/${normalizedRank}.${ext}`
            if (minorArcanaImages[suitKey][imagePath]) {
                return minorArcanaImages[suitKey][imagePath]
            }
        }
    }

    // Fallback to procedural generation if image not found
    const cardName = `${rank} of ${suit}`
    console.warn(`Minor arcana image not found for: ${cardName}, using procedural fallback`)
    return generatePlaceholderCard(cardName)
}

/**
 * Get the image path for a tarot card (works with both major and minor arcana)
 * Tries to load real image first, falls back to procedural generation
 * @param {string} cardName - The name of the card (e.g., "The Fool" or "Ace of Cups")
 * @returns {string} - Image URL or data URI
 */
export function getCardImage(cardName) {
    // Check if this is a minor arcana card (format: "Rank of Suit")
    const minorArcanaPattern = /^(.+?)\s+of\s+(.+)$/i
    const match = cardName.match(minorArcanaPattern)

    if (match) {
        // This is a minor arcana card
        const rank = match[1].trim()
        const suit = match[2].trim()

        // Convert rank name to filename format
        let rankFile = rank.toLowerCase()
        if (rankFile === 'ace') rankFile = '1'

        return getMinorArcanaImage(suit, rankFile)
    }

    // This is a major arcana card - use existing logic
    const index = CARD_INDEX_MAP[cardName]

    if (index !== undefined) {
        // Try different file extensions
        const extensions = ['png', 'jpg', 'webp']

        for (const ext of extensions) {
            const imagePath = `../assets/tarot-deck/major-arcana/${index}.${ext}`

            // Debug logging for Wheel of Fortune
            if (cardName === 'Wheel of Fortune') {
                console.log(`[TarotDebug] Looking for Wheel of Fortune at: ${imagePath}`)
                console.log(`[TarotDebug] Exists in map? ${!!cardImages[imagePath]}`)
                if (!cardImages[imagePath]) {
                    console.log('[TarotDebug] Available keys:', Object.keys(cardImages))
                }
            }

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
 * Tries to load real card back from glob import, falls back to procedural generation
 * Supports multiple formats: png, jpg, webp
 * @returns {string} - Card back image URL or data URI
 */
export function getCardBack() {
    // Try to find card back image with different extensions
    const extensions = ['png', 'jpg', 'webp']

    for (const ext of extensions) {
        const backPath = `../assets/tarot-deck/card-back.${ext}`
        if (cardBackImages[backPath]) {
            return cardBackImages[backPath]
        }
    }

    // Fallback to procedural generation if no image found
    console.warn('Card back image not found in assets, using procedural fallback')
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
 * Major Arcana card list (22 cards)
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
 * Minor Arcana suits
 */
export const MINOR_ARCANA_SUITS = ['Cups', 'Pentacles', 'Wands', 'Swords']

/**
 * Minor Arcana ranks (14 per suit)
 */
export const MINOR_ARCANA_RANKS = [
    'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    'Page', 'Knight', 'Queen', 'King'
]

/**
 * Generate all minor arcana cards (56 cards total)
 * @returns {Array<Object>} Array of card objects with suit and rank
 */
function generateMinorArcanaCards() {
    const cards = []
    for (const suit of MINOR_ARCANA_SUITS) {
        for (const rank of MINOR_ARCANA_RANKS) {
            cards.push({
                suit: suit,
                rank: rank,
                // Create display name like "Ace of Cups", "2 of Pentacles", etc.
                name: `${rank} of ${suit}`
            })
        }
    }
    return cards
}

/**
 * Minor Arcana card list (56 cards)
 */
export const MINOR_ARCANA = generateMinorArcanaCards()

/**
 * Full tarot deck (78 cards: 22 major + 56 minor)
 */
export const FULL_DECK = [
    ...MAJOR_ARCANA.map(name => ({ name, arcana: 'major' })),
    ...MINOR_ARCANA.map(card => ({ ...card, arcana: 'minor' }))
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
 * Draw multiple random cards (no duplicates) from Major Arcana
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

/**
 * Get a random card from the FULL deck (major + minor arcana)
 * @returns {Object} - Card object with cardName, orientation, and arcana type
 */
export function drawRandomCardFromFullDeck() {
    const randomCard = FULL_DECK[Math.floor(Math.random() * FULL_DECK.length)]
    const randomOrientation = Math.random() > 0.5 ? 'upright' : 'reversed'

    return {
        cardName: randomCard.name,
        orientation: randomOrientation,
        arcana: randomCard.arcana,
        // Include suit and rank for minor arcana cards
        ...(randomCard.suit && { suit: randomCard.suit }),
        ...(randomCard.rank && { rank: randomCard.rank })
    }
}

/**
 * Draw multiple random cards (no duplicates) from FULL deck
 * Uses Fisher-Yates shuffle for true randomization
 * @param {number} count - Number of cards to draw
 * @returns {Array} - Array of card objects
 */
export function drawMultipleCardsFromFullDeck(count = 3) {
    // Create a copy of the full deck to shuffle
    const deck = [...FULL_DECK]

    // Fisher-Yates shuffle algorithm for true randomization
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]
    }

    // Take the first 'count' cards and assign random orientations
    return deck.slice(0, count).map(card => ({
        cardName: card.name,
        orientation: Math.random() > 0.5 ? 'upright' : 'reversed',
        arcana: card.arcana,
        // Include suit and rank for minor arcana cards
        ...(card.suit && { suit: card.suit }),
        ...(card.rank && { rank: card.rank })
    }))
}
