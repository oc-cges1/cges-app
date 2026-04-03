// src/features/auth/pages/AuthLayout.tsx

import { ReactNode } from 'react'

interface Props {
  title:     string
  subtitle?: string
  children:  ReactNode
}

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div style={{
      minHeight:'100vh', background:'#060C14',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'24px 16px', position:'relative', overflow:'hidden',
    }}>
      {/* Grid de fondo */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize:'48px 48px',
        maskImage:'radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)',
        pointerEvents:'none',
      }} />

      {/* Glow central */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:600, height:600, borderRadius:'50%',
        background:'radial-gradient(ellipse, rgba(26,127,191,0.06) 0%, transparent 65%)',
        pointerEvents:'none',
      }} />

      {/* Card */}
      <div style={{
        position:'relative', zIndex:1,
        width:'100%', maxWidth:440,
        background:'#0D1B2A',
        border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:12, overflow:'hidden',
        boxShadow:'0 24px 64px rgba(0,0,0,0.6)',
        animation:'authIn 400ms cubic-bezier(0.4,0,0.2,1) both',
      }}>
        <style>{`
          @keyframes authIn {
            from { opacity:0; transform:translateY(20px) scale(0.97); }
            to   { opacity:1; transform:translateY(0) scale(1); }
          }
        `}</style>

        {/* Línea de acento superior */}
        <div style={{
          height:2,
          background:'linear-gradient(90deg, transparent 0%, #1A7FBF 30%, rgba(26,127,191,0.3) 55%, #1A7FBF 80%, transparent 100%)',
        }} />

        <div style={{ padding:'36px 36px 40px' }}>
          {/* Logo + título */}
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <img
              src="/icons/Logo-CGES.png"
              alt="CGES"
              style={{
                height:56, width:'auto', objectFit:'contain',
                marginBottom:16,
                filter:'drop-shadow(0 0 8px rgba(26,127,191,0.3))',
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
            <h1 style={{
              fontFamily:'Rajdhani, Arial Narrow, sans-serif',
              fontSize:24, fontWeight:700, letterSpacing:'0.08em',
              color:'#E8EDF2', marginBottom:6,
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize:13, color:'#4A6078', letterSpacing:'0.02em' }}>
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
