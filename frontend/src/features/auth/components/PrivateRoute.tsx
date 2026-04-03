// src/features/auth/components/PrivateRoute.tsx

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth }               from '../hooks/useAuth'

interface Props {
  children:      React.ReactNode
  allowedRoles?: string[]
}

export default function PrivateRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, isLoading, role } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        height:'100vh', background:'#060C14', flexDirection:'column', gap:16,
      }}>
        <div style={{
          width:40, height:40,
          border:'3px solid rgba(26,127,191,0.2)',
          borderTop:'3px solid #1A7FBF',
          borderRadius:'50%',
          animation:'spin 0.8s linear infinite',
        }} />
        <p style={{ color:'#4A6078', fontSize:13, letterSpacing:'0.06em' }}>
          Verificando sesión...
        </p>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
