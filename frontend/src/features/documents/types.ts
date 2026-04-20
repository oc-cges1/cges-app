// src/features/documents/types.ts

export interface FileRecord {
  id:           string
  originalName: string
  mimeType:     string
  size:         number
  createdAt:    string
  uploadedBy:   { name: string; email: string }
}

export interface FilesResponse {
  files: FileRecord[]
  total: number
  page:  number
  pages: number
}

export interface ChatMessage {
  id:      string
  role:    'user' | 'assistant'
  content: string
  ts:      number
}
// src/features/documents/types.ts
export interface FileRecord {
  id:           string
  originalName: string
  storedName:   string    // ← agregar este campo
  mimeType:     string
  size:         number
  createdAt:    string
  uploadedBy:   { name: string; email: string }
}