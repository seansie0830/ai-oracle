import { createI18n } from 'vue-i18n'

// Import only the default locale eagerly
import en from './locales/en'

// Create i18n instance with minimal initial data
const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: 'en', // Default locale
    fallbackLocale: 'en',
    messages: {
        en // Only load English initially
    }
})

// Lazy loading function for locale messages
export async function loadLocaleMessages(locale) {
    // If already loaded, return early
    if (i18n.global.availableLocales.includes(locale)) {
        return
    }

    // Dynamically import the locale file
    let messages
    switch (locale) {
        case 'zh-TW':
            messages = await import('./locales/zh-TW.js')
            break
        case 'en':
            messages = await import('./locales/en.js')
            break
        default:
            console.warn(`Locale ${locale} not found, falling back to English`)
            return
    }

    // Set the locale messages
    i18n.global.setLocaleMessage(locale, messages.default)
}

export default i18n

