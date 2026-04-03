// src/features/auth/components/RegisterForm.tsx

import { useState }              from 'react'
import { useForm }               from 'react-hook-form'
import { zodResolver }           from '@hookform/resolvers/zod'
import { z }                     from 'zod'
import { Link, useNavigate }     from 'react-router-dom'
import { useAuth }               from '../hooks/useAuth'

const schema = z.object({
  name:     z.string().min(2, 'Mínimo 2 caracteres').max(80),
  email:    z.string().email('Email inválido'),
  password: z
    .string()
    .min(8,    'Mínimo 8 caracteres')
    .regex(/[A-Z]/,        'Debe tener al menos una mayúscula')
    .regex(/[0-9]/,        'Debe tener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe tener al menos un símbolo'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'Las contraseñas no coinciden',
  path:    ['confirm'],
})

type FormData = z.infer<typeof schema>

function PasswordStrength({ password }: { password: string }) {
  const rules = [
    { label: 'Mínimo 8 caracteres', ok: password.length >= 8 },
    { label: 'Una mayúscula',       ok: /[A-Z]/.test(password) },
    { label: 'Un número',           ok: /[0-9]/.test(password) },
    { label: 'Un símbolo',          ok: /[^A-Za-z0-9]/.test(password) },
  ]
  if (!password) return null
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4, marginTop:6 }}>
      {rules.map((r) => (
        <div key={r.label} style={{
          display:'flex', alignItems:'center', gap:6,
          fontSize:11, color: r.ok ? '#14B45A' : '#4A6078', transition:'color 150ms',
        }}>
          <span style={{
            width:10, height:10, borderRadius:'50%', flexShrink:0,
            background: r.ok ? '#14B45A' : 'rgba(255,255,255,0.08)',
            transition:'background 150ms',
          }} />
          {r.label}
        </div>
      ))}
    </div>
  )
}

export default function RegisterForm() {
  const { register: registerUser } = useAuth()
  const navigate                   = useNavigate()
  const [serverErr, setServerErr]  = useState('')
  const [success,   setSuccess]    = useState(false)
  const [showPass,  setShowPass]   = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const passwordVal = watch('password', '')

  const onSubmit = async (data: FormData) => {
    setServerErr('')
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password })
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setServerErr(err instanceof Error ? err.message : 'Error al registrar.')
    }
  }

  if (success) {
    return (
      <div style={{ textAlign:'center', padding:'40px 0' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
        <h3 style={{
          fontFamily:'Rajdhani, Arial Narrow, sans-serif',
          fontSize:22, color:'#14B45A', marginBottom:8,
        }}>Cuenta creada</h3>
        <p style={{ color:'#7A8FA6', fontSize:14 }}>
          Revisa tu correo para verificar tu cuenta. Redirigiendo...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate
      style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {serverErr && (
        <div style={{
          padding:'10px 14px', background:'rgba(204,43,43,0.1)',
          border:'1px solid rgba(204,43,43,0.25)',
          borderRadius:6, fontSize:13, color:'#e87878',
        }}>
          {serverErr}
        </div>
      )}

      {/* Nombre */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="reg-name">Nombre completo</label>
        <input
          id="reg-name" type="text" autoComplete="name"
          placeholder="Juan Pérez"
          className={`auth-input ${errors.name ? 'error' : ''}`}
          {...register('name')}
        />
        {errors.name && <span className="auth-error-msg">{errors.name.message}</span>}
      </div>

      {/* Email */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="reg-email">Correo electrónico</label>
        <input
          id="reg-email" type="email" autoComplete="email"
          placeholder="usuario@cges.gov.co"
          className={`auth-input ${errors.email ? 'error' : ''}`}
          {...register('email')}
        />
        {errors.email && <span className="auth-error-msg">{errors.email.message}</span>}
      </div>

      {/* Contraseña */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="reg-pass">Contraseña</label>
        <div style={{ position:'relative' }}>
          <input
            id="reg-pass"
            type={showPass ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            className={`auth-input ${errors.password ? 'error' : ''}`}
            style={{ paddingRight:44 }}
            {...register('password')}
          />
          <button
            type="button" onClick={() => setShowPass((v) => !v)}
            style={{
              position:'absolute', right:12, top:'50%',
              transform:'translateY(-50%)', background:'none',
              border:'none', color:'#4A6078', cursor:'pointer', padding:4, fontSize:16,
            }}
          >
            {showPass ? '🙈' : '👁'}
          </button>
        </div>
        <PasswordStrength password={passwordVal} />
        {errors.password && <span className="auth-error-msg">{errors.password.message}</span>}
      </div>

      {/* Confirmar */}
      <div className="auth-field">
        <label className="auth-label" htmlFor="reg-confirm">Confirmar contraseña</label>
        <input
          id="reg-confirm"
          type={showPass ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          className={`auth-input ${errors.confirm ? 'error' : ''}`}
          {...register('confirm')}
        />
        {errors.confirm && <span className="auth-error-msg">{errors.confirm.message}</span>}
      </div>

      <button type="submit" className="auth-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>

      <p style={{ textAlign:'center', fontSize:13, color:'#4A6078' }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/auth/login" style={{ color:'#1A7FBF', textDecoration:'none' }}>
          Iniciar sesión
        </Link>
      </p>
    </form>
  )
}
