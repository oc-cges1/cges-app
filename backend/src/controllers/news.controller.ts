// src/controllers/news.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as NewsService from '../services/news.service'

export async function listNews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page     = parseInt(req.query.page     as string || '1',  10)
    const limit    = parseInt(req.query.limit    as string || '20', 10)
    const category = req.query.category as string | undefined
    const search   = req.query.search   as string | undefined
    const urgent   = req.query.urgent   === 'true'

    const data = await NewsService.getNews({ page, limit, category, search, urgent })
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function refreshNews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const count = await NewsService.fetchAndStoreNews()
    res.json({ success: true, message: `${count} noticias actualizadas.` })
  } catch (err) { next(err) }
}

export async function ultimaHora(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await NewsService.getUltimaHora()
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function categories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await NewsService.getCategories()
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export async function featured(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await NewsService.getFeaturedNews()
    res.json({ success: true, data })
  } catch (err) { next(err) }
}