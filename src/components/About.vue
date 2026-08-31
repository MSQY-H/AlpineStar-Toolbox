<template>
  <v-container class="py-6" fluid>
    <!-- 头像 & Logo -->
    <div class="flex items-center justify-center gap-8 mb-6">
      <v-avatar size="80">
        <v-img
          src="https://cn.cravatar.com/avatar/160bd1dbf3863e876098bbd568961703f96934d74ae75ded6872aca9ad82aa1b?s=128&d=mp"
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

    <!-- 开发者卡片 -->
    <div class="custom-card mb-4">
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
          <span>千问</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">（网页版）</span>
        </a>
      </div>
    </div>

    <!-- 项目信息卡片 -->
    <div class="custom-card mb-4">
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

    <!-- 项目源码卡片 -->
    <div class="custom-card mb-4">
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

  </v-container>
</template>

<script lang="ts" setup>
const version = '1.2026.2.2'
</script>
