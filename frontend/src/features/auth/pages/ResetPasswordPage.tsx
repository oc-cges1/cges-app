// src/features/auth/pages/ResetPasswordPage.tsx

import AuthLayout        from './AuthLayout'
import ResetPasswordForm from '../components/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Nueva Contraseña"
      subtitle="Elige una contraseña segura para tu cuenta"
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
