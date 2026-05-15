// src/features/news/types.ts

export interface NewsArticle {
  id:          string
  title:       string
  summary:     string | null
  url:         string
  imageUrl:    string | null
  source:      string
  sourceUrl:   string | null
  category:    string
  publishedAt: string
  isUrgent:    boolean
  isFeatured:  boolean
  fetchedAt:   string
}

export interface NewsResponse {
  articles: NewsArticle[]
  total:    number
  page:     number
  pages:    number
}

export interface Category {
  name:  string
  count: number
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Terrorismo':      '#CC2B2B',
  'ELN':             '#8B1A1A',
  'FARC':            '#6B1A1A',
  'Narcotráfico':    '#7B3FCC',
  'Clan del Golfo':  '#CC6B1A',
  'Orden Público':   '#1A7FBF',
  'Fuerza Pública':  '#1E8C4A',
  'Conflicto Armado':'#C4940A',
  'Seguridad':       '#0A8FA8',
  'Verificación':    '#4A6078',
  'General':         '#4A6078',
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  <  1) return 'Ahora mismo'
  if (mins  < 60) return `Hace ${mins} min`
  if (hours < 24) return `Hace ${hours}h`
  if (days  <  7) return `Hace ${days}d`
  return new Date(dateStr).toLocaleDateString('es-CO', { day:'2-digit', month:'short' })
}