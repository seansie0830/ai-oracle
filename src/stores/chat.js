import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
    const messages = ref([])

    function addMessage(message) {
        messages.value.push(message)
    }

    function clearMessages() {
        messages.value = []
    }

    function updateMessage(id, updates) {
        const index = messages.value.findIndex(m => m.id === id)
        if (index !== -1) {
            messages.value[index] = { ...messages.value[index], ...updates }
        }
    }

    function replaceMessage(id, newMessage) {
        const index = messages.value.findIndex(m => m.id === id)
        if (index !== -1) {
            messages.value[index] = newMessage
        }
    }

    return {
        messages,
        addMessage,
        clearMessages,
        updateMessage,
        replaceMessage
    }
})
