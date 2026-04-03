// src/features/auth/components/LoginForm.tsx

import { useState }                            from 'react'
import { useForm }                             from 'react-hook-form'
import { zodResolver }                         from '@hookform/resolvers/zod'
import { z }                                   from 'zod'
import { Link, useNavigate, useLocation }      from 'react-router-dom'
import { useAuth }                             from '../hooks/useAuth'

const schema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type FormData = z.infer<typeof schema>

function Spinner() {
  return (
    <span style={{
      width:16, height:16,
      border:'2px solid rgba(255,255,255,0.3)',
      borderTop:'2px solid #fff',
      borderRadius:'50%',
      display:'inline-block',
      animation:'spin 0.7s linear infinite',
      flexShrink:0,
    }} />
  )
}

export default function LoginForm() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const location    = useLocation()
  const from        = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'
  const [serverErr, setServerErr] = useState('')
  const [showPass,  setShowPass]  = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerErr('')
    try {
      await login(data)
      navigate(from, { replace: true })
    } catch (err) {
      setServerErr(err instanceof Error ? err.message : 'Error al iniciar sesión.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate
      style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {serverErr && (
        <div style={{
          padding:'10px 14px',
          background:'rgba(204,43,43,0.1)',
          border:'1px solid rgba(204,43,43,0.25)',
          borderRadius:6, fontSize:13, color:'#e87878',
        }}>
          {serverErr}
        </div>
      )}

      {/* Email */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="login-email">Correo electrónico</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="usuario@cges.gov.co"
          className={`auth-input ${errors.email ? 'error' : ''}`}
          {...register('email')}
        />
        {errors.email && <span className="auth-error-msg">{errors.email.message}</span>}
      </div>

      {/* Contraseña */}
      <div className="auth-field">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <label className="auth-label" htmlFor="login-pass">Contraseña</label>
          <Link to="/auth/forgot-password"
            style={{ fontSize:12, color:'#1A7FBF', textDecoration:'none' }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div style={{ position:'relative' }}>
          <input
            id="login-pass"
            type={showPass ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`auth-input ${errors.password ? 'error' : ''}`}
            style={{ paddingRight:44 }}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            style={{
              position:'absolute', right:12, top:'50%',
              transform:'translateY(-50%)', background:'none',
              border:'none', color:'#4A6078', cursor:'pointer',
              padding:4, fontSize:16,
            }}
            aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPass ? '🙈' : '👁'}
          </button>
        </div>
        {errors.password && <span className="auth-error-msg">{errors.password.message}</span>}
      </div>

      <button type="submit" className="auth-btn" disabled={isSubmitting}>
        {isSubmitting ? <><Spinner /> Ingresando...</> : 'Ingresar al Sistema'}
      </button>

      <p style={{ textAlign:'center', fontSize:13, color:'#4A6078' }}>
        ¿No tienes cuenta?{' '}
        <Link to="/auth/register" style={{ color:'#1A7FBF', textDecoration:'none' }}>
          Solicitar acceso
        </Link>
      </p>
    </form>
  )
}
