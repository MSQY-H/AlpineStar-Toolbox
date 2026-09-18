<template>
  <v-container class="py-6" fluid>
    <div class="custom-card">
      <h2 class="text-2xl font-semibold mb-6">外观</h2>
      <div class="flex items-center justify-between gap-4">
        <div class="text-base font-medium">深色模式</div>
        <v-select
          v-model="darkMode"
          :items="darkModeOptions"
          density="compact"
          variant="outlined"
          hide-details
          class="max-w-[240px] shrink-0"
        />
      </div>
    </div>

    <div class="custom-card mt-6">
      <h2 class="text-2xl font-semibold mb-6">离线缓存</h2>

      <div class="flex items-center justify-between gap-4">
        <div class="text-base font-medium">启用离线缓存</div>
        <v-switch
          v-model="offlineEnabled"
          color="primary"
          hide-details
          :loading="isLoading"
          :disabled="isLoading"
          @update:model-value="handleOfflineToggle"
          inset="material"
          class="shrink-0"
        />
      </div>

      <!-- 进度条带出现过渡 -->
      <transition name="progress-fade">
        <div v-if="showProgress" class="mt-4">
          <v-progress-linear
            :model-value="progressValue"
            color="primary"
            height="8"
            rounded
          />
          <div class="text-caption text-medium-emphasis mt-1">
            {{ progressText }}
          </div>
        </div>
      </transition>
    </div>

    <v-snackbar
      v-model="snackbarVisible"
      :color="statusType"
      timeout="4000"
      location="bottom"
    >
      {{ statusMessage }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useTheme } from 'vuetify'

// ============ 深色模式 ============
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

// ============ 离线缓存 ============
const offlineEnabled = ref(false)
const isLoading = ref(false)
const showProgress = ref(false)
const progressValue = ref(0)
const currentCached = ref(0)
const totalToCache = ref(0)
const statusMessage = ref('')
const statusType = ref<'success' | 'info' | 'error' | 'warning'>('info')
const snackbarVisible = ref(false)

const progressText = computed(() => {
  if (totalToCache.value === 0) return '准备缓存...'
  return `正在缓存资源 ${currentCached.value}/${totalToCache.value} (${progressValue.value}%)`
})

// ============ BroadcastChannel 仅用于接收进度 ============
const CHANNEL_NAME = 'sw-cache-channel'
let broadcastChannel: BroadcastChannel | null = null

function showSnackbar(message: string, type: 'success' | 'info' | 'error' | 'warning') {
  statusMessage.value = message
  statusType.value = type
  snackbarVisible.value = true
}

function handleMessage(data: any) {
  if (!data) return
  switch (data.type) {
    case 'CACHE_PROGRESS':
      progressValue.value = data.progress
      currentCached.value = data.current
      totalToCache.value = data.total
      showProgress.value = true
      break
    case 'CACHE_COMPLETE':
      progressValue.value = 100
      currentCached.value = totalToCache.value
      showProgress.value = false
      isLoading.value = false
      offlineEnabled.value = true
      showSnackbar('离线缓存已就绪', 'success')
      localStorage.setItem('settings-offline-enabled', 'true')
      break
    case 'CACHE_ERROR':
      showProgress.value = false
      isLoading.value = false
      offlineEnabled.value = false
      showSnackbar(`缓存失败：${data.error}`, 'error')
      localStorage.removeItem('settings-offline-enabled')
      break
    case 'CACHE_CLEARED':
      showSnackbar('缓存已清除', 'info')
      break
  }
}

function setupBroadcastChannel() {
  if (broadcastChannel) return
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME)
    broadcastChannel.onmessage = (event) => {
      console.log('[页面] 收到 SW 消息:', event.data)
      handleMessage(event.data)
    }
  } catch (e) {
    console.warn('[页面] BroadcastChannel 不可用，使用 message 事件回退')
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        handleMessage(event.data)
      })
    }
  }
}

function closeBroadcastChannel() {
  if (broadcastChannel) {
    broadcastChannel.close()
    broadcastChannel = null
  }
}

async function sendToSW(data: any) {
  if (!('serviceWorker' in navigator)) return
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(data)
    return
  }
  const reg = await navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL)
  if (reg && reg.active) {
    reg.active.postMessage(data)
  } else if (reg && reg.waiting) {
    reg.waiting.postMessage(data)
  } else if (reg && reg.installing) {
    reg.installing.postMessage(data)
  } else {
    console.warn('[页面] 无法找到可用的 Service Worker 来发送消息')
  }
}

async function enableOffline() {
  if (!('serviceWorker' in navigator)) {
    showSnackbar('当前浏览器不支持 Service Worker', 'error')
    offlineEnabled.value = false
    return
  }

  isLoading.value = true
  showProgress.value = true
  progressValue.value = 0
  currentCached.value = 0
  totalToCache.value = 0

  setupBroadcastChannel()

  try {
    const baseUrl = import.meta.env.BASE_URL
    let reg = await navigator.serviceWorker.getRegistration(baseUrl)
    if (!reg) {
      reg = await navigator.serviceWorker.register(`${baseUrl}sw.js`, { scope: baseUrl })
    }

    if (reg.installing) {
      await new Promise<void>((resolve) => {
        reg!.installing!.addEventListener('statechange', (e) => {
          if ((e.target as ServiceWorker).state === 'activated') resolve()
        })
      })
    } else if (reg.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' })
      await new Promise<void>((resolve) => {
        reg!.waiting!.addEventListener('statechange', (e) => {
          if ((e.target as ServiceWorker).state === 'activated') resolve()
        })
      })
    }

    await sendToSW({ type: 'START_CACHE' })

    setTimeout(() => {
      if (isLoading.value && showProgress.value && progressValue.value === 0) {
        showSnackbar('正在后台缓存资源，请稍候...', 'info')
      }
    }, 5000)
  } catch (err) {
    console.error('启用失败:', err)
    isLoading.value = false
    showProgress.value = false
    offlineEnabled.value = false
    showSnackbar(`启用失败：${err instanceof Error ? err.message : '未知错误'}`, 'error')
    localStorage.removeItem('settings-offline-enabled')
  }
}

async function disableOffline() {
  isLoading.value = true

  try {
    await sendToSW({ type: 'STOP_CACHE' })

    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map(key => caches.delete(key)))
    }

    localStorage.removeItem('settings-offline-enabled')
    offlineEnabled.value = false
    showProgress.value = false
    isLoading.value = false
    showSnackbar('离线缓存已禁用，缓存已清除', 'success')
  } catch (err) {
    isLoading.value = false
    showSnackbar(`禁用失败：${err instanceof Error ? err.message : '未知错误'}`, 'error')
  }
}

function handleOfflineToggle(val: boolean) {
  if (val) enableOffline()
  else disableOffline()
}

onMounted(() => {
  const saved = localStorage.getItem('settings-dark-mode')
  if (saved) darkMode.value = saved
  applyTheme(darkMode.value)
  mediaQuery.addEventListener('change', onSystemChange)

  const offlineSaved = localStorage.getItem('settings-offline-enabled')
  if (offlineSaved === 'true') {
    offlineEnabled.value = true
    setupBroadcastChannel()
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL).then(reg => {
        if (!reg) {
          enableOffline()
        }
      })
    }
  }
})

onUnmounted(() => {
  mediaQuery.removeEventListener('change', onSystemChange)
  closeBroadcastChannel()
})

watch(darkMode, (val) => {
  localStorage.setItem('settings-dark-mode', val)
  applyTheme(val)
})
</script>

<style scoped>
/* 进度条出现/消失的过渡 */
.progress-fade-enter-active,
.progress-fade-leave-active {
  transition:
    opacity 0.25s ease,
    max-height 0.25s ease,
    margin-top 0.25s ease;
  overflow: hidden;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0 !important;
}

.progress-fade-enter-to,
.progress-fade-leave-from {
  opacity: 1;
  max-height: 100px;
}
</style>