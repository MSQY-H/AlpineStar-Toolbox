# AlpineStar Toolbox - 项目结构说明

## 项目概述

AlpineStar Toolbox 是一个基于 **Vue 3 + Vuetify 4** 的在线工具箱网站，提供多种实用的 Web 工具，支持纯前端处理，无需上传到服务器。项目采用现代化技术栈，支持深色模式、响应式设计，并提供流畅的用户体验。

### 主要功能

- **时间戳转换** - 当前时间显示、秒/毫秒互转、时间戳转日期
- **颜色选择器** - 支持 HEX/RGB/HSL 等多种格式，支持透明度
- **图片格式转换** - 支持 JPEG/PNG/WebP/AVIF 格式互转，带质量调节
- **深色/浅色模式切换** - 跟随系统或手动选择

### 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 库**: Vuetify 4
- **状态管理**: Pinia
- **路由**: Vue Router 5
- **样式**: Tailwind CSS 4 + SCSS
- **语言**: TypeScript
- **代码规范**: ESLint + Vuetify 配置
- **包管理**: pnpm

---

## 项目结构

```
alpine-star-toolbox/
├── src/
│   ├── assets/              # 静态资源（图片、字体等）
│   │   ├── logo.png
│   │   ├── logo.svg
│   │   └── logo_toolbox.png
│   ├── components/          # 可复用的 Vue 组件
│   │   ├── AppBar.vue       # 顶部导航栏（Logo、标题、菜单）
│   │   ├── NavDrawer.vue     # 侧边抽屉导航（主菜单、工具分类）
│   │   ├── MirrorBanner.vue # 国内镜像站提示横幅
│   │   ├── Settings.vue      # 设置页面组件
│   │   ├── About.vue         # 关于页面组件
│   │   └── tools/            # 工具组件
│   │       ├── TimestampConverter.vue
│   │       ├── ColorPicker.vue
│   │       └── ImageConverter/
│   │           ├── index.vue          # 图片转换器主组件
│   │           ├── useImageConvert.ts  # 图片转换逻辑（Composable）
│   │           └── imageWorker.ts      # Web Worker（WASM 转换）
│   ├── config/              # 配置文件
│   │   └── tool-categories.ts  # 工具分类配置
│   ├── pages/               # 页面组件
│   │   ├── index.vue              # 首页
│   │   ├── tools/                 # 工具页面
│   │   │   ├── index.vue          # 工具列表页
│   │   │   ├── timestamp.vue
│   │   │   ├── color-picker.vue
│   │   │   └── image-convert.vue
│   │   ├── settings.vue
│   │   └── about.vue
│   ├── plugins/             # 插件配置
│   │   ├── index.ts            # 插件注册（Vuetify、Pinia、Router）
│   │   └── vuetify.ts          # Vuetify 配置
│   ├── router/              # 路由配置
│   │   └── index.ts            # 路由定义
│   ├── stores/              # Pinia 状态管理
│   │   └── app.ts              # 应用状态
│   ├── styles/              # 样式文件
│   │   ├── main.scss           # 全局样式
│   │   ├── settings.scss       # 设置页面样式
│   │   └── tailwind.css        # Tailwind CSS 配置
│   ├── App.vue              # 根组件（主应用布局）
│   └── main.ts              # 应用入口文件
├── public/                  # 静态公共文件
│   ├── layers.css
│   └── favicon.ico
├── .github/                 # GitHub Actions
│   └── workflows/
│       └── deploy.yml        # 部署配置
├── .vscode/                 # VSCode 配置
│   └── extensions.json
├── AGENTS.md                # 项目规则说明
├── DESCRIPTION.md           # 本文件
├── index.html               # HTML 入口
├── package.json             # 项目依赖和脚本
├── pnpm-lock.yaml
├── README.md                # 项目说明文档
├── tsconfig.json            # TypeScript 配置
├── vite.config.mts          # Vite 构建配置
└── deno.lock                # Deno 依赖锁定
```

---

## 核心模块说明

### 1. 根组件 (`src/App.vue`)

负责应用的整体布局：
- 布局结构：`<v-app>` 容器
- 组件嵌套：`AppBar` + `NavDrawer` + `v-main` + `router-view`
- 全局状态：侧边抽屉开关状态
- 路由导航：首页跳转

### 2. 导航系统

#### 顶部导航栏 (`src/components/AppBar.vue`)
- **功能**：
  - Logo 显示（使用 Gravatar 头像）
  - 当前页面标题动态显示（带宽度自适应）
  - 抽屉开关按钮
  - 右侧菜单（反馈、源码、开发者主页、博客）
- **技术特点**：
  - 使用 CSS 动画实现标题渐入渐出
  - 响应式标题宽度测量
  - 链接使用 `v-menu` 下拉菜单

#### 侧边抽屉导航 (`src/components/NavDrawer.vue`)
- **功能**：
  - 品牌标识（AlpineStar Toolbox）
  - 主菜单（首页、工具、设置、关于）
  - 工具分类列表（可折叠）
  - 本地存储折叠状态
- **技术特点**：
  - 使用 `localStorage` 持久化折叠状态
  - 动态生成工具菜单（基于 `tool-categories.ts`）
  - 导航链接自动高亮

### 3. 工具分类配置 (`src/config/tool-categories.ts`)

定义工具的分类和菜单项：
```typescript
export const toolCategories: ToolCategory[] = [
  {
    name: '设计工具',
    icon: 'mdi-pencil-ruler-outline',
    tools: [
      { title: '颜色选择与转换', path: '/tools/color-picker', icon: 'mdi-palette-outline' }
    ]
  },
  {
    name: '开发工具',
    icon: 'mdi-code-braces',
    tools: [
      { title: '时间戳转换', path: '/tools/timestamp', icon: 'mdi-clock-outline' },
      { title: '图片格式转换', path: '/tools/image-convert', icon: 'mdi-image-outline' }
    ]
  }
]
```

### 4. 工具实现

#### 时间戳转换器 (`src/components/tools/TimestampConverter.vue`)
- **功能**：
  - 实时显示当前秒/毫秒时间戳
  - 自动更新（每秒刷新）
  - 时间戳转日期（支持秒和毫秒）
  - 日期选择器 + 时间选择器
  - 日期转时间戳
  - 一键复制结果
- **技术特点**：
  - 使用 `setInterval` 持续更新
  - 监听剪贴板 API 实现复制
  - 错误处理和用户提示

#### 颜色选择器 (`src/components/tools/ColorPicker.vue`)
- **功能**：
  - 集成 Vuetify 颜色输入控件
  - 支持 HEX/HEXA/RGB/RGBA/HSL/HSLA 格式
  - 颜色预览（带透明度网格背景）
  - 切换显示带透明度或不带
  - 多格式同步转换
  - 一键复制任意格式
- **技术特点**：
  - 自定义颜色解析和转换算法
  - 监听颜色变化自动更新所有格式
  - 复制成功状态计时器（1秒显示）

#### 图片格式转换器 (`src/components/tools/ImageConverter/`)
- **主组件** (`index.vue`)
  - **功能**：
    - 拖拽或点击上传图片
    - 支持多文件选择
    - 图片列表展示（缩略图、文件名、大小）
    - 拖动滑块对比原图和转换后效果
    - 选择目标格式（JPEG/PNG/WebP/AVIF）
    - 调节质量（JPEG/WebP）
    - 单个/批量下载
    - 批量转换进度显示
  - **技术特点**：
    - 使用 Web Worker 进行异步转换
    - `v-snackbar-queue` 实现消息队列
    - URL.createObjectURL 生成预览和下载链接
    - 动态计算文件大小

- **Composable** (`useImageConvert.ts`)
  - 管理 Web Worker 实例
  - 提供转换 Promise 接口
  - 处理错误和状态

- **Web Worker** (`imageWorker.ts`)
  - 使用 `jSquash` 库进行图片转换
  - 接收文件、格式、质量参数
  - 返回转换后的 Blob
  - 支持 AVIF（浏览器兼容性较差）

### 5. 路由系统 (`src/router/index.ts`)

路由定义：
- `/` - 首页
- `/tools` - 工具列表页
- `/tools/timestamp` - 时间戳转换
- `/tools/color-picker` - 颜色选择器
- `/tools/image-convert` - 图片格式转换
- `/settings` - 设置
- `/about` - 关于

路由元信息包含页面标题和图标，用于导航栏显示。

### 6. 设置页面 (`src/components/Settings.vue`)
- **功能**：
  - 深色模式切换（浅色/深色/跟随系统）
  - 使用 `localStorage` 持久化设置
  - 监听系统颜色方案变化

### 7. 关于页面 (`src/components/About.vue`)
- **功能**：
  - 开发者信息（GitHub、千问）
  - 项目版本显示
  - 技术栈标签
  - 源码链接（GitHub）

### 8. 镜像站提示 (`src/components/MirrorBanner.vue`)
- **功能**：
  - 检测用户地理位置（API：`www.loliapi.com`）
  - 中国大陆用户显示镜像站横幅
  - 提供跳转到 `toolbox.msqy.cc.cd`

### 9. 插件系统 (`src/plugins/`)

- **index.ts**: 注册 Vuetify、Pinia、Router
- **vuetify.ts**: 配置 Vuetify 样式、自动导入组件

### 10. 状态管理 (`src/stores/app.ts`)

当前为空状态，预留用于全局应用状态（如用户偏好、主题等）。

---

## 构建配置

### Vite 配置 (`vite.config.mts`)

- **基础路径**：
  - Cloudflare Pages: `/`
  - 其他部署: `/toolbox/`
- **插件**：
  - `@tailwindcss/vite` - Tailwind CSS 支持
  - `@vitejs/plugin-vue` - Vue 3 支持
  - `vite-plugin-vuetify` - Vuetify 自动导入
  - `unplugin-fonts` - Google Fonts 自动导入
- **别名**：`@` → `src`
- **端口**：3000

### TypeScript 配置 (`tsconfig.json`)

使用 Vue 官方推荐配置，支持 `.vue` 文件。

### ESLint 配置 (`eslint.config.js`)

集成 Vuetify ESLint 规则，保持代码风格统一。

---

## 部署配置

### GitHub Actions (`.github/workflows/deploy.yml`)

自动构建和部署流程：
- 触发：push 到 `main` 分支
- 构建命令：`pnpm install && pnpm build`
- 部署平台：GitHub Pages
- 部署路径：`/toolbox/`

---

## 开发工作流

### 包管理
使用 `pnpm` 进行依赖管理：
```bash
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm preview      # 预览生产构建
pnpm type-check   # TypeScript 类型检查
pnpm lint         # 代码检查
pnpm lint:fix     # 自动修复代码问题
```

### 项目规则 (`AGENTS.md`)

- 遵循现有代码风格和模式
- 使用 pnpm 运行项目命令
- 保持 TypeScript 代码
- 启用 Vuetify MCP 辅助开发

---

## 特色功能

### 1. 纯前端处理
所有工具都在浏览器本地运行，不上传文件到服务器，保护用户隐私。

### 2. 响应式设计
完美适配移动端和桌面端，侧边抽屉在小屏幕上自动调整。

### 3. 深色模式
支持手动切换和系统跟随，主题自动持久化。

### 4. 图片对比
图片转换器支持左右滑动对比原图和转换后效果。

### 5. 消息队列
批量操作时使用队列显示消息，避免频繁弹窗干扰。

### 6. 国际化友好
标题、提示信息使用中文，易于理解和使用。

---

## 性能优化

- **代码分割**：路由懒加载（`() => import()`）
- **图片优化**：WebP 格式转换，质量调节
- **资源预加载**：字体和图标使用 CDN
- **Web Worker**：图片转换在后台线程执行，不阻塞 UI
- **内存管理**：组件卸载时释放 `URL.createObjectURL`

---

## 未来扩展建议

### 可能添加的工具
- JSON 格式化/验证
- Base64 编码/解码
- Markdown 预览器
- 代码片段生成器
- 截图工具

### 功能增强
- 工具收藏功能
- 历史记录
- 导出配置
- 暗黑模式主题定制
- PWA 支持（离线使用）

### 技术优化
- 升级到 Vue 3.5+ 新特性
- 集成 TypeScript 严格模式
- 性能监控和分析
- A/B 测试框架集成

---

## 技术支持

- **Vue 文档**: https://vuejs.org/
- **Vuetify 文档**: https://vuetifyjs.com/
- **Vite 文档**: https://vitejs.dev/
- **Pinia 文档**: https://pinia.vuejs.org/
- **Tailwind 文档**: https://tailwindcss.com/

---

## 版本信息

当前版本：1.2026.2.2
发布日期：2026年

---

## 许可证

MIT License - 允许自由使用、修改和分发。

---

**项目地址**: https://github.com/MSQY-H/AlpineStar-Toolbox
**开发者**: 陌上轻烟 (MSQY-H)
