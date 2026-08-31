// components/tools/ImageConverter/useImageConvert.ts
import { ref, onUnmounted } from 'vue'

export interface ConvertResult {
  blob: Blob
  originalSize: number
  convertedSize: number
  skipped?: boolean
}

export function useImageConvert() {
  const isConverting = ref(false)
  const error = ref<string | null>(null)

  const worker = new Worker(
    new URL('./imageWorker.ts', import.meta.url),
    { type: 'module' }
  )

  function convert(
    file: File,
    format: string,
    quality = 80
  ): Promise<ConvertResult> {
    return new Promise((resolve, reject) => {
      isConverting.value = true
      error.value = null
      const id = Date.now()

      const onMessage = (e: MessageEvent) => {
        if (e.data.id !== id) return
        worker.removeEventListener('message', onMessage)
        isConverting.value = false

        if (e.data.success) {
          resolve({
            blob: e.data.blob,
            originalSize: file.size,
            convertedSize: e.data.blob.size,
            skipped: e.data.skipped || false,
          })
        } else {
          const errMsg = e.data.error || '转换失败'
          error.value = errMsg
          reject(new Error(errMsg))
        }
      }

      worker.addEventListener('message', onMessage)
      worker.postMessage({ id, file, targetFormat: format, quality })
    })
  }

  onUnmounted(() => {
    worker.terminate()
  })

  return { convert, isConverting, error }
}
