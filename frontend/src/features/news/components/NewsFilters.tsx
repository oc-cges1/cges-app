// src/features/news/components/NewsFilters.tsx

import { useState }         from 'react'
import type { Category }    from '../types'
import { CATEGORY_COLORS }  from '../types'

interface Props {
  categories:      Category[]
  activeCategory:  string
  search:          string
  total:           number
  onCategory:      (c: string) => void
  onSearch:        (q: string) => void
  onRefresh:       () => void
}

export default function NewsFilters({
  categories, activeCategory, search, total, onCategory, onSearch, onRefresh,
}: Props) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try { await onRefresh() } finally { setTimeout(() => setRefreshing(false), 2000) }
  }

  const allCats = [{ name:'Todas', count: total }, ...categories]

  return (
    <div style={{ marginBottom:24 }}>

      {/* Búsqueda + Refresh */}
      <div style={{ display:'flex', gap:12, marginBottom:14, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <svg style={{
            position:'absolute', left:11, top:'50%', transform:'translateY(-50%)',
            width:15, height:15, color:'#4A6078', pointerEvents:'none',
          }} viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="search"
            placeholder="Buscar noticias..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              width:'100%', height:38, padding:'0 12px 0 34px',
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:6, color:'#E8EDF2',
              fontFamily:'Inter, sans-serif', fontSize:13, outline:'none',
              boxSizing:'border-box',
            }}
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            height:38, padding:'0 16px',
            background:'rgba(26,127,191,0.1)',
            border:'1px solid rgba(26,127,191,0.3)',
            borderRadius:6, color:'#1A7FBF',
            fontFamily:'Rajdhani, Arial Narrow, sans-serif',
            fontSize:12, letterSpacing:'0.1em',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            display:'flex', alignItems:'center', gap:6,
            transition:'all 150ms',
          }}
        >
          <span style={{ display:'inline-block', animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>↻</span>
          {refreshing ? 'Actualizando...' : 'Actualizar'}
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </button>
      </div>

      {/* Filtros de categoría */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {allCats.map((cat) => {
          const isActive = activeCategory === cat.name || (cat.name === 'Todas' && activeCategory === 'Todas')
          const color    = CATEGORY_COLORS[cat.name] ?? '#1A7FBF'
          return (
            <button
              key={cat.name}
              onClick={() => onCategory(cat.name)}
              style={{
                height:30, padding:'0 12px',
                background:   isActive ? `${color}18` : 'transparent',
                border:       `1px solid ${isActive ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 4,
                color:        isActive ? color : '#4A6078',
                fontFamily:   'Inter, sans-serif',
                fontSize:     11, fontWeight: isActive ? 600 : 400,
                cursor:       'pointer',
                transition:   'all 150ms',
                whiteSpace:   'nowrap',
              }}
            >
              {cat.name}
              {cat.count > 0 && (
                <span style={{ marginLeft:5, opacity:0.6, fontSize:10 }}>
                  {cat.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}