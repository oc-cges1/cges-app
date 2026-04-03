// src/routes/auth.routes.ts

import { Router }         from 'express'
import { body }           from 'express-validator'
import * as AuthCtrl      from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { authLimiter }    from '../middlewares/rateLimiter.middleware'
import { validate }       from '../middlewares/validate.middleware'

const router = Router()

const passwordRules = body('password')
  .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
  .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
  .matches(/[0-9]/).withMessage('Debe contener al menos un número')
  .matches(/[^A-Za-z0-9]/).withMessage('Debe contener al menos un símbolo')

router.post('/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    passwordRules,
  ],
  validate,
  AuthCtrl.register
)

router.post('/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  AuthCtrl.login
)

router.post('/refresh', AuthCtrl.refresh)
router.post('/logout',  authMiddleware, AuthCtrl.logout)
router.get('/profile',  authMiddleware, AuthCtrl.getProfile)

router.post('/forgot-password',
  authLimiter,
  [body('email').isEmail().normalizeEmail()],
  validate,
  AuthCtrl.forgotPassword
)

router.post('/reset-password',
  [body('token').notEmpty(), passwordRules],
  validate,
  AuthCtrl.resetPassword
)

router.get('/verify-email', AuthCtrl.verifyEmail)

export default router
