import { createRouter, createWebHistory } from 'vue-router'
import ChatBox from '@/components/ChatBox.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: ChatBox
    }
  ],
})

export default router
