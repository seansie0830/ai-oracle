import { defineStore } from 'pinia'
import i18n from '@/i18n'

export const useI18nStore = defineStore('i18n', {
    state: () => ({
        language: 'en', // default language
    }),

    getters: {
        currentLanguage: (state) => state.language,
        isEnglish: (state) => state.language === 'en',
        isChinese: (state) => state.language === 'zh-TW',
    },

    actions: {
        async setLanguage(lang) {
            // Lazy load locale messages before switching
            const { loadLocaleMessages } = await import('@/i18n')
            await loadLocaleMessages(lang)

            this.language = lang
            localStorage.setItem('userLanguage', lang)

            // Update document language attribute
            document.documentElement.lang = lang

            // Update vue-i18n locale
            if (i18n.global.locale.value !== undefined) {
                i18n.global.locale.value = lang
            } else {
                i18n.global.locale = lang
            }
        },

        async initLanguage() {
            const savedLanguage = localStorage.getItem('userLanguage')
            if (savedLanguage) {
                await this.setLanguage(savedLanguage)
            } else {
                // Try to detect browser language
                const browserLang = navigator.language
                if (browserLang.includes('zh')) {
                    await this.setLanguage('zh-TW')
                } else {
                    await this.setLanguage('en')
                }
            }
        }
    }
})
