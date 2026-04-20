// src/config/storage.ts

import multer, { FileFilterCallback } from 'multer'
import path                           from 'path'
import fs                             from 'fs'
import { Request }                    from 'express'
import { env }                        from './env'

// Crear carpeta uploads si no existe
const UPLOAD_DIR = path.resolve(process.cwd(), env.UPLOAD_DIR ?? 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

const MAX_SIZE_BYTES = (parseInt(env.MAX_FILE_SIZE_MB ?? '10', 10)) * 1024 * 1024

// Almacenamiento en disco con nombre único
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
    const ext    = path.extname(file.originalname).toLowerCase()
    cb(null, `${unique}${ext}`)
  },
})

// Filtro de tipo de archivo
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb:   FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo PDF, PPT y PPTX.'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
})

export const UPLOAD_PATH = UPLOAD_DIR