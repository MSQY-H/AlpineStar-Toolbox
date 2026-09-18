<template>
  <v-container class="py-6" fluid>
    <!-- 头像 & Logo -->
    <div class="flex items-center justify-center gap-8 mb-6">
      <v-avatar size="80">
        <v-img
          src="@/assets/logo.webp"
          alt="作者头像"
          cover
        />
      </v-avatar>
      <div class="h-16 w-px bg-gray-300 dark:bg-gray-600"></div>
      <v-avatar size="80" rounded="circle">
        <v-img
          src="@/assets/logo_toolbox.png"
          alt="Logo"
          cover
        />
      </v-avatar>
    </div>

    <!-- 网页名称 -->
    <h2 class="text-2xl font-bold text-center mb-6">AlpineStar Toolbox</h2>

    <!-- 卡片网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 开发者卡片 -->
      <div class="custom-card">
        <h2 class="text-2xl font-semibold mb-4">开发者</h2>
        <div class="flex flex-col">
          <a
            href="https://github.com/MSQY-H"
            target="_blank"
            rel="noopener noreferrer"
            v-ripple
            class="flex items-center gap-2 text-primary no-underline rounded-lg px-3 py-2.5 -mx-3 cursor-pointer transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <v-icon icon="mdi-github" size="20" />
            <span>陌上轻烟</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">（MSQY-H）</span>
          </a>
          <a
            href="https://www.qianwen.com/"
            target="_blank"
            rel="noopener noreferrer"
            v-ripple
            class="flex items-center gap-2 text-primary no-underline rounded-lg px-3 py-2.5 -mx-3 cursor-pointer transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <v-icon icon="mdi-creation-outline" size="20" />
            <span>千问 & DeepSeek</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">（网页版）</span>
          </a>
        </div>
      </div>

      <!-- 项目信息卡片 -->
      <div class="custom-card">
        <h2 class="text-2xl font-semibold mb-4">项目信息</h2>

        <div class="flex items-center justify-between py-2">
          <span class="font-medium">当前版本</span>
          <v-chip color="primary" variant="tonal" size="small">{{ version }}</v-chip>
        </div>

        <div class="flex items-center justify-between py-2">
          <span class="font-medium">技术栈</span>
          <v-chip color="primary" variant="tonal" size="small">Vuetify</v-chip>
        </div>
      </div>

      <!-- 线路卡片 -->
      <div class="custom-card">
        <h2 class="text-2xl font-semibold mb-4">线路</h2>
        <div class="flex flex-wrap gap-3">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-web"
            href="https://msqy-h.github.io/toolbox/"
            target="_blank"
            rel="noopener noreferrer"
          >
            主要
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            href="https://toolbox.msqy.cc.cd/"
            target="_blank"
            rel="noopener noreferrer"
          >
            镜像
          </v-btn>
        </div>
      </div>

      <!-- 项目源码卡片 -->
      <div class="custom-card">
        <h2 class="text-2xl font-semibold mb-4">项目源码</h2>
        <a
          href="https://github.com/MSQY-H/AlpineStar-Toolbox"
          target="_blank"
          rel="noopener noreferrer"
          v-ripple
          class="flex items-center gap-2 text-primary no-underline rounded-lg px-3 py-2.5 -mx-3 cursor-pointer transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <v-icon icon="mdi-github" size="20" />
          <span>MSQY-H/AlpineStar-Toolbox</span>
          <v-icon icon="mdi-open-in-new" size="16" class="ml-auto text-gray-400" />
        </a>
      </div>

      <!-- 更新日志卡片（跨两列） -->
      <div class="custom-card md:col-span-2">
        <h2 class="text-2xl font-semibold mb-4">更新日志</h2>
        <div class="flex flex-col">
          <template v-for="(line, index) in changelogLines" :key="index">
            <h3
              v-if="line.isHeading"
              class="text-lg font-semibold mt-3 mb-1 first:mt-0"
            >
              {{ line.text }}
            </h3>
            <p
              v-else
              class="text-sm text-medium-emphasis leading-relaxed"
            >
              {{ line.text }}
            </p>
          </template>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const version = '1.2026.3.4'

// ============ 更新日志内容 ============
const changelog = `
# v1.2026.3.4
- [新增] 关于页线路模块
- [新增] 关于页更新日志模块
- [优化] 页面切换过渡动画
- [优化] 部分 UI 
# v1.2026.3.3
- [添加] 自动注入 SW 版本号
# v1.2026.3
- [添加] 离线缓存

# 此处仅显示最近两个小版本更新及最近一个大版本更新。完整日志请看 GitHub 仓库。
`

const changelogLines = computed(() => {
  return changelog
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const match = line.match(/^#+\s*(.+)$/)
      if (match) {
        return { isHeading: true, text: match[1] }
      }
      return { isHeading: false, text: line }
    })
})
</script>