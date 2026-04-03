// src/pages/SubModulePage.tsx

import { useState }           from 'react'
import { useNavigate }        from 'react-router-dom'
import { getSubModules, getModuleMeta } from '@/data/submodules'
import { SubModule, STATUS_LABEL, STATUS_COLOR } from '@/types/submodules'

interface Props { moduleId: string }

export default function SubModulePage({ moduleId }: Props) {
  const navigate = useNavigate()
  const meta     = getModuleMeta(moduleId)
  const children = getSubModules(moduleId)

  if (!meta) {
    return (
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        height:'calc(100vh - 72px)', color:'#7A8FA6',
        fontFamily:'Inter, sans-serif', fontSize:14,
      }}>
        Módulo no encontrado.
      </div>
    )
  }

  return (
    <main style={{ flex:1, display:'flex', flexDirection:'column' }}>

      {/* Hero */}
      <section style={{
        position:'relative', padding:'44px 32px 36px',
        borderBottom:'1px solid rgba(255,255,255,0.06)', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize:'40px 40px',
          maskImage:'radial-gradient(ellipse at 15% 50%, black 0%, transparent 55%)',
          pointerEvents:'none',
        }} />
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg, transparent 0%, ${meta.accentColor} 30%, ${meta.accentColor}50 60%, transparent 100%)`,
        }} />

        <div style={{ position:'relative', zIndex:1 }}>
          {/* Breadcrumb */}
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            marginBottom:18, fontSize:12, color:'#4A6078', letterSpacing:'0.04em',
          }}>
            <span onClick={() => navigate(meta.parentPath)}
              style={{ color:meta.accentColor, cursor:'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >{meta.parentName}</span>
            <span style={{ color:'#2E4055' }}>/</span>
            <span style={{ color:'#7A8FA6' }}>{meta.name}</span>
          </div>

          {/* Título */}
          <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:14 }}>
            {meta.image ? (
              <img src={meta.image} alt={meta.name} style={{
                height:56, width:'auto', objectFit:'contain',
                filter:`drop-shadow(0 0 10px ${meta.accentColor}80)`,
              }} />
            ) : (
              <span style={{
                fontSize:44, lineHeight:1,
                filter:`drop-shadow(0 0 10px ${meta.accentColor})`,
              }}>{meta.icon}</span>
            )}
            <div>
              <span style={{
                display:'block', fontSize:10, fontWeight:500,
                letterSpacing:'0.22em', textTransform:'uppercase',
                color:meta.accentColor, marginBottom:6,
              }}>Módulo</span>
              <h1 style={{
                fontFamily:'Rajdhani, Arial Narrow, sans-serif',
                fontSize:'clamp(24px, 3.5vw, 40px)', fontWeight:700,
                letterSpacing:'0.06em', color:'#E8EDF2', lineHeight:1,
              }}>{meta.name}</h1>
            </div>
          </div>

          <p style={{ fontSize:14, lineHeight:1.65, color:'#7A8FA6', maxWidth:520 }}>
            {meta.description} Seleccione una sección para continuar.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ flex:1, padding:'36px 32px 48px' }}>
        <div style={{
          fontSize:10, fontWeight:500, letterSpacing:'0.18em',
          textTransform:'uppercase', color:'#4A6078', marginBottom:20,
        }}>
          {children.length} {children.length === 1 ? 'sección disponible' : 'secciones disponibles'}
        </div>

        {children.length > 0 ? (
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
            gap:16, maxWidth:900,
          }}>
            {children.map((mod, i) => (
              <SubCard key={mod.id} mod={mod} index={i} onNavigate={navigate} />
            ))}
          </div>
        ) : (
          <div style={{
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:12, padding:'80px 32px', textAlign:'center',
          }}>
            <span style={{ fontSize:40, opacity:0.25 }}>{meta.icon}</span>
            <p style={{ fontSize:14, color:'#4A6078' }}>
              Este módulo no tiene secciones registradas aún.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

function SubCard({
  mod, index, onNavigate,
}: { mod:SubModule; index:number; onNavigate:(path:string)=>void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      role="button" tabIndex={0}
      aria-label={`Abrir ${mod.name}`}
      onClick={() => onNavigate(mod.path)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate(mod.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:'relative',
        background: hovered
          ? `linear-gradient(160deg, ${mod.color} 0%, #0D1B2A 100%)`
          : '#0D1B2A',
        border:`1px solid ${hovered ? mod.accentColor : 'rgba(255,255,255,0.07)'}`,
        borderRadius:10, cursor:'pointer', overflow:'hidden', outline:'none',
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${mod.accentColor}22, 0 0 30px ${mod.accentColor}14`
          : '0 2px 8px rgba(0,0,0,0.3)',
        transition:'all 220ms cubic-bezier(0.4,0,0.2,1)',
        userSelect:'none', animation:`scIn 350ms ${index * 80}ms both`,
      }}
    >
      <style>{`@keyframes scIn{from{opacity:0;transform:translateY(14px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>

      <div style={{
        position:'absolute', inset:0,
        background:`radial-gradient(ellipse at 50% 110%, ${mod.accentColor}18 0%, transparent 65%)`,
        opacity: hovered ? 1 : 0, transition:'opacity 220ms', pointerEvents:'none',
      }} />

      <div style={{
        display:'flex', alignItems:'center', gap:18, padding:'24px 20px',
        position:'relative', zIndex:1,
      }}>
        <div style={{
          width:60, height:60, borderRadius:'50%',
          border:`1px solid ${mod.accentColor}${hovered ? '80' : '25'}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          flexShrink:0, background:`${mod.accentColor}0a`,
          overflow:'hidden', transition:'border-color 220ms',
        }}>
          {mod.image ? (
            <img src={mod.image} alt={mod.name} style={{
              width:40, height:40, objectFit:'contain',
              filter:`drop-shadow(0 0 ${hovered ? '8px' : '4px'} ${mod.accentColor})`,
              transform: hovered ? 'scale(1.1)' : 'scale(1)', transition:'all 220ms',
            }} />
          ) : (
            <span style={{
              fontSize:28, lineHeight:1,
              filter:`drop-shadow(0 0 ${hovered ? '12px' : '5px'} ${mod.accentColor})`,
              transform: hovered ? 'scale(1.12)' : 'scale(1)', transition:'all 220ms',
            }}>{mod.icon}</span>
          )}
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <h2 style={{
            fontFamily:'Rajdhani, Arial Narrow, sans-serif',
            fontSize:18, fontWeight:600, letterSpacing:'0.04em',
            color: hovered ? '#ffffff' : '#E8EDF2',
            lineHeight:1.2, marginBottom:4, transition:'color 150ms',
          }}>{mod.name}</h2>
          <p style={{
            fontSize:12, color: hovered ? '#7A8FA6' : '#4A6078',
            lineHeight:1.5, marginBottom:8, transition:'color 150ms',
          }}>{mod.description}</p>
          <span style={{
            display:'inline-flex', alignItems:'center', gap:5,
            fontSize:10, fontWeight:500, letterSpacing:'0.08em',
            color:STATUS_COLOR[mod.status],
            background:`${STATUS_COLOR[mod.status]}15`,
            border:`1px solid ${STATUS_COLOR[mod.status]}30`,
            borderRadius:3, padding:'2px 8px',
          }}>
            <span style={{
              width:5, height:5, borderRadius:'50%',
              background:STATUS_COLOR[mod.status], flexShrink:0,
            }} />
            {STATUS_LABEL[mod.status]}
          </span>
        </div>

        <div style={{
          width:28, height:28, borderRadius:'50%',
          border:`1px solid ${hovered ? mod.accentColor : 'rgba(255,255,255,0.08)'}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          color: hovered ? mod.accentColor : '#4A6078',
          background: hovered ? `${mod.accentColor}18` : 'transparent',
          flexShrink:0, transform: hovered ? 'translateX(2px)' : 'none',
          transition:'all 220ms',
        }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:2,
        background:mod.accentColor,
        transform:`scaleX(${hovered ? 1 : 0})`, transformOrigin:'left',
        transition:'transform 250ms cubic-bezier(0.4,0,0.2,1)',
      }} />
    </article>
  )
}
