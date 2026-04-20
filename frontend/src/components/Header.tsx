// src/components/Header.tsx

import { useState, useEffect } from 'react'
import { Link, useLocation }   from 'react-router-dom'
import { useAuth }             from '@/features/auth/hooks/useAuth'

export default function Header() {
  const [time, setTime]           = useState(new Date())
  const location                  = useLocation()
  const isHome                    = location.pathname === '/'
  const { user, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const hh     = String(time.getHours()).padStart(2, '0')
  const mm     = String(time.getMinutes()).padStart(2, '0')
  const ss     = String(time.getSeconds()).padStart(2, '0')
  const dateStr = time.toLocaleDateString('es-CO', {
    weekday:'short', day:'2-digit', month:'short', year:'numeric',
  })

  return (
    <header style={{
      position:'sticky', top:0, zIndex:100,
      background:'rgba(6, 6, 20, 0.96)',
      backdropFilter:'blur(12px)',
      borderBottom:'1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        gap:24, padding:'0 32px', height:70,
      }}>

        {/* Identidad */}
        <div style={{ display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
          <img
            src="/icons/Logo-CGES.png"
            alt="Logo CGES"
            style={{ width:'auto', height:54, objectFit:'contain',
              filter:'drop-shadow(0 0 8px rgba(26,127,191,0.4))' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div>
            {!isHome && (
              <Link to="/" style={{
                display:'block', fontSize:11, color:'#1A7FBF',
                letterSpacing:'0.06em', marginBottom:2, opacity:0.85,
              }}>← Panel Principal</Link>
            )}
            <div style={{
              fontFamily:'Rajdhani, Arial Narrow, sans-serif',
              fontSize:22, fontWeight:700, letterSpacing:'0.12em',
              color:'#E8EDF2', lineHeight:1,
              textShadow:'0 0 20px rgba(26,127,191,0.3)',
            }}>CGES</div>
            <div style={{
              fontSize:10, color:'#4A6078', letterSpacing:'0.1em',
              textTransform:'uppercase', marginTop:2,
            }}>Centro de Gestión de Emergencias y Seguridad</div>
          </div>
        </div>

        {/* Status pills */}
        <div style={{ display:'flex', gap:10, flex:1, justifyContent:'center' }}>
          <StatusPill label="SISTEMA"  value="OPERATIVO" color="#14B45A" />
          <StatusPill label="REDES"    value="EN LÍNEA"  color="#14B45A" />
        </div>

        {/* Usuario + reloj */}
        <div style={{ display:'flex', alignItems:'center', gap:20, flexShrink:0 }}>

          {/* Info usuario */}
          {isAuthenticated && user && (
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:13, color:'#E8EDF2', fontWeight:500 }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize:10, color:'#4A6078',
                  letterSpacing:'0.06em', textTransform:'uppercase',
                }}>
                  {user.role}
                </div>
              </div>
              <button
                onClick={logout}
                style={{
                  height:32, padding:'0 12px',
                  background:'transparent',
                  border:'1px solid rgba(204,43,43,0.3)',
                  borderRadius:4, color:'#CC2B2B',
                  fontSize:11, letterSpacing:'0.06em',
                  cursor:'pointer', transition:'all 150ms', whiteSpace:'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(204,43,43,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Cerrar sesión
              </button>
            </div>
          )}

          {/* Reloj */}
          <div style={{ textAlign:'right' }}>
            <div style={{
              fontFamily:'Rajdhani, Arial Narrow, sans-serif',
              fontSize:24, fontWeight:600, letterSpacing:'0.08em',
              color:'#E8EDF2', lineHeight:1, fontVariantNumeric:'tabular-nums',
            }}>{hh}:{mm}:{ss}</div>
            <div style={{
              fontSize:11, color:'#4A6078', marginTop:3, textTransform:'capitalize',
            }}>{dateStr}</div>
          </div>
        </div>
      </div>

      {/* Accent bar */}
      <div style={{
        height:2,
        background:'linear-gradient(90deg, transparent 0%, #1A7FBF 30%, rgba(26,127,191,0.3) 50%, #1A7FBF 70%, transparent 100%)',
      }} />
    </header>
  )
}

function StatusPill({ label, value, color }: { label:string; value:string; color:string }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:7,
      padding:'5px 11px', borderRadius:4,
      border:`1px solid ${color}33`, background:`${color}10`,
      fontSize:11, letterSpacing:'0.05em',
    }}>
      <span style={{
        width:6, height:6, borderRadius:'50%',
        background:color, boxShadow:`0 0 5px ${color}`,
        animation:'hpulse 2s ease-in-out infinite', flexShrink:0,
      }} />
      <span style={{ color:'#4A6078', fontWeight:500 }}>{label}</span>
      <span style={{ color }}>{value}</span>
      <style>{`@keyframes hpulse{0%,100%{opacity:1}50%{opacity:.35}}`}</style>
    </div>
  )
}
