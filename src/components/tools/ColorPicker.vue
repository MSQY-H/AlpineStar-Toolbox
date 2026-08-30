<template>
  <v-container class="py-6" style="max-width: 720px">
    <div class="custom-card">
      <v-color-input
        v-model="color"
        label="选择颜色"
        color-pip
        pip-variant="flat"
        variant="outlined"
        hide-details
        class="mb-5"
        :modes="['hex', 'hexa', 'rgb', 'rgba', 'hsl', 'hsla']"
        mode="hex"
        hide-actions
      />

      <div
        class="preview-bg rounded-lg mb-5"
        style="height: 56px"
      >
        <div
          class="w-full h-full rounded-lg"
          :style="{ backgroundColor: color }"
        />
      </div>

      <div class="flex items-center justify-end mb-3">
        <span class="text-sm mr-2">透明度</span>
        <v-switch
          v-model="alphaEnabled"
          color="primary"
          density="compact"
          hide-details
          class="mt-0"
          style="margin-left: 8px"
          inset="material"
        />
      </div>

      <div class="flex flex-col gap-3">
        <div
          v-for="field in visibleFields"
          :key="field.key"
          class="flex items-center gap-2"
        >
          <v-text-field
            v-model="field.value"
            :label="field.label"
            variant="outlined"
            density="compact"
            hide-details
            monospace
            class="flex-1"
          />
          <v-btn
            icon
            variant="tonal"
            rounded="pill"
            size="small"
            @click="apply(field.key)"
          >
            <v-icon size="20">mdi-check</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <v-snackbar v-model="snackbar" :timeout="1500" location="bottom">已复制到剪贴板</v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, computed } from 'vue'

const color = ref('#0A59F7')
const snackbar = ref(false)
const alphaEnabled = ref(false)

// ---------- 解析 ----------
function parseColor(str: string): { r: number; g: number; b: number; a: number } | null {
  str = str.trim()
  const hexMatch = str.match(/^#([0-9a-f]{3,8})$/i)
  if (hexMatch) {
    let h = hexMatch[1]
    if (h.length === 3) h = h.split('').map(c => c + c).join('')
    if (h.length === 4) h = h.split('').map(c => c + c).join('')
    if (h.length !== 6 && h.length !== 8) return null
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
    if ([r, g, b].some(v => isNaN(v)) || isNaN(a)) return null
    return { r, g, b, a }
  }
  const rgbMatch = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/)
  if (rgbMatch) {
    const r = +rgbMatch[1], g = +rgbMatch[2], b = +rgbMatch[3]
    const a = rgbMatch[4] !== undefined ? +rgbMatch[4] : 1
    if ([r, g, b].some(v => v < 0 || v > 255) || a < 0 || a > 1) return null
    return { r, g, b, a }
  }
  const hslMatch = str.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)/)
  if (hslMatch) {
    const { r, g, b } = hslToRgb(+hslMatch[1], +hslMatch[2] / 100, +hslMatch[3] / 100)
    const a = hslMatch[4] !== undefined ? +hslMatch[4] : 1
    return { r, g, b, a }
  }
  return null
}

// ---------- 转换 ----------
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}
function rgbToHexA(r: number, g: number, b: number, a: number) {
  const ah = Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase()
  return rgbToHex(r, g, b) + ah
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + 6) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}
function hslToRgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

// ---------- 输入框状态 ----------
const fields = reactive([
  { key: 'hex', label: 'HEX', value: '', hasAlpha: false },
  { key: 'hexa', label: 'HEXA', value: '', hasAlpha: true },
  { key: 'rgb', label: 'RGB', value: '', hasAlpha: false },
  { key: 'rgba', label: 'RGBA', value: '', hasAlpha: true },
  { key: 'hsl', label: 'HSL', value: '', hasAlpha: false },
  { key: 'hsla', label: 'HSLA', value: '', hasAlpha: true },
])

const visibleFields = computed(() =>
  fields.filter(f => f.hasAlpha === alphaEnabled.value)
)

function syncInputs() {
  const p = parseColor(color.value)
  if (!p) return
  const { r, g, b, a } = p
  const { h: hh, s: ss, l: ll } = rgbToHsl(r, g, b)
  const map: Record<string, string> = {
    hex: rgbToHex(r, g, b),
    hexa: rgbToHexA(r, g, b, a),
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, ${+a.toFixed(2)})`,
    hsl: `hsl(${hh}, ${ss}%, ${ll}%)`,
    hsla: `hsla(${hh}, ${ss}%, ${ll}%, ${+a.toFixed(2)})`,
  }
  for (const f of fields) f.value = map[f.key]
}

function apply(key: string) {
  const field = fields.find(f => f.key === key)!
  const p = parseColor(field.value)
  if (!p) return
  if (alphaEnabled.value) {
    color.value = rgbToHexA(p.r, p.g, p.b, p.a)
  } else {
    color.value = rgbToHex(p.r, p.g, p.b)
  }
}

// 监听颜色变化，自动检测是否带透明度
watch(color, (newColor) => {
  syncInputs()
  const p = parseColor(newColor)
  if (p && p.a < 1) {
    alphaEnabled.value = true
  }
})

// 初始化
syncInputs()
</script>

<style scoped>
.preview-bg {
  background: repeating-conic-gradient(#e0e0e0 0% 25%, #fff 25% 50%);
  background-size: 16px 16px;
}
</style>
