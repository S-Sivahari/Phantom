import { NavLink } from 'react-router-dom'

const links = [
  { to: '/text', icon: 'T', label: 'Text' },
  { to: '/image', icon: 'I', label: 'Image' },
  { to: '/audio', icon: 'A', label: 'Audio' },
  { to: '/video', icon: 'V', label: 'Video' },
  { to: '/document', icon: 'D', label: 'Documents' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="icon">👻</div>
        <div>
          <h1>Phantom</h1>
          <span>Deepfake Detection</span>
        </div>
      </div>

      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span style={{ width: 20, textAlign: 'center', fontSize: 12, fontWeight: 700, opacity: 0.6 }}>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        DistilBERT · Whisper · ChromaDB<br />
        Redis · Celery · Docker
      </div>
    </aside>
  )
}
