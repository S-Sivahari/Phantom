import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import TextPage from './pages/TextPage'
import ImagePage from './pages/ImagePage'
import AudioPage from './pages/AudioPage'
import VideoPage from './pages/VideoPage'
import DocumentPage from './pages/DocumentPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/text" replace />} />
        <Route path="/text" element={<TextPage />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/audio" element={<AudioPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/document" element={<DocumentPage />} />
      </Routes>
    </Layout>
  )
}
