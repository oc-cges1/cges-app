// src/features/documents/api.ts

import { apiClient }              from '@/features/auth/api'
import type { FilesResponse, ChatMessage } from './types'

export async function uploadFile(file: File): Promise<void> {
  const form = new FormData()
  form.append('file', file)
  await apiClient.post('/files/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function fetchFiles(page = 1): Promise<FilesResponse> {
  const res = await apiClient.get<{ data: FilesResponse }>(`/files?page=${page}`)
  return res.data.data
}

export async function deleteFile(id: string): Promise<void> {
  await apiClient.delete(`/files/${id}`)
}

export async function askAI(
  question: string,
  fileId?:  string,
  history?: ChatMessage[]
): Promise<string> {
  const payload = {
    question,
    fileId: fileId || undefined,
    history: (history ?? []).slice(-10).map(m => ({
      role:    m.role,
      content: m.content,
    })),
  }
  const res = await apiClient.post<{ data: { answer: string } }>('/ai/ask', payload)
  return res.data.data.answer
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** URL para vista previa (iframe/img) */
export function getFilePreviewUrl(storedName: string): string {
  const base = import.meta.env.VITE_API_URL || ''
  return `${base}/uploads/${storedName}`
}

/** URL para descarga forzada */
export function getFileDownloadUrl(storedName: string): string {
  const base = import.meta.env.VITE_API_URL || ''
  return `${base}/uploads/${storedName}`
}