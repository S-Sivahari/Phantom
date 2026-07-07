import { useState } from 'react'
import { analyzeDocument, queryRAG } from '../api/client'
import type { DocumentResult, RAGResult } from '../api/mock'
import FileDrop from '../components/FileDrop'
import ScoreBar, { scoreColor } from '../components/ScoreBar'

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
  sources?: RAGResult['sources']
}

export default function DocumentPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DocumentResult | null>(null)
  const [query, setQuery] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])

  const run = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    setMessages([])
    try {
      setResult(await analyzeDocument(file))
    } finally {
      setLoading(false)
    }
  }

  const ask = async () => {
    if (!query.trim()) return
    const q = query.trim()
    setQuery('')
    setMessages((m) => [...m, { role: 'user', content: q }])
    setChatLoading(true)
    try {
      const res = await queryRAG(q)
      setMessages((m) => [...m, { role: 'assistant', content: res.answer, sources: res.sources }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h2>Document Analysis + RAG</h2>
        <p>PDF chunk-level AI detection with ChromaDB vector storage and cross-encoder reranking</p>
      </div>

      <div className="card">
        <div className="card-title">Upload PDF</div>
        <FileDrop accept=".pdf,application/pdf" onFile={(f) => { setFile(f); setResult(null); setMessages([]) }} file={file} />
        <button className="btn" onClick={run} disabled={loading || !file}>
          {loading ? 'Indexing' : 'Analyze & Index Document'}
        </button>
      </div>

      {loading && <div className="loading">Parsing PDF · chunking · ChromaDB indexing</div>}

      {result && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">Document AI Heatmap</div>
            <div className="score-row" style={{ marginBottom: 16 }}>
              <ScoreBar label="Avg AI Score" value={result.avg_ai_score} />
              <div className="score-card">
                <div className="label">Chunks Indexed</div>
                <div className="value" style={{ fontSize: 22 }}>{result.chunks_indexed}</div>
              </div>
            </div>
            <div className="doc-heatmap">
              {result.sections.map((s) => (
                <div key={s.page} className="doc-section">
                  <div className="bar" style={{ background: scoreColor(s.ai_score) }} />
                  <div className="info">
                    <h4>{s.heading}</h4>
                    <p>Page {s.page} · AI score {(s.ai_score * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">RAG Query Panel</div>
            <div className="chat-panel">
              <div className="chat-messages">
                {messages.length === 0 && (
                  <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                    Ask questions about the document or query AI-authored sections
                  </p>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`chat-msg ${m.role}`}>
                    <div className="bubble">{m.content}</div>
                    {m.sources && (
                      <div className="sources">
                        Sources: {m.sources.map((s) => `p.${s.page} ${s.heading} (${(s.relevance * 100).toFixed(0)}%)`).join(' · ')}
                      </div>
                    )}
                  </div>
                ))}
                {chatLoading && <div className="loading">Reranking · generating</div>}
              </div>
              <div className="chat-input-row">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && ask()}
                  placeholder="Which sections are most AI-written?"
                />
                <button className="btn" style={{ marginTop: 0 }} onClick={ask} disabled={chatLoading}>Ask</button>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <span className="tag">ChromaDB</span>
              <span className="tag">MiniLM-L6-v2</span>
              <span className="tag">cross-encoder</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
