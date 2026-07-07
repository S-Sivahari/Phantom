import { useState } from 'react'
import { analyzeAudio } from '../api/client'
import type { AudioResult } from '../api/mock'
import FileDrop from '../components/FileDrop'
import ScoreBar, { verdictClass, verdictLabel } from '../components/ScoreBar'

export default function AudioPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AudioResult | null>(null)

  const run = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    try {
      setResult(await analyzeAudio(file))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h2>Audio Detection</h2>
        <p>Whisper transcription + MFCC feature extraction + spectrogram CNN for voice clone detection</p>
      </div>

      <div className="card">
        <div className="card-title">Upload Audio</div>
        <FileDrop accept="audio/*" onFile={(f) => { setFile(f); setResult(null) }} file={file} />
        <button className="btn" onClick={run} disabled={loading || !file}>
          {loading ? 'Transcribing & Analyzing' : 'Analyze Audio'}
        </button>
      </div>

      {loading && <div className="loading">Running Whisper + spectrogram CNN</div>}

      {result && (
        <>
          <div className="score-row">
            <ScoreBar label="Voice Clone" value={result.clone_score} />
            <ScoreBar label="Scam (Transcript)" value={result.scam_score} />
            <div className="score-card">
              <div className="label">Verdict</div>
              <span className={`verdict ${verdictClass(result.verdict)}`} style={{ marginTop: 12 }}>{verdictLabel(result.verdict)}</span>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-title">Spectrogram</div>
              <div className="spectrogram" />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                AI-cloned voices show unnaturally clean formant transitions
              </p>
            </div>

            <div className="card">
              <div className="card-title">Whisper Transcript</div>
              <p style={{ fontSize: 14, lineHeight: 1.7 }}>"{result.transcript}"</p>
              <div style={{ marginTop: 12 }}>
                <span className="tag">whisper-base</span>
                <span className="tag">40 MFCC</span>
                <span className="tag">FakeAVCeleb CNN</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
