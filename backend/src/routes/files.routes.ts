// src/routes/files.routes.ts

import { Router }          from 'express'
import * as FilesCtrl      from '../controllers/files.controller'
import { authMiddleware }  from '../middlewares/auth.middleware'
import { authorizeRoles }  from '../middlewares/authorize.middleware'
import { upload }          from '../config/storage'

const router = Router()

// POST /files/upload — solo ADMIN y OPERATOR
router.post(
  '/upload',
  authMiddleware,
  authorizeRoles('ADMIN', 'OPERATOR'),
  upload.single('file'),
  FilesCtrl.uploadFile
)

// GET /files — cualquier usuario autenticado
router.get(
  '/',
  authMiddleware,
  FilesCtrl.getFiles
)

// DELETE /files/:id — solo ADMIN
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  FilesCtrl.deleteFile
)

export default router