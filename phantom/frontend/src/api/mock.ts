export interface TextResult {
  ai_score: number
  scam_score: number
  burstiness: number
  perplexity: number
  verdict: string
  shap_attributions: { word: string; contribution: number }[]
}

export interface ImageResult {
  ai_score: number
  fft_anomaly: number
  clip_distance: number
  verdict: string
  gradcam_available: boolean
  filename?: string
}

export interface AudioResult {
  clone_score: number
  scam_score: number
  transcript: string
  verdict: string
  filename?: string
}

export interface VideoResult {
  deepfake_score: number
  temporal_variance: number
  frames_analyzed: number
  verdict: string
  frame_scores?: number[]
}

export interface DocumentResult {
  chunks_indexed: number
  avg_ai_score: number
  sections: { page: number; heading: string; ai_score: number }[]
  filename?: string
}

export interface RAGResult {
  answer: string
  sources: { page: number; heading: string; ai_score: number; relevance: number }[]
  query: string
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const mockText = async (text: string): Promise<TextResult> => {
  await delay(800)
  const words = text.split(/\s+/).filter(Boolean)
  const aiScore = Math.min(0.95, 0.4 + words.length * 0.008 + (text.includes('Furthermore') ? 0.2 : 0))
  return {
    ai_score: Math.round(aiScore * 100) / 100,
    scam_score: text.toLowerCase().includes('urgent') ? 0.67 : 0.12,
    burstiness: 0.24,
    perplexity: 18.4,
    verdict: aiScore > 0.7 ? 'likely_ai' : aiScore > 0.4 ? 'uncertain' : 'likely_human',
    shap_attributions: [
      { word: 'Furthermore', contribution: 0.14 },
      { word: 'comprehensive', contribution: 0.11 },
      { word: 'leverage', contribution: 0.09 },
      { word: 'utilize', contribution: 0.08 },
      { word: 'robust', contribution: 0.07 },
    ],
  }
}

export const mockImage = async (_file: File): Promise<ImageResult> => {
  await delay(1200)
  return { ai_score: 0.91, fft_anomaly: 0.78, clip_distance: 0.65, verdict: 'likely_ai', gradcam_available: true, filename: _file.name }
}

export const mockAudio = async (_file: File): Promise<AudioResult> => {
  await delay(1500)
  return {
    clone_score: 0.73,
    scam_score: 0.31,
    transcript: 'This is an urgent message from your bank. Please verify your account immediately.',
    verdict: 'suspicious',
    filename: _file.name,
  }
}

export const mockVideo = async (_file: File): Promise<VideoResult> => {
  await delay(2000)
  const frame_scores = Array.from({ length: 48 }, (_, i) => 0.5 + 0.35 * Math.sin(i * 0.4) + Math.random() * 0.15)
  return {
    deepfake_score: 0.82,
    temporal_variance: 0.45,
    frames_analyzed: 48,
    verdict: 'likely_deepfake',
    frame_scores,
  }
}

export const mockDocument = async (_file: File): Promise<DocumentResult> => {
  await delay(1800)
  return {
    chunks_indexed: 24,
    avg_ai_score: 0.61,
    sections: [
      { page: 1, heading: 'Introduction', ai_score: 0.32 },
      { page: 2, heading: 'Methodology', ai_score: 0.88 },
      { page: 3, heading: 'Results', ai_score: 0.74 },
      { page: 4, heading: 'Discussion', ai_score: 0.55 },
      { page: 5, heading: 'Conclusion', ai_score: 0.91 },
    ],
    filename: _file.name,
  }
}

export const mockRAG = async (query: string): Promise<RAGResult> => {
  await delay(1000)
  return {
    query,
    answer: 'Based on the document, the methodology section shows the highest AI-authorship signals (score 0.88), particularly in paragraphs describing data preprocessing and experimental design.',
    sources: [
      { page: 2, heading: 'Methodology', ai_score: 0.88, relevance: 0.94 },
      { page: 3, heading: 'Results', ai_score: 0.74, relevance: 0.71 },
    ],
  }
}
