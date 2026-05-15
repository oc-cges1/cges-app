// src/features/news/components/UltimaHora.tsx

import type { NewsArticle }    from '../types'
import { CATEGORY_COLORS, timeAgo } from '../types'

export default function UltimaHora({ articles }: { articles: NewsArticle[] }) {
  if (!articles.length) return null

  return (
    <div style={{
      background:   '#0D1B2A',
      border:       '1px solid rgba(204,43,43,0.3)',
      borderRadius: 10,
      overflow:     'hidden',
      marginBottom: 24,
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'12px 18px',
        background:'rgba(204,43,43,0.1)',
        borderBottom:'1px solid rgba(204,43,43,0.2)',
      }}>
        <span style={{
          width:8, height:8, borderRadius:'50%',
          background:'#CC2B2B', boxShadow:'0 0 6px #CC2B2B',
          animation:'urgentPulse 1s ease-in-out infinite',
          flexShrink:0,
        }} />
        <span style={{
          fontFamily:'Rajdhani, Arial Narrow, sans-serif',
          fontSize:14, fontWeight:700, letterSpacing:'0.12em',
          color:'#CC2B2B', textTransform:'uppercase',
        }}>Última Hora</span>
        <span style={{
          marginLeft:'auto', fontSize:10, color:'#4A6078',
        }}>
          Últimas 2 horas
        </span>
      </div>

      <div style={{ padding:'8px 0' }}>
        {articles.slice(0, 6).map((art) => {
          const catColor = CATEGORY_COLORS[art.category] ?? '#4A6078'
          return (
            <a
              key={art.id}
              href={art.url} target="_blank" rel="noopener noreferrer"
              style={{
                display:'flex', alignItems:'flex-start', gap:12,
                padding:'10px 18px',
                textDecoration:'none',
                borderBottom:'1px solid rgba(255,255,255,0.04)',
                transition:'background 150ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width:3, height:'100%', minHeight:32,
                background:catColor, borderRadius:2, flexShrink:0, marginTop:2,
              }} />
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{
                  fontSize:13, fontWeight:500, color:'#E8EDF2',
                  lineHeight:1.4, marginBottom:4,
                  overflow:'hidden', display:'-webkit-box',
                  WebkitLineClamp:2, WebkitBoxOrient:'vertical',
                }}>
                  {art.title}
                </p>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ fontSize:9, color:catColor, fontWeight:700, letterSpacing:'0.1em' }}>
                    {art.category}
                  </span>
                  <span style={{ fontSize:10, color:'#4A6078' }}>
                    {art.source} · {timeAgo(art.publishedAt)}
                  </span>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}