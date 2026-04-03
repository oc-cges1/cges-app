// src/App.tsx

import { lazy, Suspense }    from 'react'
import { Routes, Route }     from 'react-router-dom'
import Header                from '@/components/Header'
import Footer                from '@/components/Footer'
import PrivateRoute          from '@/features/auth/components/PrivateRoute'
import Dashboard             from '@/pages/Dashboard'
import ObservatorioPage      from '@/pages/ObservatorioPage'
import ModulePlaceholder     from '@/pages/ModulePlaceholder'
import LookerStudioPage      from '@/pages/LookerStudioPage'

// Auth pages — no lazy (son livianas)
import LoginPage          from '@/features/auth/pages/LoginPage'
import RegisterPage       from '@/features/auth/pages/RegisterPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage  from '@/features/auth/pages/ResetPasswordPage'

const GeoPage = lazy(() => import('@/pages/GeoPage'))

function LoadingFallback() {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      height:'calc(100vh - 74px)', color:'#7A8FA6',
      fontFamily:'Inter, sans-serif', fontSize:14, letterSpacing:'0.06em',
    }}>
      Cargando módulo...
    </div>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>

      {/* ── Rutas públicas ── sin Header/Footer ─────────────── */}
      <Route path="/auth/login"           element={<LoginPage />} />
      <Route path="/auth/register"        element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password"  element={<ResetPasswordPage />} />

      {/* ── Rutas protegidas ── con Header/Footer ───────────── */}
      <Route path="/*" element={
        <PrivateRoute>
          <AppLayout>
            <Routes>

              {/* Panel principal */}
              <Route path="/"
                element={<Dashboard />} />
              <Route path="/sistema-departamental-de-seguridad"
                element={<ModulePlaceholder moduleId="sistema-departamental-de-seguridad" />} />

              {/* Mapas */}
              <Route path="/georeferenciacion"
                element={<GeoPage />} />
              <Route path="/camaras"
                element={<GeoPage />} />
              <Route path="/mapa-criminal"
                element={<ModulePlaceholder moduleId="mapa-criminal" />} />

              {/* Seguridad */}
              <Route path="/alertas-tempranas"
                element={<ModulePlaceholder moduleId="alertas-tempranas" />} />
              <Route path="/corredores-seguros"
                element={<ModulePlaceholder moduleId="corredores-seguros" />} />
              <Route path="/terrorismo"
                element={<ModulePlaceholder moduleId="terrorismo" />} />

              {/* Social */}
              <Route path="/mediadores"
                element={<ModulePlaceholder moduleId="mediadores" />} />
              <Route path="/encuentros-zonales"
                element={<ModulePlaceholder moduleId="encuentros-zonales" />} />

              {/* Análisis */}
              <Route path="/resultados-operativos"
                element={<ModulePlaceholder moduleId="resultados-operativos" />} />
              <Route path="/looker-studio"
                element={<LookerStudioPage />} />
              <Route path="/boletines"
                element={<ModulePlaceholder moduleId="boletines" />} />

              {/* Observatorio y submódulos */}
              <Route path="/observatorio"
                element={<ObservatorioPage />} />
              <Route path="/observatorio/boletines"
                element={<ModulePlaceholder moduleId="obs-boletines" />} />
              <Route path="/observatorio/informes"
                element={<ModulePlaceholder moduleId="obs-informes" />} />

            </Routes>
          </AppLayout>
        </PrivateRoute>
      } />

    </Routes>
  )
}
