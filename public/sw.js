const CACHE_NAME = 'alpinestar-toolbox-v18' // 版本号更新
const CHANNEL_NAME = 'sw-cache-channel'

// ====== 手动维护需要预缓存的外部资源（CDN） ======
// 注意：@jsquash 已本地化，无需在此添加
const EXTERNAL_URLS = [
  // 按需添加其他 CDN 资源，例如：
  // 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
  // 'https://cdn.jsdelivr.net/npm/xxx/xxx.min.js',
]

let cachingEnabled = true

let bc = null
try { bc = new BroadcastChannel(CHANNEL_NAME) } catch (_) {}

function sendProgress(data) {
  if (bc) {
    bc.postMessage(data)
  } else {
    self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
      clients.forEach(c => c.postMessage(data))
    })
  }
}

function cleanRequest(request) {
  const url = new URL(request.url)
  url.search = ''
  url.hash = ''
  return new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    mode: 'same-origin',
    credentials: request.credentials,
  })
}

async function cacheAllResources() {
  try {
    // 1. 获取同源资源清单
    const manifestUrl = new URL('./asset-manifest.json', self.location.href).href
    const res = await fetch(manifestUrl)
    if (!res.ok) throw new Error(`Manifest fetch failed: ${res.status}`)
    const { urls = [] } = await res.json()

    // 2. 合并同源和外部资源
    const allUrls = [...new Set([...urls, ...EXTERNAL_URLS])]
    const total = allUrls.length
    const cache = await caches.open(CACHE_NAME)

    for (let i = 0; i < total; i++) {
      const url = allUrls[i]
      const absoluteUrl = new URL(url, self.location.origin).href
      const isSameOrigin = absoluteUrl.startsWith(self.location.origin)
      try {
        const opts = isSameOrigin ? {} : { mode: 'cors' }
        const response = await fetch(absoluteUrl, opts)
        if (response.ok || response.type === 'opaque') {
          const ct = response.headers.get('Content-Type') || ''
          const isHtml = ct.includes('text/html')
          const isRoot = absoluteUrl === self.location.origin + self.location.pathname.replace(/sw\.js$/, '')
          if (!isHtml || isRoot) {
            await cache.put(absoluteUrl, response)
          }
        }
      } catch (err) {
        console.warn('[SW] 预缓存失败:', absoluteUrl, err)
      }
      sendProgress({
        type: 'CACHE_PROGRESS',
        progress: Math.round(((i + 1) / total) * 100),
        current: i + 1,
        total,
        url: absoluteUrl,
      })
    }

    // 3. 确保缓存根路径（导航回退用）
    const rootUrl = self.location.origin + self.location.pathname.replace(/sw\.js$/, '')
    await cache.add(rootUrl)

    sendProgress({ type: 'CACHE_COMPLETE' })
  } catch (err) {
    console.error('[SW] 缓存失败:', err)
    sendProgress({ type: 'CACHE_ERROR', error: err.message })
  }
}

async function clearAllCaches() {
  const keys = await caches.keys()
  await Promise.all(keys.map(key => caches.delete(key)))
  sendProgress({ type: 'CACHE_CLEARED' })
}

self.addEventListener('message', (event) => {
  const data = event.data
  if (!data) return
  if (data.type === 'START_CACHE') {
    cachingEnabled = true
    event.waitUntil(cacheAllResources())
  } else if (data.type === 'STOP_CACHE') {
    cachingEnabled = false
    event.waitUntil(clearAllCaches())
  }
})

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    if (cachingEnabled) await cacheAllResources()
    self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)

  // ===== 导航请求：网络优先，离线回退首页 =====
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        if (!cachingEnabled) return new Response('', { status: 503, statusText: 'Offline' })
        const rootUrl = self.location.origin + self.location.pathname.replace(/sw\.js$/, '')
        return caches.match(rootUrl).then(cached => cached || caches.match('./index.html'))
      })
    )
    return
  }

  // ===== 同源请求：缓存优先，网络回退并更新缓存 =====
  if (url.origin === self.location.origin) {
    if (cachingEnabled) {
      const clean = cleanRequest(event.request)
      event.respondWith(
        caches.match(clean).then(cached => {
          if (cached) return cached
          return fetch(event.request).then(response => {
            if (response.ok && !(response.headers.get('Content-Type') || '').includes('text/html')) {
              const clone = response.clone()
              caches.open(CACHE_NAME).then(cache => cache.put(clean, clone))
            }
            return response
          }).catch(() => new Response('', { status: 503, statusText: 'Offline' }))
        })
      )
    } else {
      event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503, statusText: 'Offline' })))
    }
    return
  }

  // ===== 跨域请求：缓存优先（先精确，再忽略查询参数），网络回退并缓存 =====
  if (cachingEnabled) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || caches.match(cleanRequest(event.request)))
        .then(cached => {
          if (cached) return cached

          // 网络请求，强制 CORS 模式
          return fetch(event.request, { mode: 'cors' })
            .then(response => {
              // 允许缓存正常响应或 opaque 响应
              if (response.ok || response.type === 'opaque') {
                const clone = response.clone()
                const cachePromise = caches.open(CACHE_NAME).then(cache => {
                  // 同时以原始请求和清理后的请求为键存储，提高命中率
                  cache.put(event.request, clone)
                  return cache.put(cleanRequest(event.request), response)
                })
                event.waitUntil(cachePromise)
              }
              return response
            })
            .catch(err => {
              console.warn('[SW] 跨域请求失败:', event.request.url, err)
              return new Response('', { status: 503, statusText: 'Offline' })
            })
        })
    )
  } else {
    event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503, statusText: 'Offline' })))
  }
})