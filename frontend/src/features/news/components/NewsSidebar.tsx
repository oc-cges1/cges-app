// src/features/news/components/NewsSidebar.tsx

import { useState }         from 'react'
import type { NewsArticle, Category } from '../types'
import { CATEGORY_COLORS, timeAgo }   from '../types'
import NewsCard from './NewsCard'

interface Props {
  ultima:      NewsArticle[]
  categories:  Category[]
  onCategory:  (c: string) => void
}

export default function NewsSidebar({ ultima, categories, onCategory }: Props) {
  const [tab, setTab] = useState<'ultima' | 'categorias'>('ultima')

  return (
    <aside style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Tabs */}
      <div style={{
        display:'flex', background:'#0A1420',
        border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:3,
      }}>
        {(['ultima','categorias'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex:1, height:32,
              background:   tab === t ? 'rgba(26,127,191,0.15)' : 'transparent',
              border:       `1px solid ${tab === t ? 'rgba(26,127,191,0.3)' : 'transparent'}`,
              borderRadius: 6,
              color:        tab === t ? '#1A7FBF' : '#4A6078',
              fontFamily:   'Rajdhani, Arial Narrow, sans-serif',
              fontSize:     11, fontWeight:600, letterSpacing:'0.08em',
              cursor:       'pointer', transition:'all 150ms',
              textTransform:'uppercase',
            }}
          >
            {t === 'ultima' ? 'Recientes' : 'Categorías'}
          </button>
        ))}
      </div>

      {tab === 'ultima' && (
        <div style={{
          background:'#0D1B2A',
          border:'1px solid rgba(255,255,255,0.06)',
          borderRadius:10, padding:'12px 16px',
        }}>
          <h3 style={{
            fontFamily:'Rajdhani, Arial Narrow, sans-serif',
            fontSize:13, fontWeight:700, letterSpacing:'0.12em',
            color:'#7A8FA6', textTransform:'uppercase', marginBottom:8,
          }}>Últimas noticias</h3>
          {ultima.map((art) => (
            <NewsCard key={art.id} article={art} compact />
          ))}
        </div>
      )}

      {tab === 'categorias' && (
        <div style={{
          background:'#0D1B2A',
          border:'1px solid rgba(255,255,255,0.06)',
          borderRadius:10, padding:'12px 16px',
        }}>
          <h3 style={{
            fontFamily:'Rajdhani, Arial Narrow, sans-serif',
            fontSize:13, fontWeight:700, letterSpacing:'0.12em',
            color:'#7A8FA6', textTransform:'uppercase', marginBottom:12,
          }}>Categorías</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {categories.map((cat) => {
              const color = CATEGORY_COLORS[cat.name] ?? '#4A6078'
              return (
                <button
                  key={cat.name}
                  onClick={() => onCategory(cat.name)}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'8px 12px', background:'rgba(255,255,255,0.02)',
                    border:`1px solid rgba(255,255,255,0.06)`,
                    borderRadius:6, cursor:'pointer', transition:'all 150ms',
                    textDecoration:'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.borderColor = `${color}30` }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:color, flexShrink:0 }} />
                    <span style={{ fontSize:12, color:'#E8EDF2', fontFamily:'Inter, sans-serif' }}>
                      {cat.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize:10, color:color,
                    background:`${color}18`, border:`1px solid ${color}30`,
                    borderRadius:10, padding:'1px 8px',
                  }}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </aside>
  )
}