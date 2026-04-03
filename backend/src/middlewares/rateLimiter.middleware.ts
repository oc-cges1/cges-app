// src/middlewares/rateLimiter.middleware.ts

import rateLimit from 'express-rate-limit'
import { env }   from '../config/env'

export const generalLimiter = rateLimit({
  windowMs:        parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
  max:             parseInt(env.RATE_LIMIT_MAX, 10),
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { success: false, message: 'Demasiadas peticiones. Intente más tarde.' },
})

export const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { success: false, message: 'Demasiados intentos de acceso. Espere 15 minutos.' },
})
