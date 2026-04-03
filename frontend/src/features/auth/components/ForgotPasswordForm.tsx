// src/features/auth/components/ForgotPasswordForm.tsx

import { useState }    from 'react'
import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }           from 'zod'
import { Link }        from 'react-router-dom'
import { apiForgotPassword, extractErrorMessage } from '../api'

const schema = z.object({
  email: z.string().email('Email inválido'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordForm() {
  const [sent,      setSent]      = useState(false)
  const [serverErr, setServerErr] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerErr('')
    try {
      await apiForgotPassword(data.email)
      setSent(true)
    } catch (err) {
      setServerErr(extractErrorMessage(err))
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:44, marginBottom:16 }}>📧</div>
        <h3 style={{
          fontFamily:'Rajdhani, Arial Narrow, sans-serif',
          fontSize:20, color:'#E8EDF2', marginBottom:8,
        }}>Revisa tu correo</h3>
        <p style={{ color:'#7A8FA6', fontSize:13, lineHeight:1.6, marginBottom:20 }}>
          Si el correo existe en el sistema, recibirás instrucciones
          para restablecer tu contraseña.
        </p>
        <Link to="/auth/login" style={{ color:'#1A7FBF', fontSize:13 }}>
          ← Volver al inicio de sesión
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate
      style={{ display:'flex', flexDirection:'column', gap:20 }}>

      <p style={{ color:'#7A8FA6', fontSize:13, lineHeight:1.6 }}>
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

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
        <label className="auth-label" htmlFor="forgot-email">Correo electrónico</label>
        <input
          id="forgot-email" type="email" autoComplete="email"
          placeholder="usuario@cges.gov.co"
          className={`auth-input ${errors.email ? 'error' : ''}`}
          {...register('email')}
        />
        {errors.email && <span className="auth-error-msg">{errors.email.message}</span>}
      </div>

      <button type="submit" className="auth-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
      </button>

      <p style={{ textAlign:'center', fontSize:13 }}>
        <Link to="/auth/login" style={{ color:'#1A7FBF', textDecoration:'none' }}>
          ← Volver al inicio de sesión
        </Link>
      </p>
    </form>
  )
}
