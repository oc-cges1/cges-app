// src/pages/Dashboard.tsx

import { useState, useMemo } from 'react'
import ModuleCard            from '@/components/ModuleCard'
import { MODULES, CATEGORY_LABELS } from '@/data/modules'
import { Module }            from '@/types/modules'
import { BannerCarousel } from '@/components/BannerCarousel';

type Filter = Module['category'] | 'all'

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => MODULES.filter((m) => {
    const q          = search.toLowerCase()
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    const matchCat    = filter === 'all' || m.category === filter
    return matchSearch && matchCat
  }), [search, filter])

  const categories = useMemo(
    () => Array.from(new Set(MODULES.map((m) => m.category))) as Module['category'][],
    []
  )

  return (
    <main style={{ flex:1, display:'flex', flexDirection:'column' }}>

      {/* Hero */}
      <section style={{
        position:'relative', padding:'44px 32px 36px',
        borderBottom:'1px solid rgba(255,255,255,0.06)', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize:'40px 40px',
          maskImage:'radial-gradient(ellipse at 15% 50%, black 0%, transparent 55%)',
        }} />

        <div style={{
          position:'relative', zIndex:1,
          display:'flex', alignItems:'flex-end', justifyContent:'space-between',
          gap:32, flexWrap:'wrap',
        }}>
          <div>
            <span style={{
              display:'block', fontSize:10, fontWeight:500,
              letterSpacing:'0.22em', textTransform:'uppercase',
              color:'#1A7FBF', marginBottom:10,
            }}>Panel de Control</span>
            <h1 style={{
              fontFamily:'Rajdhani, Arial Narrow, sans-serif',
              fontSize:'clamp(28px,4vw,48px)', fontWeight:700,
              letterSpacing:'0.06em', color:'#989393', lineHeight:1, marginBottom:14,
            }}>CGES — Centro de Gestión de Emergencias y Seguridad</h1>
            <p style={{ fontSize:14, lineHeight:1.65, color:'#7A8FA6', maxWidth:460 }}>
              Acceso centralizado a todos los módulos operativos del departamento.
              Seleccione un módulo para ingresar.
            </p>
            <BannerCarousel />
          </div>

          <div style={{ display:'flex', gap:16 }}>
            {[
              { value:'14',    label:'Módulos'    },
              { value:'24/7',  label:'Monitoreo'  },
              { value:'98.4%', label:'Uptime'     },
            ].map((s) => (
              <div key={s.label} style={{
                textAlign:'center', padding:'14px 20px',
                border:'1px solid rgba(26,127,191,0.15)',
                borderRadius:8, background:'rgba(26,127,191,0.05)', minWidth:80,
              }}>
                <div style={{
                  fontFamily:'Rajdhani, Arial Narrow, sans-serif',
                  fontSize:26, fontWeight:700, letterSpacing:'0.04em',
                  color:'#1A7FBF', lineHeight:1,
                }}>{s.value}</div>
                <div style={{
                  fontSize:10, color:'#4A6078',
                  letterSpacing:'0.1em', textTransform:'uppercase', marginTop:5,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Controls */}
      <section style={{
        display:'flex', alignItems:'center', gap:14,
        padding:'16px 32px', borderBottom:'1px solid rgba(255,255,255,0.06)',
        flexWrap:'wrap',
      }}>
        <div style={{ position:'relative', flex:1, minWidth:180, maxWidth:320 }}>
          <svg style={{
            position:'absolute', left:11, top:'50%', transform:'translateY(-50%)',
            width:15, height:15, color:'#4A6078', pointerEvents:'none',
          }} viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search" placeholder="Buscar módulo..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{
              width:'100%', height:36, padding:'0 12px 0 34px',
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:4, color:'#05182a',
              fontFamily:'Inter, sans-serif', fontSize:13, outline:'none',
            }}
          />
        </div>

        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {(['all', ...categories] as Filter[]).map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              height:34, padding:'0 14px',
              background: filter === cat ? 'rgba(26,127,191,0.1)' : 'transparent',
              border:`1px solid ${filter === cat ? 'rgba(26,127,191,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius:4,
              color: filter === cat ? '#1A7FBF' : '#4A6078',
              fontFamily:'Inter, sans-serif', fontSize:12, fontWeight:500,
              letterSpacing:'0.04em', cursor:'pointer', whiteSpace:'nowrap',
              transition:'all 150ms',
            }}>
              {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section style={{ flex:1, padding:'28px 32px 48px' }}>
        {filtered.length > 0 ? (
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(210px, 1fr))',
            gap:14,
          }}>
            {filtered.map((mod, i) => (
              <ModuleCard key={mod.id} module={mod} index={i} />
            ))}
          </div>
        ) : (
          <div style={{
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:16, padding:'80px 32px', textAlign:'center',
          }}>
            <p style={{ fontSize:15, color:'#7A8FA6' }}>
              No se encontraron módulos para "{search}"
            </p>
            <button
              onClick={() => { setSearch(''); setFilter('all') }}
              style={{
                height:36, padding:'0 20px',
                background:'rgba(26,127,191,0.1)',
                border:'1px solid rgba(26,127,191,0.3)',
                borderRadius:4, color:'#1A7FBF',
                fontFamily:'Inter, sans-serif', fontSize:13, cursor:'pointer',
              }}
            >Limpiar filtros</button>
          </div>
          
        )}
      </section>
    </main>
  )
}
