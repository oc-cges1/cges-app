// src/features/documents/components/FileUpload.tsx

import { useState, useRef, DragEvent } from 'react'
import { uploadFile }                  from '../api'

interface Props {
  onUploaded: () => void
}

export default function FileUpload({ onUploaded }: Props) {
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error,    setError]      = useState('')
  const [success,  setSuccess]    = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const ACCEPTED = '.pdf,.ppt,.pptx'
  const MAX_MB   = 10

  const handleFile = async (file: File) => {
    setError(''); setSuccess('')
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`El archivo supera ${MAX_MB}MB.`); return
    }
    const valid = ['application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation']
    if (!valid.includes(file.type)) {
      setError('Solo se permiten archivos PDF, PPT y PPTX.'); return
    }
    setUploading(true)
    try {
      await uploadFile(file)
      setSuccess(`"${file.name}" subido correctamente.`)
      onUploaded()
    } catch {
      setError('Error al subir el archivo. Intente nuevamente.')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      {/* Zona de drop */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border:        `2px dashed ${dragging ? '#1A7FBF' : 'rgba(255,255,255,0.12)'}`,
          borderRadius:  10,
          padding:       '36px 24px',
          textAlign:     'center',
          cursor:        uploading ? 'not-allowed' : 'pointer',
          background:    dragging ? 'rgba(26,127,191,0.06)' : 'rgba(255,255,255,0.02)',
          transition:    'all 200ms',
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
        <p style={{
          fontFamily: 'Rajdhani, Arial Narrow, sans-serif',
          fontSize: 16, color: '#E8EDF2', marginBottom: 6,
        }}>
          {uploading ? 'Subiendo...' : 'Arrastra tu archivo aquí'}
        </p>
        <p style={{ fontSize: 12, color: '#4A6078' }}>
          PDF, PPT, PPTX — máx. {MAX_MB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>

      {error   && <p style={{ marginTop: 10, fontSize: 13, color: '#e87878' }}>{error}</p>}
      {success && <p style={{ marginTop: 10, fontSize: 13, color: '#14B45A' }}>{success}</p>}
    </div>
  )
}