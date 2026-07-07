import { useState } from 'react'
import { analyzeText } from '../api/client'
import type { TextResult } from '../api/mock'
import ScoreBar, { verdictClass, verdictLabel } from '../components/ScoreBar'

const SAMPLE = `Furthermore, it is important to note that this comprehensive analysis leverages robust methodologies to utilize advanced detection techniques. The framework provides a holistic approach to identifying AI-generated content across multiple modalities.`

function ShapHighlight({ text, attributions }: { text: string; attributions: TextResult['shap_attributions'] }) {
  const attrMap = Object.fromEntries(attributions.map((a) => [a.word.toLowerCase(), a.contribution]))
  const words = text.split(/(\s+)/)

  return (
    <div>
      <div className="shap-text">
        {words.map((w, i) => {
          const clean = w.replace(/[^a-zA-Z]/g, '').toLowerCase()
          const contrib = attrMap[clean]
          if (!contrib) return <span key={i}>{w}</span>
          const alpha = Math.min(0.7, contrib * 4)
          return (
            <span key={i} className="shap-word" style={{ background: `rgba(239,68,68,${alpha})` }} title={`+${contrib.toFixed(2)} AI signal`}>
              {w}
            </span>
          )
        })}
      </div>
      <div className="shap-legend">
        <span><span className="dot" style={{ background: 'rgba(239,68,68,0.6)' }} /> High AI contribution</span>
        <span><span className="dot" style={{ background: 'transparent', border: '1px solid var(--border)' }} /> Neutral</span>
      </div>
    </div>
  )
}

export default function TextPage() {
  const [text, setText] = useState(SAMPLE)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TextResult | null>(null)

  const run = async () => {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)
    try {
      setResult(await analyzeText(text))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h2>Text Detection</h2>
        <p>DistilBERT ensemble with perplexity, burstiness, and SHAP word-level explainability</p>
      </div>

      <div className="card">
        <div className="card-title">Input</div>
        <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text to analyze..." />
        <button className="btn" onClick={run} disabled={loading || !text.trim()}>
          {loading ? 'Analyzing' : 'Analyze Text'}
        </button>
      </div>

      {loading && <div className="loading">Running DistilBERT + SHAP attribution</div>}

      {result && (
        <>
          <div className="score-row">
            <ScoreBar label="AI Score" value={result.ai_score} />
            <ScoreBar label="Scam Score" value={result.scam_score} />
            <ScoreBar label="Burstiness" value={result.burstiness} />
            <div className="score-card">
              <div className="label">Perplexity</div>
              <div className="value" style={{ fontSize: 22 }}>{result.perplexity}</div>
              <span className={`verdict ${verdictClass(result.verdict)}`} style={{ marginTop: 8 }}>{verdictLabel(result.verdict)}</span>
            </div>
          </div>

          <div className="card">
            <div className="card-title">SHAP Word Attribution</div>
            <ShapHighlight text={text} attributions={result.shap_attributions} />
          </div>

          <div className="card">
            <div className="card-title">Top Contributing Tokens</div>
            <table>
              <thead><tr><th>Word</th><th>SHAP Contribution</th><th>Direction</th></tr></thead>
              <tbody>
                {result.shap_attributions.map((a) => (
                  <tr key={a.word}>
                    <td><code>{a.word}</code></td>
                    <td>+{a.contribution.toFixed(3)}</td>
                    <td style={{ color: 'var(--danger)' }}>↑ AI signal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
