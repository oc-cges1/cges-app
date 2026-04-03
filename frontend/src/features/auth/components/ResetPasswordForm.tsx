// src/features/auth/components/ResetPasswordForm.tsx

import { useState }                              from 'react'
import { useForm }                               from 'react-hook-form'
import { zodResolver }                           from '@hookform/resolvers/zod'
import { z }                                     from 'zod'
import { Link, useSearchParams, useNavigate }    from 'react-router-dom'
import { apiResetPassword, extractErrorMessage } from '../api'

const schema = z.object({
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

export default function ResetPasswordForm() {
  const [params]                  = useSearchParams()
  const navigate                  = useNavigate()
  const token                     = params.get('token') ?? ''
  const [serverErr, setServerErr] = useState('')
  const [success,   setSuccess]   = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (!token) {
    return (
      <div style={{ textAlign:'center', padding:'32px 0' }}>
        <p style={{ color:'#e87878', fontSize:14, marginBottom:16 }}>
          Token de recuperación inválido o expirado.
        </p>
        <Link to="/auth/forgot-password" style={{ color:'#1A7FBF', fontSize:13 }}>
          Solicitar nuevo enlace
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div style={{ textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:44, marginBottom:16 }}>✅</div>
        <h3 style={{
          fontFamily:'Rajdhani, Arial Narrow, sans-serif',
          fontSize:20, color:'#14B45A', marginBottom:8,
        }}>Contraseña actualizada</h3>
        <p style={{ color:'#7A8FA6', fontSize:13, marginBottom:20 }}>
          Ya puedes iniciar sesión con tu nueva contraseña.
        </p>
        <button
          onClick={() => navigate('/auth/login')}
          className="auth-btn"
          style={{ maxWidth:240, margin:'0 auto' }}
        >
          Ir al inicio de sesión
        </button>
      </div>
    )
  }

  const onSubmit = async (data: FormData) => {
    setServerErr('')
    try {
      await apiResetPassword(token, data.password)
      setSuccess(true)
    } catch (err) {
      setServerErr(extractErrorMessage(err))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate
      style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {serverErr && (
        <div style={{
          padding:'10px 14px', background:'rgba(204,43,43,0.1)',
          border:'1px solid rgba(204,43,43,0.25)',
          borderRadius:6, fontSize:13, color:'#e87878',
        }}>
          {serverErr}
        </div>
      )}

      <div className="auth-field">
        <label className="auth-label" htmlFor="reset-pass">Nueva contraseña</label>
        <input
          id="reset-pass" type="password" autoComplete="new-password"
          placeholder="••••••••"
          className={`auth-input ${errors.password ? 'error' : ''}`}
          {...register('password')}
        />
        {errors.password && <span className="auth-error-msg">{errors.password.message}</span>}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="reset-confirm">Confirmar contraseña</label>
        <input
          id="reset-confirm" type="password" autoComplete="new-password"
          placeholder="••••••••"
          className={`auth-input ${errors.confirm ? 'error' : ''}`}
          {...register('confirm')}
        />
        {errors.confirm && <span className="auth-error-msg">{errors.confirm.message}</span>}
      </div>

      <button type="submit" className="auth-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
      </button>
    </form>
  )
}
