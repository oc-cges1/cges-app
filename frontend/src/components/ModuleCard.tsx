// src/components/ModuleCard.tsx

import { useState }      from 'react'
import { useNavigate }   from 'react-router-dom'
import { Module }        from '@/types/modules'

interface Props {
  module: Module
  index:  number
}

export default function ModuleCard({ module, index }: Props) {
  const navigate  = useNavigate()
  const [hovered, setHovered] = useState(false)
  const delay     = `${index * 55}ms`

  return (
    <article
      role="button" tabIndex={0}
      aria-label={`Acceder a ${module.name}`}
      onClick={() => navigate(module.path)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(module.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        position:'relative',
        background: hovered
          ? `linear-gradient(160deg, ${module.color} 0%, #0D1B2A 100%)`
          : '#0D1B2A',
        border:`1px solid ${hovered ? module.accentColor : 'rgba(255,255,255,0.06)'}`,
        borderRadius:10, cursor:'pointer', overflow:'hidden', outline:'none',
        transform: hovered ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${module.accentColor}22, 0 0 30px ${module.accentColor}18`
          : '0 2px 8px rgba(0,0,0,0.3)',
        transition:'transform 220ms cubic-bezier(0.4,0,0.2,1), box-shadow 220ms, border-color 220ms, background 220ms',
        animation:`cardIn 350ms ${delay} both`,
        userSelect:'none',
      }}
    >
      <style>{`
        @keyframes cardIn {
          from { opacity:0; transform:translateY(14px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>

      {/* Glow */}
      <div style={{
        position:'absolute', inset:0,
        background:`radial-gradient(ellipse at 50% 110%, ${module.accentColor}1a 0%, transparent 65%)`,
        opacity: hovered ? 1 : 0, transition:'opacity 220ms', pointerEvents:'none',
      }} />

      {/* Corner brackets */}
      {hovered && (
        <>
          <Corner pos="tl" color={module.accentColor} />
          <Corner pos="tr" color={module.accentColor} />
          <Corner pos="bl" color={module.accentColor} />
          <Corner pos="br" color={module.accentColor} />
        </>
      )}

      {/* Content */}
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center',
        gap:14, padding:'58px 18px 22px', position:'relative', zIndex:1,
      }}>
        {/* Icon or image */}
        <div style={{
          position:'relative', width:80, height:80,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {module.image ? (
            <img
              src={module.image}
              alt={module.name}
              style={{
                width:150, height:150, objectFit:'contain',
                position:'relative', zIndex:1,
                filter: hovered
                  ? `drop-shadow(0 0 14px ${module.accentColor})`
                  : `drop-shadow(0 0 6px ${module.accentColor}80)`,
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
                transition:'transform 220ms, filter 220ms',
              }}
            />
          ) : (
            <span style={{
              fontSize:44, lineHeight:1, display:'block',
              position:'relative', zIndex:1,
              filter:`drop-shadow(0 0 ${hovered ? '18px' : '8px'} ${module.accentColor})`,
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
              transition:'transform 220ms, filter 220ms',
            }}>
              {module.icon}
            </span>
          )}
          <div style={{
            position:'absolute', inset:0, borderRadius:'50%',
            border:`1px solid ${module.accentColor}`,
            opacity: hovered ? 0.5 : 0.15,
            transform: hovered ? 'scale(1.15)' : 'scale(1)',
            transition:'opacity 220ms, transform 220ms',
          }} />
        </div>

        {/* Text */}
        <div style={{ textAlign:'center' }}>
          <h2 style={{
            fontFamily:'Rajdhani, Arial Narrow, sans-serif',
            fontSize:16, fontWeight:600, letterSpacing:'0.04em',
            color: hovered ? '#ffffff' : '#E8EDF2',
            lineHeight:1.25, marginBottom:6, transition:'color 150ms',
          }}>{module.name}</h2>
          <p style={{
            fontSize:12,
            color: hovered ? '#7A8FA6' : '#4A6078',
            letterSpacing:'0.02em', transition:'color 150ms',
          }}>{module.description}</p>
        </div>

        {/* Arrow */}
        <div style={{
          width:28, height:28, borderRadius:'50%',
          border:`1px solid ${hovered ? module.accentColor : 'rgba(255,255,255,0.08)'}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          color: hovered ? module.accentColor : '#4A6078',
          background: hovered ? `${module.accentColor}18` : 'transparent',
          transform: hovered ? 'translateX(2px)' : 'none',
          transition:'all 220ms',
        }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Bottom accent */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:2,
        background:module.accentColor,
        transform:`scaleX(${hovered ? 1 : 0})`,
        transformOrigin:'left',
        transition:'transform 250ms cubic-bezier(0.4,0,0.2,1)',
      }} />
    </article>
  )
}

function Corner({ pos, color }: { pos:'tl'|'tr'|'bl'|'br'; color:string }) {
  const s: React.CSSProperties = {
    position:'absolute', width:11, height:11,
    borderColor:color, borderStyle:'solid', opacity:0.9,
  }
  if (pos === 'tl') { s.top=7; s.left=7;   s.borderWidth='1.5px 0 0 1.5px' }
  if (pos === 'tr') { s.top=7; s.right=7;  s.borderWidth='1.5px 1.5px 0 0' }
  if (pos === 'bl') { s.bottom=7; s.left=7;  s.borderWidth='0 0 1.5px 1.5px' }
  if (pos === 'br') { s.bottom=7; s.right=7; s.borderWidth='0 1.5px 1.5px 0' }
  return <span style={s} />
}
