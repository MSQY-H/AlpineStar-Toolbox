/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Index,
      meta: { title: 'AlpineStar Toolbox', icon: 'mdi-home-outline' },
    },
    {
      path: '/tools',
      component: () => import('@/pages/tools/index.vue'),
      meta: { title: '工具', icon: 'mdi-wrench-outline' },
    },
    {
      path: '/tools/timestamp',
      component: () => import('@/pages/tools/timestamp.vue'),
      meta: { title: '时间戳转换', icon: 'mdi-clock-outline' },
    },
    {
      path: '/settings',
      component: () => import('@/pages/settings.vue'),
      meta: { title: '设置', icon: 'mdi-cog-outline' },
    },
    {
      path: '/about',
      component: () => import('@/pages/about.vue'),
      meta: { title: '关于', icon: 'mdi-information-outline' },
    },
    {
      path: '/tools/color-picker',
      component: () => import('@/pages/tools/color-picker.vue'),
      meta: { title: '颜色选择与转换', icon: 'mdi-palette-outline' },
    },
  ],
})

export default router
