// src/features/documents/pages/DocumentsPage.tsx

import { useState }   from 'react'
import { useAuth }    from '@/features/auth/hooks/useAuth'
import FileUpload     from '../components/FileUpload'
import FileList       from '../components/FileList'
import AiChat         from '../components/AiChat'
import type { FileRecord } from '../types'

export default function DocumentsPage() {
  const { isAdmin, role } = useAuth()
  const canUpload         = isAdmin || role === 'ADMIN'
  const [refresh,  setRefresh]  = useState(0)
  const [selected, setSelected] = useState<FileRecord | null>(null)
  const [tab,      setTab]      = useState<'files' | 'chat'>('files')

  return (
    <main style={{ flex: 1, padding: '32px 32px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span style={{
          fontSize: 10, fontWeight: 500, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: '#1A7FBF', display: 'block', marginBottom: 8,
        }}>
          Gestión documental
        </span>
        <h1 style={{
          fontFamily: 'Rajdhani, Arial Narrow, sans-serif',
          fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 700,
          letterSpacing: '0.06em', color: '#E8EDF2', lineHeight: 1,
        }}>
          Documentos e Inteligencia Artificial
        </h1>
        <p style={{ fontSize: 14, color: '#7A8FA6', marginTop: 8 }}>
          Sube documentos PDF/PPT y consulta su contenido con IA.
          {!canUpload && ' (Necesitas rol ADMIN o EDITOR para subir archivos.)'}
        </p>
      </div>

      {/* Layout: izquierda archivos, derecha chat */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'minmax(280px, 380px) 1fr',
        gap:                 24,
        alignItems:          'start',
      }}>

        {/* Panel izquierdo — archivos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Subida — solo si tiene permiso */}
          {canUpload && (
            <div style={{
              background: '#0D1B2A', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.06)', padding: '20px',
            }}>
              <h2 style={{
                fontFamily: 'Rajdhani, Arial Narrow, sans-serif',
                fontSize: 16, fontWeight: 600, color: '#E8EDF2',
                letterSpacing: '0.06em', marginBottom: 14,
              }}>
                Subir archivo
              </h2>
              <FileUpload onUploaded={() => setRefresh(r => r + 1)} />
            </div>
          )}

          {/* Lista de archivos */}
          <div style={{
            background: '#0D1B2A', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.06)', padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{
                fontFamily: 'Rajdhani, Arial Narrow, sans-serif',
                fontSize: 16, fontWeight: 600, color: '#E8EDF2', letterSpacing: '0.06em',
              }}>
                Archivos
              </h2>
              {selected && (
                <span style={{ fontSize: 11, color: '#1A7FBF' }}>
                  Seleccionado para chat
                </span>
              )}
            </div>
            <p style={{ fontSize: 11, color: '#4A6078', marginBottom: 12 }}>
              Haz clic en un archivo para consultarlo con IA
            </p>
            <FileList
              refresh={refresh}
              onSelect={(f) => setSelected(prev => prev?.id === f.id ? null : f)}
              selected={selected?.id}
            />
          </div>
        </div>

        {/* Panel derecho — chat IA */}
        <div>
          <AiChat selectedFile={selected} />
        </div>
      </div>
    </main>
  )
}