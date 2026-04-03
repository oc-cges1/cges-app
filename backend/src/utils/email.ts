// src/utils/email.ts

import nodemailer from 'nodemailer'
import { env }    from '../config/env'

const transporter = nodemailer.createTransport({
  host:   env.SMTP_HOST,
  port:   Number(env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(
  to:    string,
  token: string
): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/auth/reset-password?token=${token}`
  await transporter.sendMail({
    from:    env.EMAIL_FROM,
    to,
    subject: 'Recuperación de contraseña — CGES SISDEP',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#f9f9f9;padding:32px;border-radius:8px;">
        <h2 style="color:#1A7FBF;margin-bottom:16px;">CGES — Sistema Departamental de Seguridad</h2>
        <p style="color:#333;margin-bottom:12px;">Has solicitado restablecer tu contraseña.</p>
        <p style="color:#333;margin-bottom:24px;">Haz clic en el siguiente enlace. Expira en <strong>1 hora</strong>.</p>
        <a href="${resetUrl}"
          style="display:inline-block;padding:12px 28px;background:#1A7FBF;color:#fff;
                 text-decoration:none;border-radius:6px;font-weight:600;">
          Restablecer contraseña
        </a>
        <p style="color:#888;font-size:12px;margin-top:24px;">
          Si no solicitaste esto, ignora este mensaje.
        </p>
      </div>
    `,
  })
}

export async function sendVerificationEmail(
  to:    string,
  token: string
): Promise<void> {
  const verifyUrl = `${env.FRONTEND_URL}/auth/verify-email?token=${token}`
  await transporter.sendMail({
    from:    env.EMAIL_FROM,
    to,
    subject: 'Verifica tu correo — CGES SISDEP',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#f9f9f9;padding:32px;border-radius:8px;">
        <h2 style="color:#1A7FBF;margin-bottom:16px;">Verifica tu correo electrónico</h2>
        <p style="color:#333;margin-bottom:24px;">Gracias por registrarte en el Sistema Departamental de Seguridad.</p>
        <a href="${verifyUrl}"
          style="display:inline-block;padding:12px 28px;background:#1A7FBF;color:#fff;
                 text-decoration:none;border-radius:6px;font-weight:600;">
          Verificar correo
        </a>
        <p style="color:#888;font-size:12px;margin-top:24px;">Este enlace expira en 24 horas.</p>
      </div>
    `,
  })
}
