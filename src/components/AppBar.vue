<template>
  <v-app-bar app class="border-b border-solid border-b-[thin] border-[rgba(var(--v-border-color),var(--v-border-opacity))]">
    <!-- 1. 最左侧：抽屉按钮 -->
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />

    <!-- 2. 中间：Logo + 分割线 + 标题 -->
    <div class="flex items-center flex-1 min-w-0 overflow-hidden">
      <v-btn
        variant="text"
        color="black"
        class="logo-wrapper normal-case !justify-start flex-1"
        @click="$emit('goHome')"
      >
        <!-- 内容层 -->
        <div class="flex items-center gap-3 w-full min-w-0">
          <v-avatar size="34" class="shrink-0">
            <v-img
              src="https://cn.cravatar.com/avatar/160bd1dbf3863e876098bbd568961703f96934d74ae75ded6872aca9ad82aa1b?s=128&d=mp"
              alt="网站 Logo"
              cover
            />
          </v-avatar>

          <v-divider vertical class="mx-2 shrink-0" />

          <div
            class="relative h-[36px] flex items-center"
            :style="{ minWidth: minWidth + 'px' }"
          >
            <Transition
              enter-from-class="translate-y-full opacity-0"
              enter-active-class="transition-all duration-500 ease-[cubic-bezier(.25,1,.5,1)]"
              enter-to-class="translate-y-0 opacity-100"
              leave-from-class="translate-y-0 opacity-100"
              leave-active-class="transition-all duration-500 ease-[cubic-bezier(.25,1,.5,1)] absolute inset-0"
              leave-to-class="-translate-y-full opacity-0"
            >
              <span
                :key="currentTitle"
                class="font-medium text-[28px] leading-tight whitespace-nowrap block text-left"
              >
                {{ currentTitle }}
              </span>
            </Transition>
          </div>
        </div>

        <!-- 渐变遮罩层：与内容 div 同级，不影响裁切 -->
        <div class="fade-overlay" />
      </v-btn>
    </div>

    <!-- 3. 最右侧：菜单按钮 -->
    <v-menu>
      <template #activator="{ props: menuProps }">
        <v-btn icon v-bind="menuProps">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list density="default" nav>
        <v-list-item
          prepend-icon="mdi-message-alert-outline"
          title="反馈"
          href="https://github.com/msqy-h/AlpineStar-Toolbox/issues"
          target="_blank"
        />

        <v-divider class="my-1" />

        <v-list-item
          prepend-icon="mdi-code-tags"
          title="源码"
          href="https://github.com/msqy-h/AlpineStar-Toolbox"
          target="_blank"
        />
        <v-list-item
          prepend-icon="mdi-account-circle-outline"
          title="开发者主页"
          href="https://msqy-h.github.io/homepage"
          target="_blank"
        />
        <v-list-item
          prepend-icon="mdi-post-outline"
          title="开发者博客"
          href="https://msqy-h.github.io"
          target="_blank"
        />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineEmits<{
  'toggle-drawer': []
  'goHome': []
}>()

const route = useRoute()
const router = useRouter()
const minWidth = ref(0)

const currentTitle = computed(() => (route.meta?.title as string) || 'AlpineStar Toolbox')

const measureTitleWidth = (text: string) => {
  const el = document.createElement('span')
  el.className = 'font-medium text-[28px] leading-tight whitespace-nowrap'
  el.style.position = 'absolute'
  el.style.visibility = 'hidden'
  el.style.whiteSpace = 'nowrap'
  el.textContent = text
  document.body.appendChild(el)
  const width = el.getBoundingClientRect().width
  document.body.removeChild(el)
  return width
}

onMounted(() => {
  const allTitles = router.getRoutes().map(r => (r.meta?.title as string) || '未命名')
  const maxWidth = Math.max(...allTitles.map(t => measureTitleWidth(t)), 100)
  minWidth.value = maxWidth
})
</script>

<style scoped>
.logo-wrapper {
  height: 48px;
}
.fade-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 48px;
  pointer-events: none;
  background: linear-gradient(to right, transparent, rgb(var(--v-theme-surface)));
}
</style>
