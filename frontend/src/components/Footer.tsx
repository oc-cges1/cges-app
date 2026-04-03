// src/components/Footer.tsx

import { useState } from 'react'

const CURRENT_YEAR = new Date().getFullYear()

const LINKS = {
  institucional: [
    { label: 'Política de Privacidad', href: '#privacidad'    },
    { label: 'Términos de Uso',        href: '#terminos'      },
    { label: 'Accesibilidad',          href: '#accesibilidad' },
  ],
  soporte: [
    { label: 'Mesa de Ayuda',        href: '#soporte'   },
    { label: 'Contacto',             href: '#contacto'  },
    { label: 'Reportar un problema', href: '#reporte'   },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      position:'relative', background:'#070E18',
      borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:'auto',
    }}>
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:2,
        background:'linear-gradient(90deg, transparent 0%, #1A7FBF 30%, rgba(26,127,191,0.3) 55%, #1A7FBF 80%, transparent 100%)',
      }} />

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'40px 32px 32px' }}>
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
          gap:'36px 48px', marginBottom:40,
        }}>

          {/* Columna 1 — Identidad */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <img
                src="/icons/Logo-CGES.png"
                alt="Logo CGES"
                style={{
                  height:64, width:'auto', objectFit:'contain', flexShrink:0,
                  mixBlendMode:'screen',
                  filter:'drop-shadow(0 0 6px rgba(26,127,191,0.25))',
                }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <div>
                <div style={{
                  fontFamily:'Rajdhani, Arial Narrow, sans-serif',
                  fontSize:18, fontWeight:700, letterSpacing:'0.1em',
                  color:'#E8EDF2', lineHeight:1,
                }}>CGES</div>
                <div style={{
                  fontSize:10, color:'#4A6078', letterSpacing:'0.08em',
                  textTransform:'uppercase', marginTop:3,
                }}>Centro de Gestión de Emergencias y Seguridad</div>
              </div>
            </div>
            <p style={{ fontSize:12, lineHeight:1.75, color:'#4A6078', maxWidth:260 }}>
              Sistema Departamental de Seguridad — Plataforma de análisis,
              monitoreo y gestión de información para el Valle del Cauca.
            </p>
            <div style={{
              display:'flex', alignItems:'center', gap:7,
              marginTop:18, fontSize:11, color:'#4A6078', letterSpacing:'0.04em',
            }}>
              <span style={{
                width:7, height:7, borderRadius:'50%', background:'#14B45A',
                boxShadow:'0 0 6px #14B45A', flexShrink:0,
                animation:'ftpulse 2.5s ease-in-out infinite',
              }} />
              Sistema operativo
            </div>
            <style>{`@keyframes ftpulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
          </div>

          {/* Columna 2 — Institucional */}
          <div>
            <h3 style={{
              fontFamily:'Rajdhani, Arial Narrow, sans-serif',
              fontSize:13, fontWeight:600, letterSpacing:'0.14em',
              textTransform:'uppercase', color:'#7A8FA6', marginBottom:16,
            }}>Institucional</h3>
            <nav>
              {LINKS.institucional.map((link) => (
                <FooterLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
          </div>

          {/* Columna 3 — Soporte */}
          <div>
            <h3 style={{
              fontFamily:'Rajdhani, Arial Narrow, sans-serif',
              fontSize:13, fontWeight:600, letterSpacing:'0.14em',
              textTransform:'uppercase', color:'#7A8FA6', marginBottom:16,
            }}>Soporte</h3>
            <nav>
              {LINKS.soporte.map((link) => (
                <FooterLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
          </div>
        </div>

        {/* Divisor inferior */}
        <div style={{
          borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:24,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexWrap:'wrap', gap:12,
        }}>
          <p style={{ fontSize:12, color:'#2E4055', letterSpacing:'0.03em' }}>
            © {CURRENT_YEAR} Gobernación del Valle del Cauca. Todos los derechos reservados.
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontSize:11, color:'#2E4055', letterSpacing:'0.05em', fontFamily:'monospace' }}>
              v1.0.0
            </span>
            <span style={{
              fontSize:11, color:'#1A7FBF',
              background:'rgba(26,127,191,0.08)',
              border:'1px solid rgba(26,127,191,0.2)',
              borderRadius:3, padding:'2px 8px', letterSpacing:'0.06em',
            }}>
              PRODUCCIÓN
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      style={{
        display:'flex', alignItems:'center', gap:8,
        fontSize:13, color: hovered ? '#E8EDF2' : '#4A6078',
        letterSpacing:'0.02em', padding:'5px 0',
        textDecoration:'none', transition:'color 150ms',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        width:4, height:4, borderRadius:'50%',
        background:'currentColor', flexShrink:0, opacity:0.5,
      }} />
      {label}
    </a>
  )
}
