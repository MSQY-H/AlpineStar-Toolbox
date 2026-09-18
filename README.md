<div align="center">

<img src="./src/assets/logo.png" alt="MSQY's Homepage" width="128"/>

<h1>AlpineStar Toolbox</h1>

![最后更新](https://img.shields.io/github/last-commit/MSQY-H/AlpineStar-Toolbox?label=最后更新&color=blueviolet)
![提交数](https://img.shields.io/github/commit-activity/m/MSQY-H/AlpineStar-Toolbox?label=提交数&color=red)
![仓库大小](https://img.shields.io/github/repo-size/MSQY-H/AlpineStar-Toolbox?label=仓库大小&color=green)
![主要语言](https://img.shields.io/github/languages/top/MSQY-H/AlpineStar-Toolbox?color=blue)
![许可证](https://img.shields.io/github/license/MSQY-H/AlpineStar-Toolbox?label=许可证&color=lightgrey)
[![部署](https://img.shields.io/badge/部署于-GitHub%20Pages-brightgreen)](https://msqy-h.github.io/homepage/)

</div>

> [!WARNING]
> 本项目主要代码由 AI 生成，未经专业测试，可能存在未发现的 bug。

## 项目简介

这是 AlpineStar Toolbox，是较完善的工具箱网站，欢迎大家使用！如果有想要为此项目做贡献的，也欢迎提交 PR！

## 项目特性

- 使用 Vuetify 框架，交互流畅
- 采用 Service Worker，支持离线缓存，无网也可以用
- 纯静态，支持直接部署至 GitHub Pages 或 Cloudflare Pages 等平台

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 语言 | Vue(≈70%)、TypeScripts(≈20%) |
| 框架 | Vue |
| UI 框架 | Vuetify |
| 包管理器 | Bun |

## 快速开始

### 环境需求

- Node.js v26.4.0+
- Bun 1.4.2+

### 开始安装

1. 先将此仓库 clone 至你的电脑。
  ``` bash
  git clone https://github.com/MSQY-H/AlpineStar-Toolbox.git
  ```

2. 安装依赖
  ``` bash
  bun install
  ```

3. 开发预览
  ``` bash
  bun run dev
  ```

4. 构建：
  ``` bash
  bun run build-only
  ```

5. 预览:
  ``` bash
  bun run preview
  ```

## 更新日志

### v1.2026.3.4
- [新增] 关于页线路模块
- [新增] 关于页更新日志模块
- [优化] 页面切换过渡动画
- [优化] 部分 UI 
### v1.2026.3.3
- [添加] 自动注入 SW 版本号
### v1.2026.3.2
- [修复] 部分资源文件无法离线缓存问题
### v1.2026.3.1
- [修复] jSquash WASM 文件无法离线缓存问题
### v1.2026.3
- [添加] 离线缓存
### v1.2026.2.2
- [修复] 已知问题
### v1.2026.2.1
- [修复] 网站信息未修改
### v1.2026.2
- [添加] 图片格式转换工具
### v1.2026.1
- AlpineStar Toolbox 正式发布

## 使用说明

本项目的 `vite.config.mts` 有如下代码：

``` mts
const isCloudflare = process.env.CF_PAGES === '1'
  const base = isCloudflare ? '/' : '/toolbox/'

  console.log(`[Vite] 当前构建基路径: ${base}`)
```

这根据我的部署环境进行了定制，如果未定义 `CF_PAGES = '1'` 环境变量，那么默认根路径为 `/toolbox/`。如果你没有对不同部署平台进行适配的需求，直接将这段改为：

``` mts
const base = '这里填你实际使用的根路径'
```

即可。如果看不懂，直接问 AI，或者跟我联系

## 想为项目做贡献？

非常欢迎您为我们的项目做出贡献！您只需这样做即可：

1. Fork 此项目
2. 创建你的特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交你的更改（`git commit -m 'Add some AmazingFeature'`）
4. 上传至仓库（`git push origin feature/AmazingFeature`）
5. 发起新的 PR

## 协议

本项目**使用 MIT 协议**。请遵守此协议的规定。详情请看 [LICENSE](LICENSE) 文件。

---

<p align="center">
  由 <a href="https://github.com/MSQY-H">MSQY-H</a> 用 ❤️ 制作
</p>

<p align="center">
  感谢 <a href="https://deepseek.com/">DeepSeek 网页版</a> 与 <a href="https://qianwen.com/">千问网页版</a>的支持
</p>

---

## Vuetify

> [!NOTE]
> 下面为 Vuetify CLI 生成内容。

Scaffolded with Vuetify CLI.

### ❗️ Documentation

- Primary docs: https://vuetifyjs.com/
- Getting started guide: https://vuetifyjs.com/en/getting-started/installation/
- Community support: https://community.vuetifyjs.com/
- Issue tracker: https://issues.vuetifyjs.com/

### 🧱 Stack

- Framework: Vue 3 + Vite
- UI Library: Vuetify
- Language: TypeScript
- Package manager: pnpm

### 🧭 Start Here

- Main entry: `src/main.ts`
- Main app component: `src/App.vue`
- Main styles: `src/styles/`
- Plugin setup: `src/plugins/`

### 📁 Project Structure

- `src/main.ts` — application entry point
- `src/App.vue` — root component
- `src/components/` — reusable Vue components
- `src/plugins/` — plugin registration and setup
- `src/styles/` — global styles and theme settings
- `public/` — static public files

### ✨ Enabled Features

- ESLint
- Vuetify MCP
- Pinia
- Vue Router
- Tailwind CSS

### 💿 Install

Use your selected package manager (pnpm) to install dependencies:

```bash
pnpm install
```

### 🚀 Quick Start

```bash
pnpm install
pnpm dev
```

### 🏗️ Build

```bash
pnpm build
```

### 🧪 Available Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm preview`
- `pnpm build-only`
- `pnpm type-check`
- `pnpm lint`
- `pnpm lint:fix`

### 🤖 Vuetify MCP Server

This project is configured with the Vuetify Model Context Protocol (MCP) server.
To install and configure the MCP server for your favorite IDE (Cursor, Trae, Windsurf, VS Code, Claude Desktop, etc.) run:

```bash
pnpm dlx @vuetify/mcp-cli
```

This will open an interactive setup wizard to help you connect your AI assistant to the Vuetify ecosystem.

### 💪 Support Vuetify Development

This project uses Vuetify - an MIT licensed Open Source project. We are glad to welcome contributors and any support for ongoing development:

- Contribute to Vuetify and ecosystem projects: https://github.com/vuetifyjs
- Request enterprise support: https://support.vuetifyjs.com/
- Sponsor on GitHub: https://github.com/sponsors/vuetifyjs
- Support on Open Collective: https://opencollective.com/vuetify
