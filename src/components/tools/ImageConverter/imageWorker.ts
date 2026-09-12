/// <reference lib="webworker" />

const ctx = self as unknown as DedicatedWorkerGlobalScope

import { decode as decodeJpeg, encode as encodeJpeg } from '@jsquash/jpeg'
import { decode as decodePng, encode as encodePng } from '@jsquash/png'
import { decode as decodeWebp, encode as encodeWebp } from '@jsquash/webp'
import { decode as decodeAvif, encode as encodeAvif } from '@jsquash/avif'

const codecs: Record<string, { decode: any; encode: any }> = {
  jpeg: { decode: decodeJpeg, encode: encodeJpeg },
  png: { decode: decodePng, encode: encodePng },
  webp: { decode: decodeWebp, encode: encodeWebp },
  avif: { decode: decodeAvif, encode: encodeAvif },
}

function loadCodec(format: string): { decode: any; encode: any } {
  const codec = codecs[format]
  if (!codec) throw new Error(`不支持的格式: ${format}`)
  return codec
}

function detectFormat(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer, 0, 12)

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg'
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'png'
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'webp'
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
    const sourceFormat = detectFormat(buffer)
    if (!sourceFormat) {
      throw new Error('无法识别图片格式，请确认文件是有效的图片')
    }

    if (sourceFormat === targetFormat) {
      ctx.postMessage({
        id,
        success: true,
        blob: new Blob([buffer], { type: `image/${targetFormat}` }),
        skipped: true,
      })
      return
    }

    const decoder = loadCodec(sourceFormat)
    const imageData = await decoder.decode(buffer)

    const encoder = loadCodec(targetFormat)

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