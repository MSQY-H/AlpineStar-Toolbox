<template>
  <v-app>
    <AppBar @toggle-drawer="drawer = !drawer" @go-home="goHome" />
    <NavDrawer v-model="drawer" />
    <v-main class="pa-0 bg-surface">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
      <MirrorBanner />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import NavDrawer from '@/components/NavDrawer.vue'
import MirrorBanner from './components/MirrorBanner.vue'

const drawer = ref(false)
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* 页面切换：淡入淡出 + 模糊 */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.25s ease,
    filter 0.25s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(3px);
}
</style>