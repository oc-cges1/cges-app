// src/features/auth/pages/RegisterPage.tsx

import AuthLayout    from './AuthLayout'
import RegisterForm  from '../components/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Acceso al Sistema Departamental de Seguridad"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
