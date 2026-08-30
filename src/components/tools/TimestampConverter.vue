<template>
  <v-container class="py-6" fluid>
    <!-- 当前时间戳 -->
    <div class="custom-card mb-6">
      <h3 class="text-base font-medium mb-4">当前时间戳</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <v-text-field
            :model-value="String(currentSeconds)"
            label="秒（s）"
            variant="outlined"
            density="compact"
            readonly
            hide-details
            class="flex-1"
          />
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                :icon="copiedState.seconds ? 'mdi-check' : 'mdi-content-copy'"
                :color="copiedState.seconds ? 'success' : 'primary'"
                variant="tonal"
                size="small"
                rounded="pill"
                @click="handleCopy('seconds', String(currentSeconds))"
              />
            </template>
            {{ copiedState.seconds ? '复制成功！' : '复制' }}
          </v-tooltip>
        </div>
        <div class="flex items-center gap-2">
          <v-text-field
            :model-value="String(currentMillis)"
            label="毫秒（ms）"
            variant="outlined"
            density="compact"
            readonly
            hide-details
            class="flex-1"
          />
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                :icon="copiedState.millis ? 'mdi-check' : 'mdi-content-copy'"
                :color="copiedState.millis ? 'success' : 'primary'"
                variant="tonal"
                size="small"
                rounded="pill"
                @click="handleCopy('millis', String(currentMillis))"
              />
            </template>
            {{ copiedState.millis ? '复制成功！' : '复制' }}
          </v-tooltip>
        </div>
      </div>
    </div>

    <!-- 时间戳 → 日期 & 日期 → 时间戳 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 时间戳 → 日期 -->
      <div class="custom-card">
        <h3 class="text-base font-medium mb-4">时间戳 → 日期</h3>
        <v-text-field
          v-model="tsInput"
          label="输入时间戳"
          placeholder="如 1700000000 或 1700000000000"
          hide-details="auto"
          class="mb-4"
        />
        <v-btn color="primary" block @click="convertTsToDate">
          转换
        </v-btn>
        <Transition name="fade-slide">
          <v-alert v-if="tsResult" variant="tonal" color="primary" density="comfortable" class="mt-4">
            {{ tsResult }}
          </v-alert>
        </Transition>
      </div>

      <!-- 日期 → 时间戳 -->
      <div class="custom-card">
        <h3 class="text-base font-medium mb-4">日期 → 时间戳</h3>
        <v-date-input
          v-model="dateInput"
          label="选择日期"
          prepend-icon=""
          hide-details
          variant="outlined"
          input-format="yyyy-mm-dd"
          class="mb-4"
        />
        <v-text-field
          :model-value="timeInput"
          label="选择时间"
          prepend-inner-icon="mdi-clock-time-four-outline"
          readonly
          hide-details
          variant="outlined"
          class="mb-4"
        >
          <v-menu
            v-model="showTimeMenu"
            :close-on-content-click="false"
            activator="parent"
            min-width="0"
          >
            <v-time-picker
              v-model="timeInput"
              format="24hr"
              use-seconds
            />
          </v-menu>
        </v-text-field>
        <v-btn color="primary" block @click="convertDateToTs">
          转换
        </v-btn>
        <Transition name="fade-slide">
          <v-alert v-if="dateResult" variant="tonal" color="primary" density="comfortable" class="mt-4">
            <div>秒（s）：{{ dateResult.seconds }}</div>
            <div>毫秒（ms）：{{ dateResult.millis }}</div>
          </v-alert>
        </Transition>
      </div>
    </div>

    <!-- 错误对话框 -->
    <v-dialog v-model="errorDialog" max-width="500">
      <template v-slot:default="{ isActive }">
        <v-card title="输入错误">
          <v-card-text>
            {{ errorMessage }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="确定"
              @click="isActive.value = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'

const currentSeconds = ref(0)
const currentMillis = ref(0)
let timer: ReturnType<typeof setInterval>

const updateNow = () => {
  currentMillis.value = Date.now()
  currentSeconds.value = Math.floor(currentMillis.value / 1000)
}

onMounted(() => {
  updateNow()
  timer = setInterval(updateNow, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

// --- 复制状态 & 逻辑 ---
const copiedState = reactive({
  seconds: false,
  millis: false,
})

const copyTimers: Record<string, ReturnType<typeof setTimeout>> = {}

const handleCopy = async (key: keyof typeof copiedState, text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    showError('复制失败，请手动复制')
    return
  }

  if (copyTimers[key]) clearTimeout(copyTimers[key])
  copiedState[key] = true
  copyTimers[key] = setTimeout(() => {
    copiedState[key] = false
  }, 1000)
}

// --- 错误弹窗 ---
const errorDialog = ref(false)
const errorMessage = ref('')

const showError = (msg: string) => {
  errorMessage.value = msg
  errorDialog.value = true
}

// --- 时间戳 → 日期 ---
const tsInput = ref('')
const tsResult = ref('')

const convertTsToDate = () => {
  const raw = Number(tsInput.value)
  if (isNaN(raw) || raw <= 0) {
    showError('请输入有效的时间戳')
    return
  }
  const ms = raw < 1e12 ? raw * 1000 : raw
  const date = new Date(ms)
  tsResult.value = date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

// --- 日期 → 时间戳 ---
const dateInput = ref<Date | null>(null)
const timeInput = ref('00:00:00')
const showTimeMenu = ref(false)
const dateResult = ref<{ seconds: number; millis: number } | null>(null)

const convertDateToTs = () => {
  if (!dateInput.value) {
    showError('请选择一个日期')
    return
  }

  // v-time-picker model 格式为 "HH:MM:SS" 或 "HH:MM"
  const timeParts = timeInput.value.split(':').map(Number)
  if (timeParts.length < 2 || timeParts.some(n => isNaN(n))) {
    showError('请选择有效的时间')
    return
  }

  const [hours = 0, minutes = 0, seconds = 0] = timeParts

  const date = new Date(dateInput.value)
  date.setHours(hours, minutes, seconds, 0)

  dateResult.value = {
    seconds: Math.floor(date.getTime() / 1000),
    millis: date.getTime(),
  }
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
