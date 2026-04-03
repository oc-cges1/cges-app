// src/features/auth/pages/LoginPage.tsx

import AuthLayout from './AuthLayout'
import LoginForm  from '../components/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Sistema Departamental de Seguridad — CGES"
    >
      <LoginForm />
    </AuthLayout>
  )
}
