// src/features/news/api.ts

import { apiClient }              from '@/features/auth/api'
import type { NewsResponse, NewsArticle, Category } from './types'

export async function fetchNews(params: {
  page?:     number
  limit?:    number
  category?: string
  search?:   string
  urgent?:   boolean
}): Promise<NewsResponse> {
  const p = new URLSearchParams()
  if (params.page)     p.set('page',     String(params.page))
  if (params.limit)    p.set('limit',    String(params.limit))
  if (params.category && params.category !== 'Todas') p.set('category', params.category)
  if (params.search)   p.set('search',   params.search)
  if (params.urgent)   p.set('urgent',   'true')
  const res = await apiClient.get<{ data: NewsResponse }>(`/news?${p}`)
  return res.data.data
}

export async function fetchUltimaHora(): Promise<NewsArticle[]> {
  const res = await apiClient.get<{ data: NewsArticle[] }>('/news/ultima-hora')
  return res.data.data
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiClient.get<{ data: Category[] }>('/news/categories')
  return res.data.data
}

export async function fetchFeatured(): Promise<NewsArticle[]> {
  const res = await apiClient.get<{ data: NewsArticle[] }>('/news/featured')
  return res.data.data
}

export async function refreshNews(): Promise<void> {
  await apiClient.post('/news/refresh')
}