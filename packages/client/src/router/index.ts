import { createRouter as createVueRouter, createWebHistory } from 'vue-router'

export default createVueRouter({
  scrollBehavior: () => ({ top: 0 }),
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/chat'
    },
    {
      path: '/chat',
      component: () => import('@/views/chat/index.vue')
    }
  ]
})
