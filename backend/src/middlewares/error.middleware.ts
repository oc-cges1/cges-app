// src/middlewares/error.middleware.ts

import { Request, Response, NextFunction } from 'express'
import { env }                             from '../config/env'

interface AppError {
  status?:  number
  message?: string
  stack?:   string
}

export function errorHandler(
  err:  AppError,
  req:  Request,
  res:  Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const status  = err.status  ?? 500
  const message = err.message ?? 'Error interno del servidor.'

  const response: Record<string, unknown> = { success: false, message }
  if (env.NODE_ENV === 'development') response.stack = err.stack

  console.error(`[${new Date().toISOString()}] ${status} — ${message}`)
  res.status(status).json(response)
}
