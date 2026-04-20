// src/middlewares/authorize.middleware.ts
// RBAC — uso: router.post('/upload', authMiddleware, authorizeRoles('ADMIN', 'EDITOR'), ...)

import { Response, NextFunction } from 'express'
import { AuthRequest }            from './auth.middleware'
import { logger }                 from '../utils/logger'

export function authorizeRoles(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role

    if (!userRole || !roles.includes(userRole)) {
      // Log de intento de acceso no autorizado
      logger.warn({
        event:    'UNAUTHORIZED_ACCESS',
        userId:   req.user?.userId ?? 'anonymous',
        email:    req.user?.email  ?? 'unknown',
        role:     userRole         ?? 'none',
        required: roles,
        path:     req.path,
        method:   req.method,
        ip:       req.ip,
        timestamp:new Date().toISOString(),
      })

      res.status(403).json({
        success: false,
        message: 'Acceso denegado. No tienes permisos para esta acción.',
        required: roles,
      })
      return
    }

    next()
  }
}