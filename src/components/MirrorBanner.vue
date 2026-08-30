<template>
  <v-snackbar v-model="showBanner" location="bottom" variant="tonal">
    检测到您在中国大陆，建议访问国内镜像站，速度更快。

    <template v-slot:actions>
      <v-btn
        color="primary"
        variant="text"
        :href="mirrorFullUrl"
        target="_blank"
        rel="noopener"
      >
        前往
      </v-btn>
      <v-btn
        variant="text"
        @click="showBanner = false"
      >
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'

const MIRROR_HOST = 'toolbox.msqy.cc.cd'
const API_URL = 'https://www.loliapi.com/getip/'

const showBanner = ref(false)

const mirrorFullUrl = computed(() => {
  return `https://${MIRROR_HOST}${window.location.pathname}${window.location.search}`
})

onMounted(() => {
  if (window.location.hostname === MIRROR_HOST) return

  const xhr = new XMLHttpRequest()
  xhr.open('GET', API_URL, true)
  xhr.timeout = 5000
  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        const data = JSON.parse(xhr.responseText)
        const country = data.country || data.country_code || data.country_name || ''
        if (/中国|CN|China/i.test(country)) {
          showBanner.value = true
        }
      } catch { /* 忽略 */ }
    }
  }
  xhr.onerror = xhr.ontimeout = function () { /* 静默失败 */ }
  xhr.send()
})
</script>
