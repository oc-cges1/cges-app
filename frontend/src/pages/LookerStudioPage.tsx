// src/pages/LookerStudioPage.tsx

import { useNavigate } from 'react-router-dom'

const LOOKER_URL =
  'https://lookerstudio.google.com/embed/reporting/edef9314-962e-4356-963a-31883e98ae1d/page/p_v1js1pzstd'
export default function LookerStudioPage() {
  const navigate = useNavigate()

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 72px)' }}>

      {/* Barra superior */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        gap:16, padding:'10px 24px',
        background:'#0A1420', borderBottom:'1px solid rgba(255,255,255,0.06)',
        flexShrink:0,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <button onClick={() => navigate('/')} style={{
            display:'flex', alignItems:'center', gap:6,
            fontSize:12, color:'#18A058', background:'none',
            border:'1px solid rgba(24,160,88,0.25)', borderRadius:4,
            padding:'5px 12px', cursor:'pointer', letterSpacing:'0.04em', transition:'all 150ms',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(24,160,88,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            ← Volver
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:22 }}>📈</span>
            <div>
              <div style={{
                fontFamily:'Rajdhani, Arial Narrow, sans-serif',
                fontSize:16, fontWeight:600, letterSpacing:'0.06em', color:'#E8EDF2', lineHeight:1,
              }}>Looker Studio</div>
              <div style={{
                fontSize:10, color:'#4A6078', letterSpacing:'0.08em',
                textTransform:'uppercase', marginTop:2,
              }}>Business Intelligence — CGES</div>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#4A6078' }}>
            <span style={{
              width:6, height:6, borderRadius:'50%',
              background:'#18A058', boxShadow:'0 0 5px #18A058',
              animation:'lspulse 2s ease-in-out infinite', flexShrink:0,
            }} />
            Reporte activo
          </div>
          <a href={LOOKER_URL} target="_blank" rel="noopener noreferrer" style={{
            display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#18A058',
            background:'rgba(24,160,88,0.08)', border:'1px solid rgba(24,160,88,0.2)',
            borderRadius:4, padding:'5px 12px', textDecoration:'none',
            letterSpacing:'0.04em', transition:'all 150ms',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(24,160,88,0.16)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(24,160,88,0.08)')}
          >
            Abrir en nueva pestaña
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Iframe */}
      <div style={{ flex:1, position:'relative', background:'#060C14' }}>
        <iframe
          src={LOOKER_URL}
          style={{ width:'100%', height:'100%', border:'none', display:'block' }}
          allowFullScreen
          title="Looker Studio — CGES Business Intelligence"
        />
      </div>

      <style>{`@keyframes lspulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  )
}
