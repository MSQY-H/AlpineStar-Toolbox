<template>
  <v-navigation-drawer v-model="model" app>
    <!-- 品牌名：不可选中，不可高亮 -->
    <v-list-item
      to="/"
      prepend-icon="mdi-star-four-points"
      title="AlpineStar Toolbox"
      class="font-weight-bold"
      :active="false"
      :exact="false"
    />

    <v-divider />

    <!-- 三个主标签 -->
    <v-list nav>
      <v-list-item to="/" prepend-icon="mdi-home-outline" title="首页" />
      <v-list-item to="/tools" prepend-icon="mdi-wrench-outline" title="工具" />
      <v-list-item to="/settings" prepend-icon="mdi-cog-outline" title="设置" />
      <v-list-item to="/about" prepend-icon="mdi-information-outline" title="关于" />
    </v-list>

    <v-divider />

    <!-- 工具分类折叠列表 -->
    <v-list nav v-model:opened="openCategories" open-strategy="multiple">
      <v-list-subheader>工具列表</v-list-subheader>
      <v-list-group
        v-for="(cat, i) in toolCategories"
        :key="i"
        :value="cat.name"
      >
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="cat.icon"
            :title="cat.name"
          />
        </template>

        <v-list-item
          v-for="tool in cat.tools"
          :key="tool.path"
          :to="tool.path"
          :title="tool.title"
          :prepend-icon="tool.icon || 'mdi-file-document-outline'"
        />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { toolCategories } from '@/config/tool-categories'

const model = defineModel<boolean>()

const STORAGE_KEY = 'openToolCategories'

const openCategories = ref<string[]>(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
)

watch(openCategories, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })
</script>
