// src/features/documents/components/AiChat.tsx

import { useState, useRef, useEffect } from 'react'
import { askAI }                       from '../api'
import type { ChatMessage, FileRecord } from '../types'

interface Props {
  selectedFile?: FileRecord | null
}

export default function AiChat({ selectedFile }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Limpiar chat al cambiar de documento
  useEffect(() => {
    setMessages([])
  }, [selectedFile?.id])

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return
    setInput('')

    const userMsg: ChatMessage = {
      id: Date.now().toString(), role: 'user', content: q, ts: Date.now()
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const answer = await askAI(q, selectedFile?.id, messages)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'assistant', content: answer, ts: Date.now()
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: 'err', role: 'assistant',
        content: 'Error al consultar la IA. Intente nuevamente.',
        ts: Date.now(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100%',
      minHeight:     460,
      background:    '#0A1420',
      borderRadius:  10,
      border:        '1px solid rgba(255,255,255,0.06)',
      overflow:      'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding:      '14px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display:      'flex',
        alignItems:   'center',
        gap:          10,
        flexShrink:   0,
      }}>
        <span style={{ fontSize: 18 }}>🤖</span>
        <div>
          <p style={{
            fontFamily: 'Rajdhani, Arial Narrow, sans-serif',
            fontSize: 15, fontWeight: 600, color: '#E8EDF2', lineHeight: 1,
          }}>
            Asistente IA
          </p>
          {selectedFile ? (
            <p style={{ fontSize: 11, color: '#1A7FBF', marginTop: 2 }}>
              Consultando: {selectedFile.originalName}
            </p>
          ) : (
            <p style={{ fontSize: 11, color: '#4A6078', marginTop: 2 }}>
              Modo libre — selecciona un documento para consultar su contenido
            </p>
          )}
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            style={{
              marginLeft:   'auto',
              background:   'transparent',
              border:       '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              color:        '#4A6078',
              fontSize:     11,
              padding:      '3px 10px',
              cursor:       'pointer',
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Mensajes */}
      <div style={{
        flex:       1,
        overflowY:  'auto',
        padding:    '16px 18px',
        display:    'flex',
        flexDirection: 'column',
        gap:        12,
      }}>
        {messages.length === 0 && (
          <div style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            height:         '100%',
            gap:            8,
            opacity:        0.4,
          }}>
            <span style={{ fontSize: 36 }}>💬</span>
            <p style={{ fontSize: 13, color: '#7A8FA6', textAlign: 'center' }}>
              {selectedFile
                ? `Haz una pregunta sobre "${selectedFile.originalName}"`
                : 'Escribe una pregunta para comenzar'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf:    msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth:     '82%',
              padding:      '10px 14px',
              borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              background:   msg.role === 'user'
                ? 'rgba(26,127,191,0.2)'
                : 'rgba(255,255,255,0.05)',
              border:       `1px solid ${msg.role === 'user'
                ? 'rgba(26,127,191,0.3)'
                : 'rgba(255,255,255,0.06)'}`,
              fontSize:     13,
              color:        '#E8EDF2',
              lineHeight:   1.6,
              whiteSpace:   'pre-wrap',
              wordBreak:    'break-word',
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{
            alignSelf: 'flex-start', padding: '10px 14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px 12px 12px 4px',
            display: 'flex', gap: 6, alignItems: 'center',
          }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#1A7FBF',
                animation: `dotBounce 1s ease-in-out ${i * 0.2}s infinite`,
                display: 'inline-block',
              }} />
            ))}
            <style>{`@keyframes dotBounce{0%,100%{opacity:.2;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}`}</style>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding:      '12px 14px',
        borderTop:    '1px solid rgba(255,255,255,0.06)',
        display:      'flex',
        gap:          8,
        flexShrink:   0,
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder={selectedFile ? 'Pregunta sobre el documento...' : 'Escribe tu pregunta...'}
          disabled={loading}
          style={{
            flex:         1,
            height:       40,
            padding:      '0 14px',
            background:   'rgba(255,255,255,0.04)',
            border:       '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            color:        '#E8EDF2',
            fontSize:     13,
            outline:      'none',
            fontFamily:   'Inter, sans-serif',
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            width:        40,
            height:       40,
            background:   input.trim() ? '#1A7FBF' : 'rgba(26,127,191,0.2)',
            border:       'none',
            borderRadius: 6,
            cursor:       input.trim() ? 'pointer' : 'not-allowed',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            flexShrink:   0,
            transition:   'background 150ms',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M10 4l4 4-4 4" stroke="white" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}