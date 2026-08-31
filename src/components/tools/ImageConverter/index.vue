<!-- components/tools/ImageConverter/index.vue -->
<template>
  <v-container class="py-6" style="max-width: 720px">
    <div class="custom-card mb-4">
      <!-- 1. 文件上传 -->
      <v-file-upload
        v-model="files"
        multiple
        scrim="primary"
        show-size
        clearable
        density="comfortable"
        accept="image/jpeg,image/png,image/webp,image/avif"
        label="拖拽或点击上传图片"
      >
        <template v-slot:default>
          <v-file-upload-dropzone density="comfortable" title="拖拽或点击上传图片" icon="mdi-upload-outline"/>
        </template>
      </v-file-upload>

      <!-- 2. 图片列表 - 使用 Vuetify 4 的 v-list -->
      <v-list
        v-if="fileInfoList.length > 0"
        class="mb-5"
        density="compact"
      >
        <v-list-item
          v-for="(info, index) in fileInfoList"
          :key="index"
          :active="index === currentIndex"
          active-color="primary"
          class="cursor-pointer py-4"
          @click="selectFile(index)"
        >
          <!-- 左侧：缩略图 -->
          <template v-slot:prepend>
            <div class="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 mr-3">
              <img :src="info.previewUrl" class="w-full h-full object-cover" alt="" />
              <!-- 转换中遮罩 + 加载动画 -->
              <div v-if="info.isConverting" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <v-progress-circular indeterminate color="white" size="20" width="3" />
              </div>
            </div>
          </template>

          <!-- 中间：文件名 + 状态 -->
          <v-list-item-title class="text-sm font-medium truncate">{{ info.file.name }}</v-list-item-title>
          <v-list-item-subtitle class="text-xs">
            {{ formatSize(info.file.size) }}
            <span v-if="info.resultUrl && !info.isConverting" class="ml-2 text-green-600 font-medium">
              · 已转换 ({{ formatSize(info.resultSize) }})
            </span>
          </v-list-item-subtitle>

          <!-- 右侧：操作按钮 -->
          <template v-slot:append>
            <div class="flex items-center gap-1" @click.stop>
              <!-- 下载按钮 -->
              <v-btn
                v-if="info.resultUrl && !info.isConverting"
                icon
                rounded="pill"
                size="small"
                variant="tonal"
                color="primary"
                :href="info.resultUrl"
                :download="getOutputFileName(info.file)"
              >
                <v-icon size="18">mdi-download-outline</v-icon>
              </v-btn>
              <!-- 删除按钮 -->
              <v-btn
                icon
                rounded="pill"
                size="small"
                variant="tonal"
                color="error"
                :disabled="info.isConverting"
                @click="removeFile(index)"
              >
                <v-icon size="18">mdi-close</v-icon>
              </v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <!-- 3. 图片对比区域 -->
      <div v-if="activeFile" class="mb-5">
        <div
          class="relative overflow-hidden rounded-lg bg-gray-100 cursor-crosshair"
          @mousemove="onMouseMove"
          @touchmove.passive="onTouchMove"
        >
          <!-- 原图（底层） -->
          <img
            :src="activeFile.previewUrl"
            class="w-full block select-none"
            style="pointer-events: none"
            alt="原图"
          />
          <!-- 转换后（上层，clip-path 裁剪） -->
          <img
            v-if="activeFile.resultUrl"
            :src="activeFile.resultUrl"
            class="absolute inset-0 w-full h-full object-contain"
            :style="{ clipPath: `inset(0 0 0 ${clipPos}%` }"
            alt="转换后"
            style="pointer-events: none"
          />
          <!-- 分割线 -->
          <div
            class="absolute inset-y-0 w-0.5 bg-white shadow-md"
            :style="{ left: clipPos + '%' }"
          >
            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
              <v-icon size="14" class="text-gray-600">mdi-format-horizontal-align-center</v-icon>
            </div>
          </div>
          <div class="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded">原图</div>
          <div v-if="activeFile.resultUrl" class="absolute top-2 right-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded">转换后</div>
        </div>
        <div class="mt-2">
          <v-slider v-model="clipPos" :min="0" :max="100" density="compact" hide-details color="primary" />
        </div>
      </div>

      <!-- 4. 转换参数 -->
      <div class="flex flex-col gap-3 mb-5">
        <v-select
          v-model="targetFormat"
          :items="formats"
          item-title="label"
          item-value="value"
          label="目标格式"
          variant="outlined"
          density="compact"
          hide-details
        />
        <v-slider
          v-if="showQuality"
          v-model="quality"
          label="编码质量"
          :min="10"
          :max="100"
          :step="5"
          thumb-label
          hide-details
          density="compact"
        />
      </div>

      <!-- 5. 按钮组 -->
      <div class="flex items-center gap-2 ">
        <v-btn
          color="primary"
          flat
          :loading="isConverting"
          :disabled="!files.length || isConverting"
          @click="handleConvert"
        >
          开始转换
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          flat
          :disabled="!hasConvertedFiles"
          @click="downloadAll"
        >
          下载全部
        </v-btn>
      </div>

      <!-- 错误提示 -->
      <v-alert v-if="errorMsg" type="error" variant="outlined" density="compact" class="mb-4" closable @click:close="errorMsg = null">
        {{ errorMsg }}
      </v-alert>
    </div>

    <v-alert
      text="AVIF 格式转换需要较长时间，且目前浏览器兼容性较差，请谨慎使用。"
      type="warning"
      variant="outlined"
      class="mb-4"
    />

    <v-alert
      text="本工具基于 jSquash 构建，实现纯前端处理，无需上传服务器。转换需加载 WASM 文件，如果长时间都未转换完成，可能是网络问题，请尝试刷新或更换网络环境。"
      type="info"
      variant="outlined"
    />

    <!-- ✅ 替换为 v-snackbar-queue 队列 -->
    <v-snackbar-queue
      v-model="snackbarQueue"
      :timeout="3000"
      closable
      :total-visible="3"
      location="bottom center"
    >
      <template v-slot:actions="{ props }">
        <v-icon-btn
          aria-label="Close"
          icon="$close"
          size="small"
          variant="text"
          v-bind="props"
        />
      </template>
    </v-snackbar-queue>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useImageConvert } from './useImageConvert'

const { convert, isConverting, error: workerError } = useImageConvert()

// ---------- 文件管理 ----------
const files = ref<File[]>([])
const fileInfoList = ref<Array<{
  file: File
  previewUrl: string
  resultUrl: string | null
  resultSize: number
  isConverting: boolean
}>>([])
const currentIndex = ref(0)
const clipPos = ref(50)

// ---------- 转换参数 ----------
const targetFormat = ref('webp')
const quality = ref(80)

// ---------- UI 状态 ✅ 改为队列数组 ----------
const errorMsg = ref<string | null>(null)
const snackbarQueue = ref<Array<{
  text: string
  color?: string
  timeout?: number
}>>([])

// ---------- 计算属性 ----------
const activeFile = computed(() => fileInfoList.value[currentIndex.value] || null)
const showQuality = computed(() => ['jpeg', 'webp'].includes(targetFormat.value))
const hasConvertedFiles = computed(() => fileInfoList.value.some(info => !!info.resultUrl))

const formats = [
  { label: 'JPEG', value: 'jpeg' },
  { label: 'PNG', value: 'png' },
  { label: 'WebP', value: 'webp' },
  { label: 'AVIF', value: 'avif' },
]

// ---------- 监听文件变化 ----------
watch(files, (newFiles) => {
  if (!newFiles || newFiles.length === 0) {
    for (const info of fileInfoList.value) {
      URL.revokeObjectURL(info.previewUrl)
      if (info.resultUrl) URL.revokeObjectURL(info.resultUrl)
    }
    fileInfoList.value = []
    currentIndex.value = 0
    return
  }
  const existingKeys = new Set(fileInfoList.value.map(f => `${f.file.name}-${f.file.size}-${f.file.lastModified}`))
  for (const file of newFiles) {
    const key = `${file.name}-${file.size}-${file.lastModified}`
    if (!existingKeys.has(key)) {
      fileInfoList.value.push({
        file,
        previewUrl: URL.createObjectURL(file),
        resultUrl: null,
        resultSize: 0,
        isConverting: false,
      })
    }
  }
  if (currentIndex.value >= fileInfoList.value.length) {
    currentIndex.value = Math.max(0, fileInfoList.value.length - 1)
  }
})

// ---------- 工具函数 ----------
function selectFile(index: number) {
  currentIndex.value = index
  clipPos.value = 50
}

function removeFile(index: number) {
  const info = fileInfoList.value[index]
  URL.revokeObjectURL(info.previewUrl)
  if (info.resultUrl) URL.revokeObjectURL(info.resultUrl)

  fileInfoList.value.splice(index, 1)
  files.value = files.value.filter(f => f !== info.file)

  if (currentIndex.value >= fileInfoList.value.length) {
    currentIndex.value = Math.max(0, fileInfoList.value.length - 1)
  }
}

function getOutputFileName(file: File): string {
  const name = file.name.replace(/\.[^.]+$/, '')
  const ext = targetFormat.value === 'jpeg' ? 'jpg' : targetFormat.value
  return `${name}.${ext}`
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

// ✅ 下载全部已转换的图片
function downloadAll() {
  const convertedFiles = fileInfoList.value.filter(info => !!info.resultUrl)
  if (convertedFiles.length === 0) return

  convertedFiles.forEach((info) => {
    const link = document.createElement('a')
    link.href = info.resultUrl!
    link.download = getOutputFileName(info.file)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })

  snackbarQueue.value.push({ text: `正在下载 ${convertedFiles.length} 个文件...`, color: 'info' })
}

// 对比区域滑动事件
function onMouseMove(e: MouseEvent) { updateClipPosition(e.clientX) }
function onTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) updateClipPosition(e.touches[0].clientX)
}
function updateClipPosition(clientX: number) {
  const wrapper = document.querySelector('.relative.overflow-hidden.rounded-lg.bg-gray-100')
  if (!wrapper) return
  const rect = wrapper.getBoundingClientRect()
  clipPos.value = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
}

// 批量转换逻辑
async function handleConvert() {
  errorMsg.value = null
  let converted = 0
  const total = fileInfoList.value.length
  for (let i = 0; i < total; i++) {
    const info = fileInfoList.value[i]
    info.isConverting = true
    try {
      const result = await convert(info.file, targetFormat.value, quality.value)
      if (info.resultUrl) URL.revokeObjectURL(info.resultUrl)
      info.resultUrl = URL.createObjectURL(result.blob)
      info.resultSize = result.convertedSize
      converted++
      // ✅ 使用队列推送消息，成功用 green，跳过用 info
      snackbarQueue.value.push({
        text: result.skipped ? `第 ${i + 1} 张：无需转换` : `第 ${i + 1} 张转换成功！`,
        color: result.skipped ? 'info' : 'success',
      })
    } catch {
      // ✅ 失败用 error 颜色
      snackbarQueue.value.push({ text: `第 ${i + 1} 张转换失败`, color: 'error' })
    } finally {
      info.isConverting = false
    }
  }
  if (converted === total) {
    snackbarQueue.value.push({ text: `全部 ${total} 张图片转换完成！`, color: 'success' })
  }
}

watch(workerError, (val) => { if (val) errorMsg.value = val })

onBeforeUnmount(() => {
  for (const info of fileInfoList.value) {
    URL.revokeObjectURL(info.previewUrl)
    if (info.resultUrl) URL.revokeObjectURL(info.resultUrl)
  }
})
</script>
