// src/config/env.ts
// Valida variables de entorno al arrancar.
// Si falta alguna crítica, el proceso termina antes de aceptar conexiones.

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV:             z.enum(['development', 'production', 'test']).default('development'),
  PORT:                 z.string().default('4000'),
  FRONTEND_URL:         z.string().url(),
  DATABASE_URL:         z.string().min(1),
  JWT_ACCESS_SECRET:    z.string().min(32),
  JWT_REFRESH_SECRET:   z.string().min(32),
  JWT_ACCESS_EXPIRES:   z.string().default('15m'),
  JWT_REFRESH_EXPIRES:  z.string().default('7d'),
  BCRYPT_ROUNDS:        z.string().default('12'),
  SMTP_HOST:            z.string().optional(),
  SMTP_PORT:            z.string().optional(),
  SMTP_USER:            z.string().optional(),
  SMTP_PASS:            z.string().optional(),
  EMAIL_FROM:           z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX:       z.string().default('100'),
  ANTHROPIC_API_KEY:    z.string().min(1),
  MAX_FILE_SIZE_MB:     z.string().default('10'),
  UPLOAD_DIR:           z.string().default('uploads'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
