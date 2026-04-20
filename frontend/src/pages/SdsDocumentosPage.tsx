// src/pages/SdsDocumentosPage.tsx

import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate }    from 'react-router-dom'
import { useAuth }        from '@/features/auth/hooks/useAuth'
import {
  uploadFile,
  fetchFiles,
  deleteFile,
  getFilePreviewUrl,
  getFileDownloadUrl,
  formatFileSize,
}                         from '@/features/documents/api'
import type { FileRecord } from '@/features/documents/types'

// ─── Tipos locales ────────────────────────────────────────────

type PreviewState =
  | { kind: 'none' }
  | { kind: 'pdf'; file: FileRecord }
  | { kind: 'ppt'; file: FileRecord }

// ─── Helpers ──────────────────────────────────────────────────

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]
const ACCEPTED_EXT = ['.pdf', '.ppt', '.pptx']
const MAX_MB       = 10
const MAX_BYTES    = MAX_MB * 1024 * 1024

function fileIcon(mimeType: string): string {
  return mimeType === 'application/pdf' ? '📕' : '📊'
}

function fileLabel(mimeType: string): string {
  if (mimeType === 'application/pdf')                 return 'PDF'
  if (mimeType === 'application/vnd.ms-powerpoint')  return 'PPT'
  return 'PPTX'
}

// ─── Componente principal ─────────────────────────────────────

export default function SdsDocumentosPage() {
  const navigate            = useNavigate()
  const inputRef            = useRef<HTMLInputElement>(null)
  const { isAdmin, role }   = useAuth()
  const canUpload           = isAdmin || role === 'ADMIN'

  const [files,    setFiles]    = useState<FileRecord[]>([])
  const [preview,  setPreview]  = useState<PreviewState>({ kind: 'none' })
  const [dragging, setDragging] = useState(false)
  const [loading,  setLoading]  = useState(true)
  const [uploading,setUploading]= useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  const accentColor = '#C4940A'

  // ── Cargar archivos del backend ─────────────────────────────
  const loadFiles = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchFiles(1)
      setFiles(data.files)
    } catch {
      setError('No se pudieron cargar los archivos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadFiles() }, [loadFiles])

  // ── Subir archivo al backend ────────────────────────────────
  const addFile = useCallback(async (file: File) => {
    setError(''); setSuccess('')

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Solo se permiten archivos PDF, PPT y PPTX.'); return
    }
    if (file.size > MAX_BYTES) {
      setError(`El archivo supera los ${MAX_MB} MB.`); return
    }

    setUploading(true)
    try {
      await uploadFile(file)
      setSuccess(`"${file.name}" subido correctamente.`)
      await loadFiles()           // refrescar lista desde backend
      setTimeout(() => setSuccess(''), 4000)
    } catch {
      setError('Error al subir el archivo. Verifique su conexión.')
    } finally {
      setUploading(false)
    }
  }, [loadFiles])

  // ── Eliminar archivo del backend ────────────────────────────
  const handleDelete = async (file: FileRecord) => {
    if (!confirm(`¿Eliminar "${file.originalName}"?`)) return
    try {
      await deleteFile(file.id)
      setPreview(p => (p.kind !== 'none' && p.file.id === file.id) ? { kind:'none' } : p)
      await loadFiles()
    } catch {
      setError('No se pudo eliminar el archivo.')
    }
  }

  // ── Descarga real desde backend ─────────────────────────────
  const handleDownload = (file: FileRecord) => {
    const a   = document.createElement('a')
    a.href     = getFileDownloadUrl(file.storedName)
    a.download = file.originalName
    a.target   = '_blank'
    a.click()
  }

  // ── Preview ──────────────────────────────────────────────────
  const openPreview = (file: FileRecord) => {
    setPreview(
      file.mimeType === 'application/pdf'
        ? { kind: 'pdf', file }
        : { kind: 'ppt', file }
    )
  }

  // ── Drag & Drop ──────────────────────────────────────────────
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = ()                   => setDragging(false)
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) addFile(file)
  }

  // ─── Render ───────────────────────────────────────────────────
  return (
    <main style={{ flex:1, display:'flex', flexDirection:'column' }}>

      {/* Hero / cabecera */}
      <section style={{
        position:'relative', padding:'40px 32px 32px',
        borderBottom:'1px solid rgba(255,255,255,0.06)', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize:'40px 40px',
          maskImage:'radial-gradient(ellipse at 15% 50%,black 0%,transparent 55%)',
        }} />
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg,transparent 0%,${accentColor} 30%,${accentColor}60 60%,transparent 100%)`,
        }} />

        <div style={{ position:'relative', zIndex:1 }}>
          {/* Breadcrumb */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, fontSize:12, color:'#4A6078', letterSpacing:'0.04em' }}>
            {[
              { label:'Panel Principal',          path:'/'  },
              { label:'Sistema Departamental',    path:'/sistema-departamental-de-seguridad' },
            ].map((bc, i) => (
              <span key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span
                  onClick={() => navigate(bc.path)}
                  style={{ color:accentColor, cursor:'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration='underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration='none')}
                >{bc.label}</span>
                <span style={{ color:'#2E4055' }}>/</span>
              </span>
            ))}
            <span style={{ color:'#7A8FA6' }}>Documentos</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:10 }}>
            <span style={{ fontSize:38, lineHeight:1, filter:`drop-shadow(0 0 10px ${accentColor})` }}>📁</span>
            <div>
              <span style={{ display:'block', fontSize:10, fontWeight:500, letterSpacing:'0.22em', textTransform:'uppercase', color:accentColor, marginBottom:5 }}>
                Submódulo
              </span>
              <h1 style={{
                fontFamily:'Rajdhani, Arial Narrow, sans-serif',
                fontSize:'clamp(22px,3.5vw,38px)', fontWeight:700,
                letterSpacing:'0.06em', color:'#E8EDF2', lineHeight:1,
              }}>Documentos</h1>
            </div>
          </div>
          <p style={{ fontSize:14, lineHeight:1.65, color:'#7A8FA6', maxWidth:520 }}>
            Gestión persistente de documentos institucionales. Los archivos se almacenan en el servidor.
            {!canUpload && ' Necesitas rol ADMIN o EDITOR para subir archivos.'}
          </p>
        </div>
      </section>

      {/* Layout principal */}
      <div style={{
        flex:1, display:'grid',
        gridTemplateColumns: preview.kind !== 'none' ? '1fr 1.6fr' : '1fr',
        gap:0, minHeight:0,
      }}>

        {/* Panel izquierdo */}
        <div style={{
          display:'flex', flexDirection:'column', gap:0,
          borderRight: preview.kind !== 'none' ? '1px solid rgba(255,255,255,0.06)' : 'none',
          overflow:'auto',
        }}>

          {/* Zona de carga — solo si tiene permiso */}
          {canUpload && (
            <div style={{ padding:'32px 32px 10px' }}>
              <div
                onClick={() => !uploading && inputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                style={{
                  border:`2px dashed ${dragging ? accentColor : 'rgba(255,255,255,0.12)'}`,
                  borderRadius:10, padding:'20px 0px', textAlign:'center',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  background: dragging ? `${accentColor}08` : 'rgba(255,255,255,0.02)',
                  transition:'all 200ms',
                  opacity: uploading ? 0.7 : 1,
                }}
              >
                <div style={{
                  width:40, height:40, borderRadius:'50%', margin:'0 auto 14px',
                  background:`${accentColor}18`, border:`1px solid ${accentColor}40`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:60,
                }}>
                  {uploading ? '⏳' : '📎'}
                </div>
                <p style={{ fontFamily:'Rajdhani, Arial Narrow, sans-serif', fontSize:16, fontWeight:600, color:'#E8EDF2', marginBottom:6 }}>
                  {uploading ? 'Subiendo al servidor...' : dragging ? 'Suelta aquí' : 'Arrastra archivos o haz clic'}
                </p>
                <p style={{ fontSize:12, color:'#4A6078', marginBottom:14 }}>
                  PDF · PPT · PPTX — máx. {MAX_MB} MB — se guardan en el servidor
                </p>
                <span style={{
                  display:'inline-block', padding:'7px 22px',
                  background:`${accentColor}15`, border:`1px solid ${accentColor}50`,
                  borderRadius:4, color:accentColor,
                  fontSize:12, fontWeight:600, letterSpacing:'0.1em',
                  fontFamily:'Rajdhani, Arial Narrow, sans-serif',
                  pointerEvents:'none',
                }}>
                  {uploading ? 'SUBIENDO...' : 'SELECCIONAR ARCHIVOS'}
                </span>
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED_EXT.join(',')}
                  style={{ display:'none' }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) addFile(f); e.target.value = '' }}
                />
              </div>

              {error   && <div style={{ marginTop:10, padding:'8px 14px', background:'rgba(204,43,43,0.08)', border:'1px solid rgba(204,43,43,0.2)', borderRadius:6, fontSize:12, color:'#e87878' }}>{error}</div>}
              {success && <div style={{ marginTop:10, padding:'8px 14px', background:'rgba(20,180,90,0.08)', border:'1px solid rgba(20,180,90,0.2)', borderRadius:6, fontSize:12, color:'#14B45A' }}>{success}</div>}
            </div>
          )}

          {/* Lista de archivos del servidor */}
          <div style={{ padding:'24px 32px 32px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <span style={{ fontSize:10, fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase', color:'#4A6078' }}>
                {loading ? 'Cargando...' : `${files.length} ${files.length === 1 ? 'archivo' : 'archivos'} en servidor`}
              </span>
              <button
                onClick={loadFiles}
                disabled={loading}
                style={{ background:'transparent', border:'none', color:'#1A7FBF', fontSize:11, cursor:'pointer', letterSpacing:'0.04em' }}
              >
                ↻ Actualizar
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign:'center', padding:'40px 0', color:'#4A6078', fontSize:13 }}>
                <span style={{ display:'block', fontSize:28, marginBottom:10 }}>⏳</span>
                Cargando documentos...
              </div>
            ) : files.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 0', color:'#2E4055', fontSize:13 }}>
                <span style={{ display:'block', fontSize:32, marginBottom:10, opacity:0.3 }}>📂</span>
                No hay archivos en el servidor aún
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {files.map((file) => (
                  <FileRow
                    key={file.id}
                    file={file}
                    accentColor={accentColor}
                    isActive={preview.kind !== 'none' && preview.file.id === file.id}
                    canDelete={isAdmin}
                    onPreview={() => openPreview(file)}
                    onDownload={() => handleDownload(file)}
                    onRemove={() => handleDelete(file)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho: vista previa */}
        {preview.kind !== 'none' && (
          <PreviewPanel
            preview={preview}
            accentColor={accentColor}
            onClose={() => setPreview({ kind:'none' })}
            onDownload={() => handleDownload(preview.file)}
          />
        )}
      </div>
    </main>
  )
}

// ─── FileRow ──────────────────────────────────────────────────

function FileRow({
  file, accentColor, isActive, canDelete, onPreview, onDownload, onRemove,
}: {
  file:        FileRecord
  accentColor: string
  isActive:    boolean
  canDelete:   boolean
  onPreview:   () => void
  onDownload:  () => void
  onRemove:    () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
        background: isActive ? `${accentColor}12` : hovered ? 'rgba(255,255,255,0.03)' : '#0D1B2A',
        border:`1px solid ${isActive ? `${accentColor}40` : hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius:8, transition:'all 150ms',
      }}
    >
      <span style={{ fontSize:22, flexShrink:0 }}>{fileIcon(file.mimeType)}</span>

      <div onClick={onPreview} style={{ flex:1, minWidth:0, cursor:'pointer' }}>
        <p style={{
          fontSize:13, fontWeight:500,
          color: isActive ? accentColor : '#E8EDF2',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:3,
        }}>
          {file.originalName}
        </p>
        <p style={{ fontSize:11, color:'#4A6078' }}>
          <span style={{
            background:`${accentColor}18`, border:`1px solid ${accentColor}30`,
            borderRadius:3, padding:'1px 6px', fontSize:10, color:accentColor,
            marginRight:6, fontWeight:600, letterSpacing:'0.06em',
          }}>{fileLabel(file.mimeType)}</span>
          {formatFileSize(file.size)} · {file.uploadedBy.name} · {new Date(file.createdAt).toLocaleDateString('es-CO')}
        </p>
      </div>

      <div style={{ display:'flex', gap:6, flexShrink:0 }}>
        <ActionBtn title="Vista previa" color="#1A7FBF" onClick={onPreview}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5S1 8 1 8Z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
          </svg>
        </ActionBtn>
        <ActionBtn title="Descargar" color="#14B45A" onClick={onDownload}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ActionBtn>
        {canDelete && (
          <ActionBtn title="Eliminar" color="#CC2B2B" onClick={onRemove}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10M6 4V3h4v1M5 4l1 9h4l1-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </ActionBtn>
        )}
      </div>
    </div>
  )
}

// ─── ActionBtn ────────────────────────────────────────────────

function ActionBtn({ children, title, color, onClick }: {
  children: React.ReactNode; title: string; color: string; onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title} onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:36, height:32, display:'flex', alignItems:'center', justifyContent:'center',
        background: hov ? `${color}18` : 'transparent',
        border:`1px solid ${hov ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
        borderRadius:4, color: hov ? color : '#4A6078',
        cursor:'pointer', transition:'all 150ms', flexShrink:0,
      }}
    >{children}</button>
  )
}

// ─── PreviewPanel ─────────────────────────────────────────────

function PreviewPanel({ preview, accentColor, onClose, onDownload }: {
  preview:     PreviewState
  accentColor: string
  onClose:     () => void
  onDownload:  () => void
}) {
  if (preview.kind === 'none') return null
  const { file } = preview

  // URL real del backend para el iframe
  const previewUrl = getFilePreviewUrl(file.storedName)

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', minHeight:500 }}>

      {/* Barra del preview */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
        padding:'14px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)',
        flexShrink:0, background:'#0A1420',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
          <span style={{ fontSize:20, flexShrink:0 }}>{fileIcon(file.mimeType)}</span>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:500, color:'#E8EDF2', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {file.originalName}
            </p>
            <p style={{ fontSize:11, color:'#4A6078' }}>
              {fileLabel(file.mimeType)} · {formatFileSize(file.size)} · almacenado en servidor
            </p>
          </div>
        </div>

        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
          <button
            onClick={onDownload}
            style={{
              display:'flex', alignItems:'center', gap:6, padding:'6px 14px',
              background:`${accentColor}15`, border:`1px solid ${accentColor}40`,
              borderRadius:4, color:accentColor,
              fontSize:12, letterSpacing:'0.06em', cursor:'pointer',
              fontFamily:'Rajdhani, Arial Narrow, sans-serif', fontWeight:600,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            DESCARGAR
          </button>
          <button
            onClick={onClose}
            style={{
              width:34, height:32, display:'flex', alignItems:'center', justifyContent:'center',
              background:'transparent', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:4, color:'#4A6078', cursor:'pointer',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Área de preview */}
      <div style={{ flex:1, overflow:'hidden', background:'#060C14', position:'relative' }}>

        {preview.kind === 'pdf' && (
          <iframe
            src={`${previewUrl}#toolbar=1&navpanes=1`}
            style={{ width:'100%', height:'100%', border:'none', display:'block' }}
            title={file.originalName}
          />
        )}

        {preview.kind === 'ppt' && (
          <div style={{
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', height:'100%', gap:20, padding:40, textAlign:'center',
          }}>
            <span style={{ fontSize:64, filter:`drop-shadow(0 0 20px ${accentColor}60)`, animation:'docFloat 3s ease-in-out infinite' }}>📊</span>
            <style>{`@keyframes docFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
            <div>
              <p style={{ fontFamily:'Rajdhani, Arial Narrow, sans-serif', fontSize:20, fontWeight:700, color:'#E8EDF2', letterSpacing:'0.06em', marginBottom:8 }}>
                {file.originalName}
              </p>
              <p style={{ fontSize:13, color:'#7A8FA6', lineHeight:1.65, maxWidth:360 }}>
                Los archivos PowerPoint no se pueden previsualizar en el navegador.
                Descárgalo para abrirlo con Microsoft PowerPoint o Google Slides.
              </p>
            </div>
            <button
              onClick={onDownload}
              style={{
                display:'flex', alignItems:'center', gap:8, padding:'10px 24px',
                background:`${accentColor}18`, border:`1px solid ${accentColor}50`,
                borderRadius:6, color:accentColor,
                fontFamily:'Rajdhani, Arial Narrow, sans-serif',
                fontSize:14, fontWeight:600, letterSpacing:'0.1em', cursor:'pointer',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Descargar {fileLabel(file.mimeType)}
            </button>

            {/* Metadata */}
            <div style={{
              display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 24px',
              padding:'16px 24px', background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, width:'100%', maxWidth:360,
            }}>
              {[
                { label:'Formato',    value: fileLabel(file.mimeType) },
                { label:'Tamaño',     value: formatFileSize(file.size) },
                { label:'Subido por', value: file.uploadedBy.name },
                { label:'Fecha',      value: new Date(file.createdAt).toLocaleDateString('es-CO') },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize:10, color:'#4A6078', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:3 }}>{item.label}</p>
                  <p style={{ fontSize:13, color:'#E8EDF2', fontWeight:500 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}