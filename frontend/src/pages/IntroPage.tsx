// src/pages/IntroPage.tsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function IntroPage() {
  const navigate  = useNavigate()
  const [phase, setPhase] = useState<'logo' | 'shield' | 'exit'>('logo')
  const logoRef   = useRef<HTMLDivElement>(null)

  // Si el usuario ya visitó antes, saltar directamente
  useEffect(() => {
    if (sessionStorage.getItem('intro_seen')) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const handleLogoClick = () => {
    if (phase !== 'logo') return
    setPhase('shield')
  }

  const handleShieldClick = () => {
    if (phase !== 'shield') return
    setPhase('exit')
    setTimeout(() => {
      sessionStorage.setItem('intro_seen', '1')
      navigate('/', { replace: true })
    }, 700)
  }

  const handleSkip = () => {
    setPhase('exit')
    setTimeout(() => {
      sessionStorage.setItem('intro_seen', '1')
      navigate('/', { replace: true })
    }, 500)
  }

  return (
    <div style={{
      position:       'fixed',
      inset:          0,
      background:     '#060C14',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      zIndex:         9999,
      overflow:       'hidden',
    }}>

      {/* Grid de fondo */}
      <div style={{
        position:        'absolute',
        inset:           0,
        backgroundImage: 'linear-gradient(rgba(26,127,191,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,127,191,0.04) 1px, transparent 1px)',
        backgroundSize:  '48px 48px',
        pointerEvents:   'none',
      }} />

      {/* Botón saltar */}
      <button
        onClick={handleSkip}
        style={{
          position:      'absolute',
          top:           24,
          right:         24,
          background:    'transparent',
          border:        '1px solid rgba(255,255,255,0.15)',
          borderRadius:  4,
          color:         'rgba(255,255,255,0.4)',
          fontSize:      11,
          letterSpacing: '0.1em',
          padding:       '6px 16px',
          cursor:        'pointer',
          fontFamily:    'Rajdhani, Arial Narrow, sans-serif',
          zIndex:        10,
          transition:    'all 200ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)';  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
      >
        SALTAR INTRO
      </button>

      {/* ── Logo principal (fase 1) ── */}
      <div
        ref={logoRef}
        onClick={handleLogoClick}
        style={{
          position:        'relative',
          cursor:          phase === 'logo' ? 'pointer' : 'default',
          width:           200,
          height:          200,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          transformStyle:  'preserve-3d',
          perspective:     800,
          animation:       phase === 'logo' ? 'introLogoSpin 7s linear infinite' : 'none',
          transform:       phase === 'shield' ? 'scale(1.2) rotateY(180deg)' : 'scale(1)',
          opacity:         phase === 'shield' ? 0 : phase === 'exit' ? 0 : 1,
          transition:      'transform 600ms cubic-bezier(0.34,1.56,0.64,1), opacity 400ms ease',
          pointerEvents:   phase === 'logo' ? 'auto' : 'none',
        }}
      >
        {/* Imagen del logo o círculo SVG como fallback */}
        <img
          src="/icons/Logo-SDS2.png"
          alt="SISDEP"
          style={{
            width:     500,
            height:    500,
            objectFit: 'contain',
            borderRadius: '50%',
            filter:    'drop-shadow(0 0 24px rgba(26,127,191,0.5)) drop-shadow(0 0 8px rgba(196,148,10,0.3))',
          }}
          onError={(e) => {
            // Fallback si no carga la imagen
            const img = e.currentTarget as HTMLImageElement
            img.style.display = 'none'
          }}
        />

        {/* Anillos de pulso */}
        <div style={{
          position:     'absolute',
          inset:        -20,
          borderRadius: '50%',
          border:       '1px solid rgba(26,127,191,0.3)',
          animation:    'introPulse 2.5s ease-in-out infinite',
          pointerEvents:'none',
        }} />
        <div style={{
          position:     'absolute',
          inset:        -38,
          borderRadius: '50%',
          border:       '1px solid rgba(26,127,191,0.15)',
          animation:    'introPulse 2.5s ease-in-out infinite 0.6s',
          pointerEvents:'none',
        }} />

        {/* Texto de instrucción */}
        {phase === 'logo' && (
          <div style={{
            position:      'absolute',
            bottom:        -150,
            left:          '50%',
            transform:     'translateX(-50%)',
            fontSize:      12,
            letterSpacing: '0.15em',
            color:         'rgba(255,255,255,0.3)',
            whiteSpace:    'nowrap',
            animation:     'introBlink 2s ease-in-out infinite',
            fontFamily:    'Rajdhani, Arial Narrow, sans-serif',
          }}>
            TOCA PARA CONTINUAR
          </div>
        )}
      </div>

      {/* ── Escudo (fase 2) ── */}
      <div
        onClick={handleShieldClick}
        style={{
          position:        'absolute',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          gap:             16,
          cursor:          phase === 'shield' ? 'pointer' : 'default',
          opacity:         phase === 'shield' ? 1 : 0,
          transform:       phase === 'shield' ? 'scale(1) rotateX(0deg)' : 'scale(0.1) rotateX(90deg)',
          transformOrigin: 'center center',
          transition:      'opacity 500ms ease-out 200ms, transform 600ms cubic-bezier(0.34,1.56,0.64,1) 200ms',
          pointerEvents:   phase === 'shield' ? 'auto' : 'none',
        }}
      >
        {/* Imagen del escudo */}
        <div style={{ position: 'relative' }}>
          <img
            src="/icons/Logo-CGES.png"
            alt="CGES"
            style={{
              width:     500,
              height:    'auto',
              objectFit: 'contain',
              filter:    'drop-shadow(0 0 32px rgba(26,127,191,0.6)) drop-shadow(0 0 16px rgba(26,127,191,0.3))',
              animation: phase === 'shield' ? 'introShieldFloat 3s ease-in-out infinite' : 'none',
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
          {/* Overlay INICIO sobre el escudo */}
          <div style={{
            position:      'absolute',
            bottom:        '-0.5%',
            left:          '50%',
            transform:     'translateX(-50%)',
            fontFamily:    'Rajdhani, Arial Narrow, sans-serif',
            fontSize:      20,
            fontWeight:    700,
            letterSpacing: '0.22em',
            color:         '#ffffff',
            textShadow:    '0 2px 12px rgba(0,0,0,0.8)',
            whiteSpace:    'nowrap',
          }}>
            INICIO
          </div>
        </div>

        {/* Botón de acción */}
        <button
          onClick={handleShieldClick}
          style={{
            background:    'rgba(26,127,191,0.12)',
            border:        '1px solid rgba(26,127,191,0.5)',
            borderRadius:  4,
            color:         '#1A7FBF',
            fontFamily:    'Rajdhani, Arial Narrow, sans-serif',
            fontSize:      13,
            letterSpacing: '0.14em',
            padding:       '10px 36px',
            cursor:        'pointer',
            transition:    'all 200ms',
            textTransform: 'uppercase',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,127,191,0.22)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(26,127,191,0.12)'; e.currentTarget.style.color = '#1A7FBF' }}
        >
          Ingresar al Sistema
        </button>
      </div>

      {/* ── Fade de salida ── */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: '#060C14',
        opacity:    phase === 'exit' ? 1 : 0,
        transition: 'opacity 600ms ease-in',
        pointerEvents: phase === 'exit' ? 'auto' : 'none',
        zIndex:     20,
      }} />

      {/* Keyframes */}
      <style>{`
        @keyframes introLogoSpin {
          0%   { transform: rotateY(0deg);   }
          100% { transform: rotateY(360deg); }
        }
        @keyframes introPulse {
          0%,100% { opacity: 0.6; transform: scale(1);    }
          50%     { opacity: 0.1; transform: scale(1.05); }
        }
        @keyframes introBlink {
          0%,100% { opacity: 0.3; }
          50%     { opacity: 0.8; }
        }
        @keyframes introShieldFloat {
          0%,100% { transform: translateY(0px);  }
          50%     { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}