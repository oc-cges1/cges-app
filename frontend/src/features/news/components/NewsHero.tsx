// src/features/news/components/NewsHero.tsx

import { useState, useEffect } from 'react'
import type { NewsArticle }    from '../types'
import { CATEGORY_COLORS, timeAgo } from '../types'

export default function NewsHero({ articles }: { articles: NewsArticle[] }) {
  const [current, setCurrent] = useState(0)
  const hero = articles.slice(0, 5)

  useEffect(() => {
    if (hero.length < 2) return
    const t = setInterval(() => setCurrent(c => (c + 1) % hero.length), 6000)
    return () => clearInterval(t)
  }, [hero.length])

  if (!hero.length) return null
  const art      = hero[current]
  const catColor = CATEGORY_COLORS[art.category] ?? '#1A7FBF'

  return (
    <div style={{
      position:     'relative',
      height:       480,
      borderRadius: 12,
      overflow:     'hidden',
      marginBottom: 28,
      cursor:       'pointer',
    }}
      onClick={() => window.open(art.url, '_blank', 'noopener')}
    >
      {/* Imagen de fondo */}
      <img
        src={art.imageUrl || ''}
        alt={art.title}
        style={{
          width:'100%', height:'100%', objectFit:'cover',
          transition:'opacity 600ms ease',
        }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />

      {/* Gradiente */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(to top, rgba(6,12,20,0.97) 0%, rgba(6,12,20,0.5) 50%, rgba(6,12,20,0.15) 100%)',
      }} />

      {/* Contenido */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'32px 36px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          {art.isUrgent && (
            <span style={{
              background:'#CC2B2B', color:'#fff',
              fontSize:9, fontWeight:700, letterSpacing:'0.14em',
              padding:'3px 10px', borderRadius:3,
              fontFamily:'Rajdhani, Arial Narrow, sans-serif',
              animation:'urgentPulse 1.5s ease-in-out infinite',
            }}>● URGENTE</span>
          )}
          <span style={{
            fontSize:10, fontWeight:700, letterSpacing:'0.14em',
            color:catColor, background:`${catColor}25`,
            border:`1px solid ${catColor}50`,
            borderRadius:3, padding:'3px 10px',
            fontFamily:'Rajdhani, Arial Narrow, sans-serif',
            textTransform:'uppercase',
          }}>
            {art.category}
          </span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>
            {art.source} · {timeAgo(art.publishedAt)}
          </span>
        </div>

        <h1 style={{
          fontFamily:'Rajdhani, Arial Narrow, sans-serif',
          fontSize:'clamp(22px,3vw,36px)', fontWeight:700,
          color:'#ffffff', lineHeight:1.25,
          letterSpacing:'0.03em', marginBottom:12,
          maxWidth:700,
          textShadow:'0 2px 12px rgba(0,0,0,0.5)',
        }}>
          {art.title}
        </h1>

        {art.summary && (
          <p style={{
            fontSize:14, color:'rgba(255,255,255,0.7)',
            lineHeight:1.6, maxWidth:600,
            overflow:'hidden', display:'-webkit-box',
            WebkitLineClamp:2, WebkitBoxOrient:'vertical',
          }}>
            {art.summary}
          </p>
        )}

        {/* Indicadores */}
        <div style={{ display:'flex', gap:8, marginTop:20 }}>
          {hero.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
              style={{
                width:      i === current ? 28 : 8,
                height:     8,
                borderRadius:4,
                background: i === current ? catColor : 'rgba(255,255,255,0.3)',
                border:     'none',
                cursor:     'pointer',
                transition: 'all 300ms ease',
                padding:    0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Acento lateral */}
      <div style={{
        position:'absolute', left:0, top:0, bottom:0, width:3,
        background:`linear-gradient(to bottom, transparent, ${catColor}, transparent)`,
      }} />
    </div>
  )
}