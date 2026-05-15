// src/routes/news.routes.ts

import { Router }         from 'express'
import * as NewsCtrl      from '../controllers/news.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// Todas las rutas requieren autenticación
router.use(authMiddleware)

router.get('/',            NewsCtrl.listNews)
router.get('/ultima-hora', NewsCtrl.ultimaHora)
router.get('/categories',  NewsCtrl.categories)
router.get('/featured',    NewsCtrl.featured)
router.post('/refresh',    NewsCtrl.refreshNews)

export default router