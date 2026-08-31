// components/tools/ImageConverter/imageWorker.ts
/// <reference lib="webworker" />

const ctx = self as unknown as DedicatedWorkerGlobalScope

const CDN_BASE = 'https://esm.sh'

// 模块缓存：format -> { decode, encode }
const codecCache = new Map<string, any>()

/**
 * 从 esm.sh 按需加载 jSquash 编解码模块
 * WASM 二进制由模块内部自动加载，无需手动管理
 */
async function loadCodec(format: string): Promise<any> {
  if (codecCache.has(format)) return codecCache.get(format)

  // 动态 import 主模块（esm.sh 会自动处理 WASM 下载和初始化）
  const mod = await import(/* @vite-ignore */ `${CDN_BASE}/@jsquash/${format}`)

  // esm.sh 导出的模块结构：
  // - named exports: { decode, encode }
  // - default export: { decode, encode } (可能与 named exports 相同)
  // 优先使用 named exports，确保拿到正确的 decode/encode 函数
  const codec = mod.decode
    ? { decode: mod.decode, encode: mod.encode }
    : (mod.default || mod)

  codecCache.set(format, codec)
  return codec
}

/**
 * 通过文件头 magic bytes 识别真实图片格式
 * 不依赖 file.type，避免浏览器 MIME 误报
 */
function detectFormat(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer, 0, 12)

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg'
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'png'
  // WebP: 52 49 46 46 ... 57 45 42 50
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'webp'
  // AVIF / HEIF: ftyp box
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11])
    if (['avif', 'avis', 'heic', 'heix', 'mif1'].includes(brand)) return 'avif'
  }

  return ''
}

ctx.onmessage = async (
  e: MessageEvent<{
    id: number
    file: File
    targetFormat: string
    quality: number
  }>
) => {
  const { id, file, targetFormat, quality } = e.data

  try {
    const buffer = await file.arrayBuffer()

    // 通过 magic bytes 识别真实源格式
    const sourceFormat = detectFormat(buffer)
    if (!sourceFormat) {
      throw new Error('无法识别图片格式，请确认文件是有效的图片')
    }

    // 源格式与目标格式相同，跳过转换
    if (sourceFormat === targetFormat) {
      ctx.postMessage({
        id,
        success: true,
        blob: new Blob([buffer], { type: `image/${targetFormat}` }),
        skipped: true,
      })
      return
    }

    // 解码：自动加载 WASM 并解码
    const decoder = await loadCodec(sourceFormat)
    const imageData = await decoder.decode(buffer)

    // 编码：自动加载 WASM 并编码
    const encoder = await loadCodec(targetFormat)

    let encodedBuffer: ArrayBuffer
    if (targetFormat === 'png' || targetFormat === 'avif') {
      encodedBuffer = await encoder.encode(imageData)
    } else {
      encodedBuffer = await encoder.encode(imageData, { quality })
    }

    ctx.postMessage({
      id,
      success: true,
      blob: new Blob([encodedBuffer], { type: `image/${targetFormat}` }),
    })
  } catch (err) {
    ctx.postMessage({
      id,
      success: false,
      error: err instanceof Error ? err.message : '未知错误',
    })
  }
}
