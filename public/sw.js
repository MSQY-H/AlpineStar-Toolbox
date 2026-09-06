const CACHE_NAME = 'alpinestar-toolbox-v15'
const CHANNEL_NAME = 'sw-cache-channel'

const EXTERNAL_URLS = [
  'https://esm.sh/@jsquash/jpeg',
  'https://esm.sh/@jsquash/png',
  'https://esm.sh/@jsquash/webp',
  'https://esm.sh/@jsquash/avif',
]

let cachingEnabled = true

// BroadcastChannel 用于进度通知（可选）
let bc = null
try { bc = new BroadcastChannel(CHANNEL_NAME) } catch (_) {}

function sendProgress(data) {
  if (bc) bc.postMessage(data)
  else self.clients.matchAll({ includeUncontrolled: true }).then(clients => clients.forEach(c => c.postMessage(data)))
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
    const manifestUrl = new URL('./asset-manifest.json', self.location.href).href
    const res = await fetch(manifestUrl)
    if (!res.ok) throw new Error(`Manifest fetch failed: ${res.status}`)
    const { urls = [] } = await res.json()
    const allUrls = [...new Set([...urls, ...EXTERNAL_URLS])]
    const total = allUrls.length
    const cache = await caches.open(CACHE_NAME)

    for (let i = 0; i < total; i++) {
      const url = allUrls[i]
      const absoluteUrl = new URL(url, self.location.origin).href
      try {
        const opts = absoluteUrl.startsWith(self.location.origin) ? {} : { mode: 'cors' }
        const response = await fetch(absoluteUrl, opts)
        if (response.ok) {
          const ct = response.headers.get('Content-Type') || ''
          const isHtml = ct.includes('text/html')
          const isRoot = absoluteUrl === self.location.origin + self.location.pathname.replace(/sw\.js$/, '')
          if (!isHtml || isRoot) await cache.put(absoluteUrl, response)
        }
      } catch (err) { console.warn('[SW] 缓存失败:', absoluteUrl, err) }
      sendProgress({ type: 'CACHE_PROGRESS', progress: Math.round(((i + 1) / total) * 100), current: i + 1, total, url: absoluteUrl })
    }

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

// 监听页面发送的 postMessage 命令
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
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)

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

  if (cachingEnabled) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || caches.match(cleanRequest(event.request))).then(cached => {
        if (cached) return cached
        return fetch(event.request).then(response => {
          if (response.ok && !(response.headers.get('Content-Type') || '').includes('text/html')) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(cleanRequest(event.request), clone))
          }
          return response
        }).catch(() => new Response('', { status: 503, statusText: 'Offline' }))
      })
    )
  } else {
    event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503, statusText: 'Offline' })))
  }
})