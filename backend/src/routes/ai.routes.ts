// src/routes/ai.routes.ts

import { Router }         from 'express'
import * as AiCtrl        from '../controllers/ai.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { body }           from 'express-validator'
import { validate }       from '../middlewares/validate.middleware'

const router = Router()

router.post(
  '/ask',
  authMiddleware,
  [
    body('question').trim().notEmpty().withMessage('La pregunta es requerida.'),
    body('fileId').optional().isUUID().withMessage('fileId inválido.'),
    body('history').optional().isArray(),
  ],
  validate,
  AiCtrl.askQuestion
)

export default router