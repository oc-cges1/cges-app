// src/features/news/pages/NewsPage.tsx

import { useRef, useCallback }  from 'react'
import { useNavigate }          from 'react-router-dom'
import { useNews }              from '../features/news/hooks/useNews'
import { refreshNews }          from '../features/news/api'
import NewsHero                 from '../features/news/components/NewsHero'
import NewsCard                 from '../features/news/components/NewsCard'
import NewsFilters              from '../features/news/components/NewsFilters'
import NewsSidebar              from '../features/news/components/NewsSidebar'
import UltimaHora               from '../features/news/components/UltimaHora'
import SkeletonCard             from '../features/news/components/SkeletonCard'

export default function NewsPage() {
  const {
    articles, ultima, categories, loading, loadingMore,
    total, page, pages, category, search,
    setCategory, handleSearch, loadMore, reload,
  } = useNews()
  const navigate          = useNavigate()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect()
    if (!node) return
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore()
    }, { threshold: 0.1 })
    observerRef.current.observe(node)
  }, [loadMore])

  const handleRefresh = async () => {
    await refreshNews()
    reload()
  }

  const heroArticles  = articles.filter(a => a.imageUrl).slice(0, 5)
  const gridArticles  = articles.slice(heroArticles.length > 0 ? 1 : 0)

  return (

  <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 72px)' }}>

    {/* Barra superior */}
    <div style={{
      display:'flex',
      alignItems:'center',
      justifyContent:'space-between',
      gap:16,
      padding:'10px 24px',
      background:'#0A1420',
      borderBottom:'1px solid rgba(255,255,255,0.06)',
      flexShrink:0,
    }}>

      <div style={{ display:'flex', alignItems:'center', gap:16 }}>

        <button
          onClick={() => navigate('/')}
          style={{
            display:'flex',
            alignItems:'center',
            gap:6,
            fontSize:12,
            color:'#CC2B2B',
            background:'none',
            border:'1px solid rgba(204,43,43,0.25)',
            borderRadius:4,
            padding:'5px 12px',
            cursor:'pointer',
          }}
        >
          ← Volver
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:22 }}>📰</span>

          <div>
            <div style={{
              fontFamily:'Rajdhani, Arial Narrow, sans-serif',
              fontSize:16,
              fontWeight:600,
              letterSpacing:'0.06em',
              color:'#E8EDF2',
              lineHeight:1,
            }}>
              Centro de Noticias
            </div>

            <div style={{
              fontSize:10,
              color:'#4A6078',
              letterSpacing:'0.08em',
              textTransform:'uppercase',
              marginTop:2,
            }}>
              Monitoreo de seguridad — CGES
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display:'flex',
        alignItems:'center',
        gap:6,
        fontSize:11,
        color:'#4A6078',
      }}>
        <span style={{
          width:6,
          height:6,
          borderRadius:'50%',
          background:'#CC2B2B',
          boxShadow:'0 0 5px #CC2B2B',
        }} />
        Noticias activas
      </div>
    </div>

    <main style={{ flex:1, display:'flex', flexDirection:'column' }}>

      {/* Hero / cabecera */}
      <section style={{
        position:'relative', padding:'40px 32px 28px',
        borderBottom:'1px solid rgba(255,255,255,0.06)', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize:'40px 40px',
          maskImage:'radial-gradient(ellipse at 15% 50%,black 0%,transparent 55%)',
        }} />
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:2,
          background:'linear-gradient(90deg,transparent 0%,#CC2B2B 30%,rgba(204,43,43,0.4) 60%,transparent 100%)',
        }} />

        <div style={{ position:'relative', zIndex:1 }}>
          <span style={{
            display:'block', fontSize:10, fontWeight:500,
            letterSpacing:'0.22em', textTransform:'uppercase',
            color:'#CC2B2B', marginBottom:8,
          }}>
            ● En vivo
          </span>
          <h1 style={{
            fontFamily:'Rajdhani, Arial Narrow, sans-serif',
            fontSize:'clamp(24px,3.5vw,42px)', fontWeight:700,
            letterSpacing:'0.06em', color:'#E8EDF2', lineHeight:1, marginBottom:10,
          }}>
            Centro de Noticias
          </h1>
          <p style={{ fontSize:14, color:'#7A8FA6', maxWidth:520, lineHeight:1.65 }}>
            Monitoreo en tiempo real de noticias de orden público, seguridad y conflicto en Colombia.
            Fuentes verificadas y actualizadas automáticamente.
          </p>

          <div style={{ display:'flex', gap:20, marginTop:16, flexWrap:'wrap' }}>
            {[
              { label:'Noticias totales', value: total },
              { label:'Fuentes activas',  value: 8 },
              { label:'Categorías',       value: categories.length },
              { label:'Última hora',      value: ultima.length },
            ].map((s) => (
              <div key={s.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{
                  fontFamily:'Rajdhani, Arial Narrow, sans-serif',
                  fontSize:22, fontWeight:700, color:'#CC2B2B',
                }}>{s.value}</span>
                <span style={{ fontSize:11, color:'#4A6078', letterSpacing:'0.06em' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <div style={{ flex:1, padding:'28px 32px 48px' }}>

        {/* Última hora */}
        {ultima.length > 0 && <UltimaHora articles={ultima} />}

        {/* Filtros */}
        <NewsFilters
          categories={categories}
          activeCategory={category}
          search={search}
          total={total}
          onCategory={setCategory}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
        />

        {/* Layout: Grid + Sidebar */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'1fr 320px',
          gap:28,
          alignItems:'start',
        }}>

          {/* Columna principal */}
          <div>
            {/* Hero carousel */}
            {!loading && heroArticles.length > 0 && (
              <NewsHero articles={heroArticles} />
            )}
            {loading && <SkeletonCard featured />}

            {/* Grid de noticias */}
            {loading ? (
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
                gap:16,
              }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : gridArticles.length === 0 ? (
              <div style={{
                textAlign:'center', padding:'80px 32px',
                color:'#4A6078', fontSize:14,
              }}>
                <span style={{ display:'block', fontSize:40, marginBottom:12, opacity:0.3 }}>📰</span>
                No se encontraron noticias
                {search && ` para "${search}"`}
                {category !== 'Todas' && ` en ${category}`}
              </div>
            ) : (
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
                gap:16,
              }}>
                {gridArticles.map((art, i) => (
                  <div
                    key={art.id}
                    style={{
                      animation:`cardIn 300ms ${Math.min(i * 40, 400)}ms both`,
                    }}
                  >
                    <NewsCard article={art} featured={i === 0} />
                  </div>
                ))}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            {page < pages && (
              <div ref={sentinelRef} style={{ height:40, marginTop:20, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {loadingMore && (
                  <div style={{
                    width:24, height:24,
                    border:'2px solid rgba(204,43,43,0.2)',
                    borderTop:'2px solid #CC2B2B',
                    borderRadius:'50%',
                    animation:'spin 0.8s linear infinite',
                  }} />
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <NewsSidebar
            ultima={ultima}
            categories={categories}
            onCategory={setCategory}
          />
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity:0; transform:translateY(14px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes urgentPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>
    </main>
    </div>
  )
}