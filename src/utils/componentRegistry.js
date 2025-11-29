/**
 * Tarot Component Registry
 * Central registry for dynamically injecting tarot visualization components
 */

import TarotCard from '@/components/TarotCard.vue'
import TarotSpread from '@/components/TarotSpread.vue'
import TarotDeck from '@/components/TarotDeck.vue'

/**
 * Component registry mapping
 * Maps component names from LLM protocol to actual Vue components
 */
export const tarotComponentRegistry = {
    TarotCard,
    TarotSpread,
    TarotDeck
}

/**
 * Check if a component name is valid
 * @param {string} componentName - Name of the component
 * @returns {boolean} - True if component exists in registry
 */
export function isValidComponent(componentName) {
    return componentName in tarotComponentRegistry
}

/**
 * Get component from registry
 * @param {string} componentName - Name of the component
 * @returns {Component|null} - Vue component or null if not found
 */
export function getComponent(componentName) {
    return tarotComponentRegistry[componentName] || null
}

/**
 * Validate component data structure
 * @param {string} componentName - Name of the component
 * @param {Object} data - Component props data
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateComponentData(componentName, data) {
    const errors = []

    switch (componentName) {
        case 'TarotCard':
            if (!data.cardName) {
                errors.push('TarotCard requires cardName')
            }
            if (data.orientation && !['upright', 'reversed'].includes(data.orientation)) {
                errors.push('TarotCard orientation must be "upright" or "reversed"')
            }
            break

        case 'TarotSpread':
            if (!data.cards || !Array.isArray(data.cards)) {
                errors.push('TarotSpread requires cards array')
            }
            if (data.spreadType && !['three-card', 'celtic-cross', 'single-card'].includes(data.spreadType)) {
                errors.push('TarotSpread spreadType must be "three-card", "celtic-cross", or "single-card"')
            }
            break

        case 'TarotDeck':
            if (data.mode && !['single', 'multiple'].includes(data.mode)) {
                errors.push('TarotDeck mode must be "single" or "multiple"')
            }
            break

        default:
            errors.push(`Unknown component: ${componentName}`)
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

/**
 * Create a component message object for the chat stream
 * @param {string} componentName - Name of the component
 * @param {Object} data - Component props data
 * @returns {Object} - Message object for chat store
 */
export function createComponentMessage(componentName, data) {
    const validation = validateComponentData(componentName, data)

    if (!validation.valid) {
        console.error('Invalid component data:', validation.errors)
        return null
    }

    return {
        type: 'component',
        componentName,
        data,
        timestamp: Date.now()
    }
}

export default tarotComponentRegistry
