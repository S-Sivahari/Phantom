import type { TextResult, ImageResult, AudioResult, VideoResult, DocumentResult, RAGResult } from './mock'
import * as mock from './mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API = '/api'

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function upload<T>(path: string, file: File): Promise<T> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API}${path}`, { method: 'POST', body: form })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const analyzeText = (text: string): Promise<TextResult> =>
  USE_MOCK ? mock.mockText(text) : post('/analyze/text', { text })

export const analyzeImage = (file: File): Promise<ImageResult> =>
  USE_MOCK ? mock.mockImage(file) : upload('/analyze/image', file)

export const analyzeAudio = (file: File): Promise<AudioResult> =>
  USE_MOCK ? mock.mockAudio(file) : upload('/analyze/audio', file)

export const analyzeVideo = (file: File): Promise<VideoResult> =>
  USE_MOCK ? mock.mockVideo(file) : upload('/analyze/video', file).then(() => mock.mockVideo(file))

export const analyzeDocument = (file: File): Promise<DocumentResult> =>
  USE_MOCK ? mock.mockDocument(file) : upload('/analyze/document', file)

export const queryRAG = (query: string): Promise<RAGResult> =>
  USE_MOCK ? mock.mockRAG(query) : post('/analyze/rag/query', { query })
