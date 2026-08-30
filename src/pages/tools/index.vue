<template>
  <v-container class="py-6" fluid>
    <v-list
      v-for="cat in toolCategories"
      :key="cat.name"
      v-model:opened="openGroups"
      open-strategy="multiple"
      class="custom-card mb-4 !bg-transparent !p-0"
      density="default"
    >
      <v-list-group :value="cat.name">
        <template #activator="{ props }">
          <v-list-item v-bind="props">
            <template #prepend>
              <v-icon :icon="cat.icon" size="small" class="mr-2" />
            </template>
            <v-list-item-title class="text-base font-medium">
              {{ cat.name }}
            </v-list-item-title>
            <template #append>
              <v-chip size="x-small" variant="tonal" color="primary">
                {{ cat.tools.length }}
              </v-chip>
            </template>
          </v-list-item>
        </template>

        <div class="overflow-x-auto px-4 py-3">
          <div class="flex flex-wrap gap-2">
            <v-btn
              v-for="tool in cat.tools"
              :key="tool.path"
              :to="tool.path"
              variant="outlined"
              size="small"
              :prepend-icon="tool.icon || 'mdi-file-document-outline'"
              class="text-none text-body-2"
            >
              {{ tool.title }}
            </v-btn>
          </div>
        </div>
      </v-list-group>
    </v-list>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { toolCategories } from '@/config/tool-categories'

const STORAGE_KEY = 'toolPageOpenGroups'

const openGroups = ref<string[]>(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
)

watch(openGroups, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })
</script>
