<template>
  <v-container class="py-6" fluid>
    <div class="custom-card">
      <div class="flex items-center gap-3 mb-6">
        <v-icon icon="mdi-star-four-points" color="primary" size="32" />
        <h2 class="text-2xl font-semibold">AlpineStar Toolbox</h2>
      </div>
      <p class="text-base mb-6">
        欢迎使用 AlpineStar Toolbox！你可以点击下面的按钮或者在侧边栏选择一个工具使用！
      </p>
      <v-btn
        color="primary"
        rounded="lg"
        prepend-icon="mdi-rocket-launch-outline"
        @click="$router.push('/tools')"
      >
        开始使用
      </v-btn>
    </div>
  </v-container>
</template>