// src/services/pdf.service.ts

import fs          from 'fs'
import path        from 'path'
import * as pdf from 'pdf-parse'
import { logger }  from '../utils/logger'

const CHUNK_SIZE    = 3000   // caracteres por chunk
const CHUNK_OVERLAP = 200    // solapamiento entre chunks

export interface TextChunk {
  index:   number
  content: string
  chars:   number
}

// ── Extracción de texto ───────────────────────────────────────

export async function extractTextFromFile(
  filePath: string,
  mimeType: string
): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      return await extractFromPDF(filePath)
    }
    // PPT/PPTX: extracción básica — texto plano
    // Para extracción avanzada de PPTX se puede usar libreoffice-convert
    return '[Extracción de texto para PPT/PPTX requiere procesamiento adicional]'
  } catch (err) {
    logger.error({ event: 'TEXT_EXTRACTION_FAILED', filePath, error: String(err) })
    return ''
  }
}

async function extractFromPDF(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath)
  const parsePdf = (pdf as any).default || pdf
  const data = await parsePdf(buffer)
  return data.text.trim()
}

// ── Chunking — divide texto largo para IA ─────────────────────

export function chunkText(text: string): TextChunk[] {
  if (!text || text.length === 0) return []

  const chunks: TextChunk[] = []
  let   start  = 0
  let   index  = 0

  while (start < text.length) {
    const end     = Math.min(start + CHUNK_SIZE, text.length)
    const content = text.slice(start, end).trim()

    if (content.length > 0) {
      chunks.push({ index, content, chars: content.length })
      index++
    }

    start = end - CHUNK_OVERLAP
    if (start >= text.length) break
  }

  return chunks
}

// ── Selección de chunks relevantes para una pregunta ─────────

export function selectRelevantChunks(
  chunks: TextChunk[],
  question: string,
  maxChunks = 4
): TextChunk[] {
  if (chunks.length <= maxChunks) return chunks

  const qWords = question.toLowerCase().split(/\s+/).filter(w => w.length > 3)

  // Score: cuántas palabras de la pregunta aparecen en el chunk
  const scored = chunks.map(chunk => ({
    chunk,
    score: qWords.reduce((acc, word) =>
      acc + (chunk.content.toLowerCase().includes(word) ? 1 : 0), 0
    ),
  }))

  scored.sort((a, b) => b.score - a.score)

  // Siempre incluir el primer chunk (contexto inicial del documento)
  const top = scored.slice(0, maxChunks).map(s => s.chunk)
  if (!top.find(c => c.index === 0)) {
    top[top.length - 1] = chunks[0]
  }

  return top.sort((a, b) => a.index - b.index)
}