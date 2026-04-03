// src/features/auth/pages/ForgotPasswordPage.tsx

import AuthLayout         from './AuthLayout'
import ForgotPasswordForm from '../components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Recibirás un enlace en tu correo institucional"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
