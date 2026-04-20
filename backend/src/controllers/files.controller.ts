// src/controllers/files.controller.ts

import { Response, NextFunction } from 'express'
import { AuthRequest }            from '../middlewares/auth.middleware'
import * as FilesService          from '../services/files.service'

export async function uploadFile(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No se recibió ningún archivo.' })
      return
    }
    const record = await FilesService.saveFile(req.file, req.user!.userId)
    res.status(201).json({ success: true, data: record })
  } catch (err) { next(err) }
}

export async function getFiles(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  try {
    const page  = parseInt(req.query.page  as string || '1',  10)
    const limit = parseInt(req.query.limit as string || '20', 10)
    const data  = await FilesService.listFiles(page, limit)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function deleteFile(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  try {
    const result = await FilesService.deleteFile(req.params.id)
    res.json({ success: true, ...result })
  } catch (err) { next(err) }
}