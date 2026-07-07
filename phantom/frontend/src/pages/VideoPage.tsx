import { useState } from 'react'
import { analyzeVideo } from '../api/client'
import type { VideoResult } from '../api/mock'
import FileDrop from '../components/FileDrop'
import ScoreBar, { scoreColor, verdictClass, verdictLabel } from '../components/ScoreBar'

export default function VideoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<VideoResult | null>(null)

  const run = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 0.08, 0.95))
    }, 150)

    try {
      const res = await analyzeVideo(file)
      setProgress(1)
      setResult(res)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h2>Video Detection</h2>
        <p>Per-frame face-region CNN with temporal consistency scoring — processed async via Celery</p>
      </div>

      <div className="card">
        <div className="card-title">Upload Video</div>
        <FileDrop accept="video/*" onFile={(f) => { setFile(f); setResult(null) }} file={file} />
        <button className="btn" onClick={run} disabled={loading || !file}>
          {loading ? `Processing ${Math.round(progress * 100)}%` : 'Analyze Video'}
        </button>
        {loading && (
          <div className="score-bar-wrap" style={{ marginTop: 16 }}>
            <div className="score-bar-bg">
              <div className="score-bar-fill" style={{ width: `${progress * 100}%`, background: 'var(--accent)' }} />
            </div>
          </div>
        )}
      </div>

      {loading && !result && <div className="loading">Extracting frames · face detection · temporal analysis</div>}

      {result && (
        <>
          <div className="score-row">
            <ScoreBar label="Deepfake Score" value={result.deepfake_score} />
            <ScoreBar label="Temporal Variance" value={result.temporal_variance} />
            <div className="score-card">
              <div className="label">Frames Analyzed</div>
              <div className="value" style={{ fontSize: 22 }}>{result.frames_analyzed}</div>
              <span className={`verdict ${verdictClass(result.verdict)}`} style={{ marginTop: 8 }}>{verdictLabel(result.verdict)}</span>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Per-Frame AI Score Timeline</div>
            <div className="timeline">
              {result.frame_scores?.map((s, i) => (
                <div
                  key={i}
                  className="timeline-bar"
                  style={{ height: `${s * 100}%`, background: scoreColor(s) }}
                  title={`Frame ${i + 1}: ${(s * 100).toFixed(0)}%`}
                />
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
              High frame-to-frame variance indicates deepfake flicker artifacts
            </p>
          </div>
        </>
      )}
    </>
  )
}
