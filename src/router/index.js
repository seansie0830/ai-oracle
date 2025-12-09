import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
const isTauri = Object.prototype.hasOwnProperty.call(window, '__TAURI_INTERNALS__')

const router = createRouter({
  history: isTauri ? createWebHashHistory() : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      // Lazy load the main component
      component: () => import('@/components/ChatBox.vue')
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('@/views/CardGallery.vue')
    }
  ],
})

export default router
