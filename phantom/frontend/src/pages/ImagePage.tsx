import { useState } from 'react'
import { analyzeImage } from '../api/client'
import type { ImageResult } from '../api/mock'
import FileDrop from '../components/FileDrop'
import ScoreBar, { verdictClass, verdictLabel } from '../components/ScoreBar'

export default function ImagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImageResult | null>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setResult(null)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const run = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    try {
      setResult(await analyzeImage(file))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h2>Image Detection</h2>
        <p>EfficientNet-B0 + FFT frequency analysis + CLIP embeddings with GradCAM heatmaps</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Upload Image</div>
          <FileDrop accept="image/*" onFile={handleFile} file={file} />
          <button className="btn" onClick={run} disabled={loading || !file}>
            {loading ? 'Analyzing' : 'Detect AI Image'}
          </button>
        </div>

        <div className="card">
          <div className="card-title">GradCAM Heatmap</div>
          <div className="gradcam-container">
            {preview ? (
              <>
                <img src={preview} alt="upload" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                {result?.gradcam_available && <div className="gradcam-overlay" />}
              </>
            ) : (
              <div className="gradcam-placeholder">🖼️</div>
            )}
          </div>
          {result?.gradcam_available && (
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
              Red regions indicate highest CNN activation for AI-generated artifacts
            </p>
          )}
        </div>
      </div>

      {loading && <div className="loading">Running EfficientNet + FFT + CLIP ensemble</div>}

      {result && (
        <div className="score-row">
          <ScoreBar label="AI Generated" value={result.ai_score} />
          <ScoreBar label="FFT Anomaly" value={result.fft_anomaly} />
          <ScoreBar label="CLIP Distance" value={result.clip_distance} />
          <div className="score-card">
            <div className="label">Verdict</div>
            <span className={`verdict ${verdictClass(result.verdict)}`} style={{ marginTop: 12 }}>{verdictLabel(result.verdict)}</span>
          </div>
        </div>
      )}
    </>
  )
}
