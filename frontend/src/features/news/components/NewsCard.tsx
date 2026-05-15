// src/features/news/components/NewsCard.tsx

import { useState } from 'react'
import type { NewsArticle } from '../types'
import { CATEGORY_COLORS, timeAgo } from '../types'

interface Props {
  article:  NewsArticle
  featured?: boolean
  compact?:  boolean
}

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%230A1420'/%3E%3Ctext x='200' y='105' font-family='Arial' font-size='14' fill='%234A6078' text-anchor='middle'%3ESin imagen%3C/text%3E%3C/svg%3E"

export default function NewsCard({ article, featured = false, compact = false }: Props) {
  const [hovered,  setHovered]  = useState(false)
  const [imgError, setImgError] = useState(false)
  const catColor = CATEGORY_COLORS[article.category] ?? '#4A6078'

  if (compact) {
    return (
        <a      
        href={article.url} target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display:       'flex',
          gap:           10,
          padding:       '10px 0',
          borderBottom:  '1px solid rgba(255,255,255,0.05)',
          textDecoration:'none',
          cursor:        'pointer',
          transition:    'all 150ms',
        }}
      >
        <div style={{
          width:60, height:52, borderRadius:6, overflow:'hidden',
          flexShrink:0, background:'#0A1420',
        }}>
          <img
            src={!imgError && article.imageUrl ? article.imageUrl : FALLBACK_IMG}
            alt={article.title}
            loading="lazy"
            onError={() => setImgError(true)}
            style={{ width:'100%', height:'100%', objectFit:'cover' }}
          />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{
            fontSize:12, fontWeight:500,
            color: hovered ? '#E8EDF2' : '#B0BEC5',
            lineHeight:1.4,
            overflow:'hidden', display:'-webkit-box',
            WebkitLineClamp:2, WebkitBoxOrient:'vertical',
            marginBottom:4, transition:'color 150ms',
          }}>
            {article.title}
          </p>
          <p style={{ fontSize:10, color:'#4A6078' }}>
            {timeAgo(article.publishedAt)}
          </p>
        </div>
      </a>
    )
  }

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   '#0D1B2A',
        border:       `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 10,
        overflow:     'hidden',
        display:      'flex',
        flexDirection:'column',
        transform:    hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:    hovered ? '0 12px 32px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
        transition:   'all 220ms cubic-bezier(0.4,0,0.2,1)',
        position:     'relative',
      }}
    >
      {/* Badge URGENTE */}
      {article.isUrgent && (
        <div style={{
          position:'absolute', top:10, left:10, zIndex:2,
          background:'#CC2B2B', color:'#fff',
          fontSize:9, fontWeight:700, letterSpacing:'0.14em',
          padding:'3px 8px', borderRadius:3,
          animation:'urgentPulse 1.5s ease-in-out infinite',
          fontFamily:'Rajdhani, Arial Narrow, sans-serif',
        }}>
          ● URGENTE
          <style>{`@keyframes urgentPulse{0%,100%{opacity:1}50%{opacity:0.7}}`}</style>
        </div>
      )}

      {/* Imagen */}
      <div style={{
        height:     featured ? 220 : 170,
        overflow:   'hidden',
        flexShrink: 0,
        background: '#0A1420',
        position:   'relative',
      }}>
        <img
          src={!imgError && article.imageUrl ? article.imageUrl : FALLBACK_IMG}
          alt={article.title}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            width:'100%', height:'100%', objectFit:'cover',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition:'transform 400ms ease',
          }}
        />
        {/* Gradiente inferior */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:60,
          background:'linear-gradient(transparent, rgba(13,27,42,0.9))',
          pointerEvents:'none',
        }} />
      </div>

      {/* Contenido */}
      <div style={{ padding:'14px 16px 16px', flex:1, display:'flex', flexDirection:'column', gap:8 }}>

        {/* Categoría + Fuente */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
          <span style={{
            fontSize:9, fontWeight:700, letterSpacing:'0.12em',
            color:catColor, background:`${catColor}18`,
            border:`1px solid ${catColor}35`,
            borderRadius:3, padding:'2px 8px',
            fontFamily:'Rajdhani, Arial Narrow, sans-serif',
            textTransform:'uppercase', whiteSpace:'nowrap',
          }}>
            {article.category}
          </span>
          <span style={{ fontSize:10, color:'#4A6078', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {article.source}
          </span>
        </div>

        {/* Título */}
        <h2 style={{
          fontFamily: 'Rajdhani, Arial Narrow, sans-serif',
          fontSize:   featured ? 20 : 16,
          fontWeight: 700,
          color:      hovered ? '#ffffff' : '#E8EDF2',
          lineHeight: 1.3,
          letterSpacing:'0.02em',
          margin:     0,
          overflow:   'hidden', display:'-webkit-box',
          WebkitLineClamp: featured ? 3 : 2,
          WebkitBoxOrient:'vertical',
          transition: 'color 150ms',
          flex:1,
        }}>
          {article.title}
        </h2>

        {/* Resumen */}
        {!compact && article.summary && (
          <p style={{
            fontSize:12, color:'#7A8FA6', lineHeight:1.6,
            overflow:'hidden', display:'-webkit-box',
            WebkitLineClamp:2, WebkitBoxOrient:'vertical',
            margin:0,
          }}>
            {article.summary}
          </p>
        )}

        {/* Footer */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          marginTop:'auto', paddingTop:8,
          borderTop:'1px solid rgba(255,255,255,0.05)',
        }}>
          <span style={{ fontSize:10, color:'#4A6078' }}>
            {timeAgo(article.publishedAt)}
          </span>
            <a
            href={article.url} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display:'flex', alignItems:'center', gap:5,
              fontSize:11, fontWeight:600, letterSpacing:'0.08em',
              color: hovered ? '#1A7FBF' : '#4A6078',
              textDecoration:'none', transition:'color 150ms',
              fontFamily:'Rajdhani, Arial Narrow, sans-serif',
              textTransform:'uppercase',
            }}
          >
            Leer más
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Borde inferior con color de categoría */}
      <div style={{
        height:2, background:catColor,
        transform:`scaleX(${hovered ? 1 : 0})`,
        transformOrigin:'left',
        transition:'transform 250ms ease',
      }} />
    </article>
  )
}