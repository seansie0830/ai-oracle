import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      // Lazy load the main component
      component: () => import('@/components/ChatBox.vue')
    }
  ],
})

export default router
