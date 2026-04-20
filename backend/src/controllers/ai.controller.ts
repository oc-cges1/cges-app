// src/controllers/ai.controller.ts

import { Response, NextFunction } from 'express'
import { AuthRequest }            from '../middlewares/auth.middleware'
import * as AiService             from '../services/ai.service'
import * as FilesService          from '../services/files.service'

export async function askQuestion(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  try {
    const { question, fileId, history = [] } = req.body

    if (!question?.trim()) {
      res.status(400).json({ success: false, message: 'La pregunta es requerida.' })
      return
    }

    let answer: string

    if (fileId) {
      // Modo: chat con documento
      const file = await FilesService.getFileById(fileId)

      if (!file.extractedText) {
        res.status(422).json({
          success: false,
          message: 'Este archivo no tiene texto extraído. Solo PDF es compatible actualmente.',
        })
        return
      }

      answer = await AiService.askWithDocument(question, file.extractedText, history)
    } else {
      // Modo: pregunta libre
      answer = await AiService.askAI(question, history)
    }

    res.json({ success: true, data: { answer, question } })
  } catch (err) { next(err) }
}