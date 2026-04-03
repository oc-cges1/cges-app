// src/pages/GeoPage.tsx

import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate }                              from 'react-router-dom'
import type { Map, TileLayer, GeoJSON, LatLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface CamaraProperties {
  pais:              string
  departamento:      string
  distrito:          string
  zona:              number
  municipio:         string
  direccion:         string
  camaras_valle:     number
  camaras_municipio: number
  total_camaras:     number
  visualizacion:     string
}

type BaseMap = 'dark' | 'standard' | 'satellite'

interface LoadState {
  status: 'idle' | 'loading' | 'success' | 'error'
  count:  number
  error:  string | null
}

interface MapInstance {
  map:          Map
  baseLayers:   Record<BaseMap, TileLayer>
  geojsonLayer: GeoJSON | null
  valleLayer:   GeoJSON | null
}

const VIZ_COLOR: Record<string, string> = {
  CGES:   '#14B45A',
  NO:     '#E68C14',
  ACTIVA: '#1A7FBF',
}
const VIZ_DEFAULT = '#7A8FA6'

function vizColor(viz: string): string {
  return VIZ_COLOR[viz?.toUpperCase?.() ?? ''] ?? VIZ_DEFAULT
}

function makeMarkerHtml(color: string): string {
  return `<div style="width:13px;height:13px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.88);box-shadow:0 0 10px ${color};"></div>`
}

function makePopupHtml(p: CamaraProperties): string {
  const color = vizColor(p.visualizacion)
  return `
    <div style="font-family:Inter,system-ui,sans-serif;font-size:12px;color:#E8EDF2;min-width:240px;line-height:1.7;">
      <div style="font-size:13px;font-weight:600;margin-bottom:10px;padding-bottom:7px;border-bottom:1px solid rgba(255,255,255,0.1);color:#fff;">
        ${p.direccion ?? 'Sin dirección'}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px 14px;">
        <span style="color:#4A6078">Municipio</span><span>${p.municipio ?? '—'}</span>
        <span style="color:#4A6078">Departamento</span><span>${p.departamento ?? '—'}</span>
        <span style="color:#4A6078">Distrito</span><span>${p.distrito ?? '—'}</span>
        <span style="color:#4A6078">Zona</span><span>${p.zona ?? '—'}</span>
        <span style="color:#4A6078">Cámaras Valle</span><span>${p.camaras_valle ?? 0}</span>
        <span style="color:#4A6078">Cámaras Municipio</span><span>${p.camaras_municipio ?? 0}</span>
        <span style="color:#4A6078;font-weight:600">Total cámaras</span>
        <span style="font-weight:700;font-size:13px">${p.total_camaras ?? 0}</span>
      </div>
      <div style="margin-top:10px;padding:6px 8px;border-radius:4px;background:${color}18;border:1px solid ${color}30;display:flex;align-items:center;gap:7px;">
        <span style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 5px ${color};"></span>
        <span style="color:${color};font-size:11px;letter-spacing:0.07em;">${p.visualizacion ?? '—'}</span>
      </div>
    </div>`
}

export default function GeoPage() {
  const mapRef  = useRef<HTMLDivElement>(null)
  const instRef = useRef<MapInstance | null>(null)
  const [activeBase,     setActiveBase]     = useState<BaseMap>('dark')
  const [geojsonVisible, setGeojsonVisible] = useState(true)
  const [valleVisible,   setValleVisible]   = useState(true)
  const [loadState,      setLoadState]      = useState<LoadState>({ status:'idle', count:0, error:null })
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    const init = async () => {
      if (!mapRef.current || instRef.current) return
      const L = (await import('leaflet')).default
      if (!mounted || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center:[4.0, -76.5], zoom:9, zoomControl:false, preferCanvas:true,
      })
      L.control.zoom({ position:'bottomright' }).addTo(map)

      const baseLayers: Record<BaseMap, TileLayer> = {
        dark:      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution:'© CARTO', maxZoom:19 }),
        standard:  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap', maxZoom:19 }),
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution:'© Esri', maxZoom:19 }),
      }
      baseLayers.dark.addTo(map)

      let geojsonLayer: GeoJSON | null = null
      setLoadState({ status:'loading', count:0, error:null })

      try {
        const res = await fetch('/camaras_valle.geojson')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: GeoJSON.FeatureCollection<GeoJSON.Point, CamaraProperties> = await res.json()
        if (!mounted) return

        setLoadState({ status:'success', count: data.features?.length ?? 0, error:null })

        geojsonLayer = L.geoJSON(data, {
          pointToLayer: (feature, latlng) => {
            const color = vizColor(feature.properties.visualizacion)
            return L.marker(latlng, {
              icon: L.divIcon({
                className:'', html:makeMarkerHtml(color),
                iconSize:[13,13], iconAnchor:[6,6], popupAnchor:[0,-8],
              }),
            })
          },
          onEachFeature: (feature, layer) => {
            layer.bindPopup(makePopupHtml(feature.properties), { maxWidth:300, className:'geo-popup' })
            layer.on('mouseover', function(this: typeof layer) {
              const el = (this as L.Marker).getElement()
              const dot = el?.querySelector('div') as HTMLElement | null
              if (dot) dot.style.transform = 'scale(1.5)'
            })
            layer.on('mouseout', function(this: typeof layer) {
              const el = (this as L.Marker).getElement()
              const dot = el?.querySelector('div') as HTMLElement | null
              if (dot) dot.style.transform = 'scale(1)'
            })
          },
        })
        geojsonLayer.addTo(map)

        const bounds: LatLngBounds = geojsonLayer.getBounds()
        if (bounds.isValid()) map.fitBounds(bounds, { padding:[48,48], maxZoom:12 })
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setLoadState({ status:'error', count:0, error:msg })
      }

      let valleLayer: GeoJSON | null = null
      try {
        const res = await fetch('/valle_del_cauca.geojson')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!mounted) return

        valleLayer = L.geoJSON(data, {
          style: { color:'#1A7FBF', weight:2, opacity:0.8, fillColor:'#1A7FBF', fillOpacity:0.06, dashArray:'6 4' },
          onEachFeature: (_feature, layer) => {
            layer.on('mouseover', () => { (layer as L.Path).setStyle({ weight:3, fillOpacity:0.12 }) })
            layer.on('mouseout',  () => { (layer as L.Path).setStyle({ weight:2, fillOpacity:0.06 }) })
          },
        })
        valleLayer.addTo(map)
        if (geojsonLayer) geojsonLayer.bringToFront()
      } catch (err) {
        console.warn('[GeoPage] valle_del_cauca.geojson:', err)
      }

      instRef.current = { map, baseLayers, geojsonLayer, valleLayer }
    }

    init()
    return () => {
      mounted = false
      if (instRef.current) { instRef.current.map.remove(); instRef.current = null }
    }
  }, [])

  const switchBase = useCallback((name: BaseMap) => {
    if (!instRef.current) return
    const { map, baseLayers } = instRef.current
    Object.values(baseLayers).forEach((l) => map.removeLayer(l))
    map.addLayer(baseLayers[name])
    setActiveBase(name)
  }, [])

  const toggleGeojson = useCallback((visible: boolean) => {
    if (!instRef.current?.geojsonLayer) return
    const { map, geojsonLayer } = instRef.current
    visible ? map.addLayer(geojsonLayer) : map.removeLayer(geojsonLayer)
    setGeojsonVisible(visible)
  }, [])

  const toggleValle = useCallback((visible: boolean) => {
    if (!instRef.current?.valleLayer) return
    const { map, valleLayer } = instRef.current
    visible ? map.addLayer(valleLayer) : map.removeLayer(valleLayer)
    setValleVisible(visible)
  }, [])

  const zoomToGeojson = useCallback(() => {
    if (!instRef.current?.geojsonLayer) return
    const { map, geojsonLayer } = instRef.current
    const bounds = geojsonLayer.getBounds()
    if (bounds.isValid()) map.fitBounds(bounds, { padding:[48,48], maxZoom:12 })
  }, [])

  const isSuccess = loadState.status === 'success'
  const isError   = loadState.status === 'error'
  const isLoading = loadState.status === 'loading'

  return (
    <div style={{ display:'flex', height:'calc(100vh - 72px)' }}>

      {/* Sidebar */}
      <aside style={{
        width:260, flexShrink:0, background:'#0A1420',
        borderRight:'1px solid rgba(255,255,255,0.06)',
        padding:'20px 14px', overflowY:'auto',
        display:'flex', flexDirection:'column', gap:24,
      }}>
        <div>
          <div style={{
            fontFamily:'Rajdhani, Arial Narrow, sans-serif',
            fontSize:18, fontWeight:600, letterSpacing:'0.08em', color:'#E8EDF2',
          }}>Georreferenciación</div>
          <button onClick={() => navigate('/')} style={{
            marginTop:5, fontSize:11, color:'#1A7FBF',
            background:'none', border:'none', padding:0, cursor:'pointer', letterSpacing:'0.04em',
          }}>← Volver al Panel</button>
        </div>

        {/* Mapa base */}
        <SideGroup label="Mapa Base">
          {(['dark','standard','satellite'] as BaseMap[]).map((b) => (
            <LayerBtn key={b} active={activeBase===b} onClick={() => switchBase(b)}
              label={b==='dark'?'Oscuro':b==='standard'?'Estándar':'Satélite'} />
          ))}
        </SideGroup>

        {/* Cámaras GeoJSON */}
        <SideGroup label="Capas GeoJSON">
          <div style={{
            padding:'11px 12px', borderRadius:6,
            background: isError ? 'rgba(200,40,40,0.06)' : isSuccess && geojsonVisible ? 'rgba(20,180,90,0.06)' : 'rgba(255,255,255,0.02)',
            border:`1px solid ${isError ? 'rgba(200,40,40,0.3)' : isSuccess && geojsonVisible ? 'rgba(20,180,90,0.25)' : 'rgba(255,255,255,0.07)'}`,
            transition:'all 200ms',
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'#E8EDF2', cursor:'pointer', fontWeight:500, flex:1, minWidth:0 }}>
                <input type="checkbox" checked={geojsonVisible} disabled={!isSuccess}
                  onChange={(e) => toggleGeojson(e.target.checked)}
                  style={{ accentColor:'#14B45A', width:13, height:13, flexShrink:0 }} />
                <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  📹 Cámaras Valle del Cauca
                </span>
              </label>
              {isSuccess && (
                <span style={{ fontSize:11, color:'#14B45A', background:'rgba(20,180,90,0.12)', padding:'2px 7px', borderRadius:10, flexShrink:0 }}>
                  {loadState.count}
                </span>
              )}
              {isLoading && <span style={{ fontSize:10, color:'#4A6078', flexShrink:0 }}>cargando…</span>}
            </div>
            {isError && (
              <div style={{ marginTop:8, padding:'6px 8px', borderRadius:4, background:'rgba(200,40,40,0.1)', border:'1px solid rgba(200,40,40,0.2)', fontSize:11, color:'#e87878', lineHeight:1.5 }}>
                ⚠ {loadState.error}
              </div>
            )}
            {isSuccess && (
              <button onClick={zoomToGeojson} style={{
                marginTop:9, marginLeft:21, fontSize:11, color:'#1A7FBF',
                background:'none', border:'none', padding:0, cursor:'pointer', letterSpacing:'0.03em',
              }}>⊕ Zoom al extent</button>
            )}
          </div>

          {/* Valle del Cauca */}
          <div style={{
            marginTop:8, padding:'11px 12px', borderRadius:6,
            background: valleVisible ? 'rgba(26,127,191,0.06)' : 'rgba(255,255,255,0.02)',
            border:`1px solid ${valleVisible ? 'rgba(26,127,191,0.25)' : 'rgba(255,255,255,0.07)'}`,
            transition:'all 200ms',
          }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'#E8EDF2', cursor:'pointer', fontWeight:500 }}>
              <input type="checkbox" checked={valleVisible}
                onChange={(e) => toggleValle(e.target.checked)}
                style={{ accentColor:'#1A7FBF', width:13, height:13 }} />
              🗺️ Límite Valle del Cauca
            </label>
          </div>
        </SideGroup>

        {/* Leyenda */}
        <SideGroup label="Leyenda">
          {[
            { color:'#14B45A', label:'Cámara activa (CGES)' },
            { color:'#E68C14', label:'Sin visualización (NO)' },
            { color:'#1A7FBF', label:'Activa sin sistema' },
            { color:'#7A8FA6', label:'Otro / desconocido' },
          ].map((item) => (
            <div key={item.label} style={{ display:'flex', alignItems:'center', gap:9, fontSize:12, color:'#7A8FA6', marginBottom:7 }}>
              <span style={{ width:10, height:10, borderRadius:'50%', flexShrink:0, background:item.color, boxShadow:`0 0 5px ${item.color}` }} />
              {item.label}
            </div>
          ))}
        </SideGroup>
      </aside>

      {/* Mapa */}
      <div ref={mapRef} style={{ flex:1, background:'#060C14' }} />

      <style>{`
        .geo-popup .leaflet-popup-content-wrapper {
          background:#0D1B2A !important; color:#E8EDF2 !important;
          border:1px solid rgba(255,255,255,0.09) !important;
          border-radius:8px !important; box-shadow:0 6px 28px rgba(0,0,0,0.7) !important;
        }
        .geo-popup .leaflet-popup-content { margin:14px 16px !important; }
        .geo-popup .leaflet-popup-tip-container .leaflet-popup-tip { background:#0D1B2A !important; }
        .leaflet-popup-close-button { color:#7A8FA6 !important; font-size:18px !important; top:8px !important; right:10px !important; }
        .leaflet-popup-close-button:hover { color:#E8EDF2 !important; }
      `}</style>
    </div>
  )
}

function SideGroup({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize:10, fontWeight:500, letterSpacing:'0.15em', textTransform:'uppercase', color:'#4A6078', marginBottom:9 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function LayerBtn({ active, onClick, label }: { active:boolean; onClick:()=>void; label:string }) {
  return (
    <button onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:9,
      width:'100%', padding:'8px 10px', marginBottom:5,
      background: active ? 'rgba(26,127,191,0.1)' : 'transparent',
      border:`1px solid ${active ? 'rgba(26,127,191,0.4)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius:4, color: active ? '#1A7FBF' : '#7A8FA6',
      fontFamily:'Inter, sans-serif', fontSize:12,
      cursor:'pointer', textAlign:'left', transition:'all 150ms',
    }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:'currentColor', flexShrink:0 }} />
      {label}
    </button>
  )
}
