// src/features/news/hooks/useNews.ts

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchNews, fetchUltimaHora, fetchCategories } from '../api'
import type { NewsArticle, Category }                  from '../types'

export function useNews() {
  const [articles,   setArticles]   = useState<NewsArticle[]>([])
  const [ultima,     setUltima]     = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)
  const [loadingMore,setLoadingMore]= useState(false)
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [pages,      setPages]      = useState(1)
  const [category,   setCategory]   = useState('Todas')
  const [search,     setSearch]     = useState('')
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  const load = useCallback(async (p: number, cat: string, q: string, append = false) => {
    if (p === 1) setLoading(true)
    else         setLoadingMore(true)
    try {
      const data = await fetchNews({ page: p, limit: 24, category: cat, search: q })
      setArticles(prev => append ? [...prev, ...data.articles] : data.articles)
      setTotal(data.total)
      setPages(data.pages)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchUltimaHora().then(setUltima).catch(() => {})
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setPage(1)
    load(1, category, search)
  }, [category, load])

  const handleSearch = useCallback((q: string) => {
    setSearch(q)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setPage(1)
      load(1, category, q)
    }, 400)
  }, [category, load])

  const loadMore = useCallback(() => {
    if (page < pages && !loadingMore) {
      const next = page + 1
      setPage(next)
      load(next, category, search, true)
    }
  }, [page, pages, loadingMore, category, search, load])

  return {
    articles, ultima, categories, loading, loadingMore,
    total, page, pages, category, search,
    setCategory, handleSearch, loadMore, reload: () => load(1, category, search),
  }
}