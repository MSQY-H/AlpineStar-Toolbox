<template>
  <v-container class="py-6" fluid>
    <div class="custom-card">
      <h2 class="text-2xl font-semibold mb-6">外观</h2>

      <div class="mb-2">
        <div class="text-base font-medium">深色模式</div>
      </div>

      <v-select
        v-model="darkMode"
        :items="darkModeOptions"
        density="compact"
        variant="outlined"
        hide-details
        class="max-w-[240px]"
      />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const darkMode = ref('system')

const darkModeOptions = [
  { title: '浅色', value: 'light' },
  { title: '深色', value: 'dark' },
  { title: '跟随系统', value: 'system' },
]

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const applyTheme = (mode: string) => {
  if (mode === 'system') {
    vuetifyTheme.global.name.value = mediaQuery.matches ? 'dark' : 'light'
  } else {
    vuetifyTheme.global.name.value = mode
  }
}

const onSystemChange = () => {
  if (darkMode.value === 'system') applyTheme('system')
}

onMounted(() => {
  const saved = localStorage.getItem('settings-dark-mode')
  if (saved) darkMode.value = saved
  applyTheme(darkMode.value)
  mediaQuery.addEventListener('change', onSystemChange)
})

onUnmounted(() => {
  mediaQuery.removeEventListener('change', onSystemChange)
})

watch(darkMode, (val) => {
  localStorage.setItem('settings-dark-mode', val)
  applyTheme(val)
})
</script>
