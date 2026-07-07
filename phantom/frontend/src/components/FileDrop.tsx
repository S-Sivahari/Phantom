import { useRef, DragEvent, ChangeEvent, ReactNode } from 'react'

interface Props {
  accept: string
  onFile: (file: File) => void
  file: File | null
  children?: ReactNode
}

export default function FileDrop({ accept, onFile, file, children }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onFile(f)
  }

  return (
    <div
      className="file-drop"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept={accept} hidden onChange={handleChange} />
      {children ?? (
        <>
          <div style={{ fontSize: 32 }}>📁</div>
          <p>Drop file here or click to browse</p>
        </>
      )}
      {file && <div className="filename">{file.name}</div>}
    </div>
  )
}
