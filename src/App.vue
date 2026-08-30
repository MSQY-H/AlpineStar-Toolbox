<template>
  <v-app>
    <AppBar @toggle-drawer="drawer = !drawer" @go-home="goHome" />
    <NavDrawer v-model="drawer" />
    <v-main class="pa-0 bg-surface">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import NavDrawer from '@/components/NavDrawer.vue'

const drawer = ref(false)
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>
