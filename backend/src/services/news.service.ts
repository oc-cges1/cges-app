// src/services/news.service.ts

import { prisma }  from '../config/database'
import { logger }  from '../utils/logger'
import { Prisma } from '@prisma/client'

// ── Fuentes RSS ───────────────────────────────────────────────
export const RSS_SOURCES = [
  {
    name:     'El Tiempo',
    url:      'https://www.eltiempo.com/rss/colombia.xml',
    category: 'General',
    sourceUrl:'https://eltiempo.com',
  },
  {
    name:     'Caracol Radio',
    url:      'https://caracol.com.co/rss/noticias/',
    category: 'Orden Público',
    sourceUrl:'https://caracol.com.co',
  },
  {
    name:     'Blu Radio',
    url:      'https://www.bluradio.com/rss.xml',
    category: 'Seguridad',
    sourceUrl:'https://bluradio.com',
  },
  {
    name:     'InSight Crime',
    url:      'https://insightcrime.org/feed/',
    category: 'Conflicto Armado',
    sourceUrl:'https://insightcrime.org',
  },
  {
    name:     'RCN Radio',
    url:      'https://www.rcnradio.com/feed',
    category: 'General',
    sourceUrl:'https://rcnradio.com',
  },
  {
    name:     'La FM',
    url:      'https://www.lafm.com.co/feed',
    category: 'Seguridad',
    sourceUrl:'https://lafm.com.co',
  },
  {
    name:     'Colombia Check',
    url:      'https://colombiacheck.com/feed',
    category: 'Verificación',
    sourceUrl:'https://colombiacheck.com',
  },
  {
    name:     'Verdad Abierta',
    url:      'https://verdadabierta.com/feed/',
    category: 'Conflicto Armado',
    sourceUrl:'https://verdadabierta.com',
  },
]

// ── Keywords para detectar categorías ────────────────────────
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Terrorismo':      ['terrorismo','terrorista','bomba','atentado','explosivo'],
  'ELN':             ['eln','ejército liberación','liberacion nacional'],
  'FARC':            ['farc','disidencia','disidentes','estado mayor'],
  'Narcotráfico':    ['narcotráfico','coca','droga','cocaína','cartel','narco'],
  'Clan del Golfo':  ['clan del golfo','gaitanistas','autodefensas gaitanistas'],
  'Orden Público':   ['orden público','disturbio','protesta','bloqueo','paro'],
  'Fuerza Pública':  ['policía','ejército','armada','fuerza aérea','militar'],
  'Conflicto Armado':['conflicto','guerrilla','combate','enfrentamiento','mina antipersona'],
  'Seguridad':       ['seguridad','crimen','homicidio','secuestro','extorsión'],
}

function detectCategory(title: string, summary: string, defaultCat: string): string {
  const text = `${title} ${summary}`.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) return cat
  }
  return defaultCat
}

function isUrgent(publishedAt: Date): boolean {
  const hoursAgo = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60)
  return hoursAgo < 2
}

// ── Parse RSS manualmente (sin dependencias extra) ────────────
function parseRSS(xml: string, source: typeof RSS_SOURCES[0]): Omit<Parameters<typeof prisma.newsArticle.upsert>[0]['create'], never>[] {
  const items: ReturnType<typeof parseRSS> = []
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g)

  for (const match of itemMatches) {
    const item = match[1]

    const title   = decodeEntities(extractTag(item, 'title'))
    const url     = extractTag(item, 'link') || extractTag(item, 'guid')
    const summary = decodeEntities(stripHtml(extractTag(item, 'description') || extractTag(item, 'content:encoded') || ''))
    const pubDate = extractTag(item, 'pubDate') || extractTag(item, 'dc:date')
    const imageUrl= extractImage(item)

    if (!title || !url) continue

    const publishedAt = pubDate ? new Date(pubDate) : new Date()
    if (isNaN(publishedAt.getTime())) continue

    const category = detectCategory(title, summary, source.category)

    items.push({
      id:          '',
      title:       title.slice(0, 500),
      summary:     summary.slice(0, 1000),
      url:         url.trim(),
      imageUrl:    imageUrl || null,
      source:      source.name,
      sourceUrl:   source.sourceUrl,
      category,
      publishedAt,
      isUrgent:    isUrgent(publishedAt),
      isFeatured:  false,
      fetchedAt:   new Date(),
      createdAt:   new Date(),
      updatedAt:   new Date(),
    })
  }

  return items.slice(0, 20) // máximo 20 por fuente
}

function extractTag(xml: string, tag: string): string {
  const patterns = [
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i'),
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'),
    new RegExp(`<${tag}[^>]*/?>([\\s\\S]*?)`, 'i'),
  ]
  for (const p of patterns) {
    const m = xml.match(p)
    if (m?.[1]) return m[1].trim()
  }
  return ''
}

function extractImage(item: string): string | null {
  const patterns = [
    /enclosure[^>]+url="([^"]+\.(jpg|jpeg|png|webp))"/i,
    /media:content[^>]+url="([^"]+)"/i,
    /media:thumbnail[^>]+url="([^"]+)"/i,
    /<img[^>]+src="([^"]+\.(jpg|jpeg|png|webp))"/i,
    /og:image[^>]+content="([^"]+)"/i,
  ]
  for (const p of patterns) {
    const m = item.match(p)
    if (m?.[1] && m[1].startsWith('http')) return m[1]
  }
  return null
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
}

// ── Cache en memoria ──────────────────────────────────────────
let lastFetch = 0
const CACHE_TTL = 15 * 60 * 1000 // 15 minutos

// ── Fetch y guardar noticias ──────────────────────────────────
export async function fetchAndStoreNews(): Promise<number> {
  console.log(prisma.newsArticle)
  let total = 0

  for (const source of RSS_SOURCES) {
    try {
      const controller = new AbortController()
      const timeout    = setTimeout(() => controller.abort(), 8000)

      const res = await fetch(source.url, {
        signal:  controller.signal,
        headers: {
          'User-Agent': 'CGES-SISDEP/1.0 NewsAggregator',
          'Accept':     'application/rss+xml, application/xml, text/xml',
        },
      })
      clearTimeout(timeout)

      if (!res.ok) {
        logger.warn({ event: 'RSS_FETCH_FAILED', source: source.name, status: res.status })
        continue
      }

      const xml   = await res.text()
      const items = parseRSS(xml, source)

      for (const item of items) {
        try {
          await prisma.newsArticle.upsert({
            where:  { url: item.url },
            update: {
              title:       item.title,
              summary:     item.summary,
              imageUrl:    item.imageUrl,
              isUrgent:    item.isUrgent,
              category:    item.category,
              fetchedAt:   new Date(),
              updatedAt:   new Date(),
            },
            create: {
              title:       item.title,
              summary:     item.summary,
              url:         item.url,
              imageUrl:    item.imageUrl,
              source:      item.source,
              sourceUrl:   item.sourceUrl,
              category:    item.category,
              publishedAt: item.publishedAt,
              isUrgent:    item.isUrgent,
              isFeatured:  false,
              fetchedAt:   new Date(),
            },
          })
          total++
        } catch {
          // URL duplicada u otro error — continuar
        }
      }

      logger.info({ event: 'RSS_FETCHED', source: source.name, items: items.length })
    } catch (err) {
      logger.warn({ event: 'RSS_ERROR', source: source.name, error: String(err) })
    }
  }

  lastFetch = Date.now()
  return total
}

// ── Obtener noticias ──────────────────────────────────────────
export async function getNews(opts: {
  page?:     number
  limit?:    number
  category?: string
  search?:   string
  urgent?:   boolean
}) {
  const { page = 1, limit = 20, category, search, urgent } = opts

  // Refrescar si el cache expiró
  if (Date.now() - lastFetch > CACHE_TTL) {
    fetchAndStoreNews().catch(err =>
      logger.warn({ event: 'BACKGROUND_FETCH_ERROR', error: String(err) })
    )
  }



const where: Prisma.NewsArticleWhereInput = {}

if (category && category !== 'Todas') {
  where.category = category
}

if (urgent) {
  where.isUrgent = true
}

if (search) {
  where.OR = [
    {
      title: {
        contains: search,
        mode: 'insensitive',
      },
    },
    {
      summary: {
        contains: search,
        mode: 'insensitive',
      },
    },
  ]
}
  const [articles, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip:    (page - 1) * limit,
      take:    limit,
      select: {
        id: true, title: true, summary: true, url: true,
        imageUrl: true, source: true, sourceUrl: true,
        category: true, publishedAt: true, isUrgent: true,
        isFeatured: true, fetchedAt: true,
      },
    }),
    prisma.newsArticle.count({ where }),
  ])

  return { articles, total, page, pages: Math.ceil(total / limit) }
}

export async function getFeaturedNews() {
  return prisma.newsArticle.findMany({
    where:   { isFeatured: true },
    orderBy: { publishedAt: 'desc' },
    take:    5,
  })
}

export async function getUltimaHora() {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
  return prisma.newsArticle.findMany({
    where:   { publishedAt: { gte: twoHoursAgo } },
    orderBy: { publishedAt: 'desc' },
    take:    10,
    select:  { id: true, title: true, source: true, publishedAt: true, category: true, url: true, isUrgent: true },
  })
}

export async function getCategories() {
  const result = await prisma.newsArticle.groupBy({
    by:      ['category'],
    _count:  { category: true },
    orderBy: { _count: { category: 'desc' } },
  })
  return result.map(r => ({ name: r.category, count: r._count.category }))
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_KEYWORDS).concat(['General', 'Verificación'])