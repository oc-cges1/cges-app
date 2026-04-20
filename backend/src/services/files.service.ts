// src/services/files.service.ts

import fs                       from 'fs'
import path                     from 'path'
import { prisma }               from '../config/database'
import { extractTextFromFile }  from './pdf.service'
import { logger }               from '../utils/logger'
import { UPLOAD_PATH }          from '../config/storage'

// ── Guardar archivo en BD y extraer texto ─────────────────────

export async function saveFile(
  file:       Express.Multer.File,
  uploaderId: string
) {
  // Extraer texto en background (no bloquea la respuesta)
  let extractedText: string | undefined

  try {
    extractedText = await extractTextFromFile(file.path, file.mimetype)
  } catch (err) {
    logger.warn({ event: 'TEXT_EXTRACTION_WARN', file: file.filename, error: String(err) })
  }

  const record = await prisma.file.create({
    data: {
      originalName:  file.originalname,
      storedName:    file.filename,
      mimeType:      file.mimetype,
      size:          file.size,
      path:          file.path,
      extractedText: extractedText ?? null,
      uploadedById:  uploaderId,
    },
    select: {
      id: true, originalName: true, mimeType: true,
      size: true, createdAt: true,
      uploadedBy: { select: { name: true, email: true } },
    },
  })

  logger.info({ event: 'FILE_UPLOADED', fileId: record.id, uploader: uploaderId })
  return record
}

// ── Listar archivos ───────────────────────────────────────────

export async function listFiles(page = 1, limit = 20) {
  const [files, total] = await Promise.all([
    prisma.file.findMany({
      skip:    (page - 1) * limit,
      take:    limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, originalName: true, mimeType: true,
        size: true, createdAt: true,
        uploadedBy: { select: { name: true, email: true } },
      },
    }),
    prisma.file.count(),
  ])
  return { files, total, page, pages: Math.ceil(total / limit) }
}

// ── Obtener archivo por ID (con texto extraído) ───────────────

export async function getFileById(id: string) {
  const file = await prisma.file.findUnique({ where: { id } })
  if (!file) throw { status: 404, message: 'Archivo no encontrado.' }
  return file
}

// ── Eliminar archivo ──────────────────────────────────────────

export async function deleteFile(id: string) {
  const file = await prisma.file.findUnique({ where: { id } })
  if (!file) throw { status: 404, message: 'Archivo no encontrado.' }

  // Borrar del disco
  const fullPath = path.resolve(UPLOAD_PATH, file.storedName)
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }

  await prisma.file.delete({ where: { id } })
  logger.info({ event: 'FILE_DELETED', fileId: id })
  return { message: 'Archivo eliminado correctamente.' }
}