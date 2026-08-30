<template>
  <v-container class="py-6" fluid>
    <!-- 当前时间戳 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="custom-card">
        <h3 class="text-base font-medium mb-4">当前时间戳</h3>
        <v-table density="comfortable">
          <tbody>
            <tr>
              <td class="font-medium" width="140">秒（s）</td>
              <td><v-chip color="primary" variant="tonal">{{ currentSeconds }}</v-chip></td>
            </tr>
            <tr>
              <td class="font-medium">毫秒（ms）</td>
              <td><v-chip color="primary" variant="tonal">{{ currentMillis }}</v-chip></td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <!-- 时间戳 → 日期 -->
      <div class="custom-card">
        <h3 class="text-base font-medium mb-4">时间戳 → 日期</h3>
        <v-text-field
          v-model="tsInput"
          label="输入时间戳"
          placeholder="如 1700000000 或 1700000000000"
          density="comfortable"
          hide-details="auto"
          class="mb-4"
        />
        <v-btn color="primary" block @click="convertTsToDate">
          转换
        </v-btn>
        <v-alert v-if="tsResult" variant="tonal" color="primary" density="comfortable" class="mt-4">
          {{ tsResult }}
        </v-alert>
      </div>
    </div>

    <!-- 日期 → 时间戳 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="custom-card">
        <h3 class="text-base font-medium mb-4">日期 → 时间戳</h3>
        <v-text-field
          v-model="dateInput"
          label="输入日期时间"
          placeholder="如 2024-01-01 12:00:00"
          density="comfortable"
          hide-details="auto"
          class="mb-4"
        />
        <v-btn color="primary" block @click="convertDateToTs">
          转换
        </v-btn>
        <v-alert v-if="dateResult" variant="tonal" color="primary" density="comfortable" class="mt-4">
          <div>秒（s）：{{ dateResult.seconds }}</div>
          <div>毫秒（ms）：{{ dateResult.millis }}</div>
        </v-alert>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

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

const tsInput = ref('')
const tsResult = ref('')

const convertTsToDate = () => {
  const raw = Number(tsInput.value)
  if (isNaN(raw) || raw <= 0) {
    tsResult.value = '请输入有效的时间戳'
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

const dateInput = ref('')
const dateResult = ref<{ seconds: number; millis: number } | null>(null)

const convertDateToTs = () => {
  const date = new Date(dateInput.value)
  if (isNaN(date.getTime())) {
    dateResult.value = null
    alert('请输入有效的日期格式，如 2024-01-01 12:00:00')
    return
  }
  dateResult.value = {
    seconds: Math.floor(date.getTime() / 1000),
    millis: date.getTime(),
  }
}
</script>
