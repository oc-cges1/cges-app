// src/pages/ModulePlaceholder.tsx

import { useNavigate }   from 'react-router-dom'
import { MODULES }       from '@/data/modules'
import { findSubModule } from '@/data/submodules'

interface Props { moduleId: string }

export default function ModulePlaceholder({ moduleId }: Props) {
  const navigate = useNavigate()
  const mod      = MODULES.find((m) => m.id === moduleId) ?? findSubModule(moduleId)

  if (!mod) {
    return (
      <div style={{ padding:80, textAlign:'center', color:'#7A8FA6' }}>
        <p>Módulo no encontrado.</p>
        <button onClick={() => navigate('/')}
          style={{ marginTop:16, padding:'8px 20px', cursor:'pointer' }}>
          Volver
        </button>
      </div>
    )
  }

  return (
    <div style={{
      minHeight:'calc(100vh - 72px)', display:'flex', alignItems:'center',
      justifyContent:'center', padding:40, position:'relative',
    }}>
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:2,
        background:mod.accentColor,
      }} />
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize:'40px 40px',
        maskImage:'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
      }} />

      <div style={{
        position:'relative', zIndex:1, textAlign:'center', maxWidth:480,
        display:'flex', flexDirection:'column', alignItems:'center', gap:22,
      }}>
        {/* Icon */}
        <div style={{
          position:'relative', width:120, height:120,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {mod.image ? (
            <img src={mod.image} alt={mod.name} style={{
              width:80, height:80, objectFit:'contain',
              filter:`drop-shadow(0 0 24px ${mod.accentColor})`,
            }} />
          ) : (
            <span style={{
              fontSize:64, lineHeight:1, position:'relative', zIndex:1,
              filter:`drop-shadow(0 0 24px ${mod.accentColor})`,
            }}>{mod.icon}</span>
          )}
          <div style={{
            position:'absolute', inset:0, borderRadius:'50%',
            border:`1px solid ${mod.accentColor}40`,
          }} />
          <div style={{
            position:'absolute', inset:14, borderRadius:'50%',
            border:`1px solid ${mod.accentColor}20`,
          }} />
        </div>

        {/* Title */}
        <div>
          <h1 style={{
            fontFamily:'Rajdhani, Arial Narrow, sans-serif',
            fontSize:34, fontWeight:700, letterSpacing:'0.06em',
            color:'#E8EDF2', marginBottom:8,
          }}>{mod.name}</h1>
          <p style={{ fontSize:14, color:'#7A8FA6' }}>{mod.description}</p>
        </div>

        {/* Status badge */}
        <div style={{
          display:'flex', alignItems:'center', gap:9,
          padding:'8px 18px', borderRadius:4,
          border:`1px solid ${mod.accentColor}40`,
          background:`${mod.accentColor}12`,
          color:mod.accentColor, fontSize:12, letterSpacing:'0.08em',
        }}>
          <span style={{
            width:8, height:8, borderRadius:'50%', background:mod.accentColor,
            animation:'mpp 2s infinite', flexShrink:0,
          }} />
          Módulo en desarrollo
          <style>{`@keyframes mpp{0%,100%{opacity:1}50%{opacity:.25}}`}</style>
        </div>

        {/* Info cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, width:'100%' }}>
          {[
            { label:'Estado',    value:'Próximamente' },
            { label:'Categoría', value:mod.category   },
            { label:'Ruta',      value:mod.path        },
          ].map((item) => (
            <div key={item.label} style={{
              padding:'14px 12px', background:'#0A1420',
              border:'1px solid rgba(255,255,255,0.06)',
              borderRadius:8, display:'flex', flexDirection:'column', gap:5,
            }}>
              <span style={{
                fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'#4A6078',
              }}>{item.label}</span>
              <span style={{
                fontSize:12, color:'#7A8FA6',
                fontFamily: item.label === 'Ruta' ? 'monospace' : 'inherit',
              }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            height:40, padding:'0 28px', background:'transparent',
            border:`1px solid ${mod.accentColor}45`,
            borderRadius:4, color:mod.accentColor,
            fontFamily:'Inter, sans-serif', fontSize:13,
            cursor:'pointer', transition:'background 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = `${mod.accentColor}12`)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ← Volver al Panel Principal
        </button>
      </div>
    </div>
  )
}
