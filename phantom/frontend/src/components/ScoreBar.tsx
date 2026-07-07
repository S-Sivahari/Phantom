export function scoreColor(value: number): string {
  if (value >= 0.7) return 'var(--danger)'
  if (value >= 0.4) return 'var(--warning)'
  return 'var(--success)'
}

export function verdictClass(verdict: string): string {
  if (verdict.includes('ai') || verdict.includes('deepfake') || verdict.includes('suspicious')) return 'danger'
  if (verdict.includes('uncertain')) return 'warning'
  return 'success'
}

export function verdictLabel(verdict: string): string {
  return verdict.replace(/_/g, ' ')
}

export default function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div className="score-card">
      <div className="label">{label}</div>
      <div className="value" style={{ color: scoreColor(value) }}>{pct}%</div>
      <div className="score-bar-wrap">
        <div className="score-bar-bg">
          <div className="score-bar-fill" style={{ width: `${pct}%`, background: scoreColor(value) }} />
        </div>
      </div>
    </div>
  )
}
