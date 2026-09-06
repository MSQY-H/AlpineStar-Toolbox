import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const isCloudflare = process.env.CF_PAGES === '1'
  const base = isCloudflare ? '/' : '/toolbox/'

  console.log(`[Vite] 当前构建基路径: ${base}`)

  return {
    base,
    plugins: [
      tailwindcss(),
      Vue({
        template: { transformAssetUrls },
      }),
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss',
        },
      }),
      Fonts({
        fontsource: {
          families: [
            { name: 'Roboto Mono', weights: [400, 700] },
            { name: 'Roboto', weights: [100, 300, 400, 500, 700, 900], styles: ['normal', 'italic'] },
          ],
        },
      }),
      // 自定义插件：生成资源清单
      {
        name: 'generate-asset-manifest',
        apply: 'build',
        writeBundle(options) {
          const outDir = options.dir || 'dist'
          const baseClean = base.endsWith('/') ? base.slice(0, -1) : base

          function walkDir(dir: string, baseDir: string = ''): string[] {
            const results: string[] = []
            const list = fs.readdirSync(dir)
            for (const file of list) {
              const filePath = path.join(dir, file)
              const stat = fs.statSync(filePath)
              if (stat.isDirectory()) {
                results.push(...walkDir(filePath, path.join(baseDir, file)))
              } else {
                if (file === 'sw.js' || file === 'asset-manifest.json') continue
                const relativePath = path.join(baseDir, file).replace(/\\/g, '/')
                const prefix = baseClean === '/' ? '' : baseClean
                const fullPath = prefix + '/' + relativePath
                const normalizedPath = fullPath.startsWith('/') ? fullPath : '/' + fullPath
                results.push(normalizedPath)
              }
            }
            return results
          }

          const urls = walkDir(outDir)
          if (base !== '/' && !urls.includes(base)) urls.push(base)
          else if (base === '/' && !urls.includes('/')) urls.push('/')

          const manifestPath = path.join(outDir, 'asset-manifest.json')
          fs.writeFileSync(
            manifestPath,
            JSON.stringify({ base, urls }, null, 2),
            'utf-8'
          )
          console.log(`[Vite] 已生成资源清单: ${manifestPath} (共 ${urls.length} 个文件)`)
        },
      },
    ],
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('src', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    server: {
      port: 3000,
    },
  }
})