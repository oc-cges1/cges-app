// src/features/documents/components/FileList.tsx

import { useState, useEffect } from 'react'
import { fetchFiles, deleteFile, formatFileSize } from '../api'
import type { FileRecord } from '../types'
import { useAuth }         from '@/features/auth/hooks/useAuth'

interface Props {
  refresh:   number
  onSelect?: (file: FileRecord) => void
  selected?: string
}

const MIME_ICON: Record<string, string> = {
  'application/pdf': '📕',
  'application/vnd.ms-powerpoint': '📊',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📊',
}

export default function FileList({ refresh, onSelect, selected }: Props) {
  const { isAdmin } = useAuth()
  const [files,   setFiles]   = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [pages,   setPages]   = useState(1)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchFiles(page)
      setFiles(data.files)
      setPages(data.pages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, refresh])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return
    await deleteFile(id)
    load()
  }

  if (loading) return <p style={{ color: '#4A6078', fontSize: 13 }}>Cargando archivos...</p>
  if (!files.length) return <p style={{ color: '#4A6078', fontSize: 13 }}>No hay archivos.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => onSelect?.(file)}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          12,
            padding:      '12px 14px',
            background:   selected === file.id ? 'rgba(26,127,191,0.1)' : '#0D1B2A',
            border:       `1px solid ${selected === file.id ? 'rgba(26,127,191,0.4)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 8,
            cursor:       onSelect ? 'pointer' : 'default',
            transition:   'all 150ms',
          }}
        >
          <span style={{ fontSize: 22, flexShrink: 0 }}>
            {MIME_ICON[file.mimeType] ?? '📄'}
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 13, fontWeight: 500, color: '#E8EDF2',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              marginBottom: 3,
            }}>
              {file.originalName}
            </p>
            <p style={{ fontSize: 11, color: '#4A6078' }}>
              {formatFileSize(file.size)} · {file.uploadedBy.name} · {new Date(file.createdAt).toLocaleDateString('es-CO')}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(file.id, file.originalName) }}
              style={{
                background:   'transparent',
                border:       '1px solid rgba(204,43,43,0.3)',
                borderRadius: 4,
                color:        '#CC2B2B',
                fontSize:     11,
                padding:      '4px 10px',
                cursor:       'pointer',
                flexShrink:   0,
              }}
            >
              Eliminar
            </button>
          )}
        </div>
      ))}

      {/* Paginación */}
      {pages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            style={{ padding: '4px 12px', cursor: 'pointer', fontSize: 12,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4, color: '#7A8FA6' }}
          >← Ant</button>
          <span style={{ fontSize: 12, color: '#4A6078', alignSelf: 'center' }}>
            {page} / {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage(p => p + 1)}
            style={{ padding: '4px 12px', cursor: 'pointer', fontSize: 12,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4, color: '#7A8FA6' }}
          >Sig →</button>
        </div>
      )}
    </div>
  )
}