// src/services/ai.service.ts

import Anthropic              from '@anthropic-ai/sdk'
import { env }                from '../config/env'
import { chunkText, selectRelevantChunks } from './pdf.service'
import { logger }             from '../utils/logger'

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

const MODEL        = 'claude-sonnet-4-20250514'
const MAX_TOKENS   = 1024
const SYSTEM_PROMPT = `Eres un asistente inteligente del Sistema Departamental de Seguridad (SISDEP) 
del Centro de Gestión de Emergencias y Seguridad (CGES) de la Gobernación del Valle del Cauca.

Cuando el usuario te proporcione contenido de un documento, responde sus preguntas basándote 
ÚNICAMENTE en ese contenido. Si la respuesta no está en el documento, dilo claramente.

Responde siempre en español, de manera clara, precisa y profesional.`

export interface AiMessage {
  role:    'user' | 'assistant'
  content: string
}

// ── Pregunta libre (sin documento) ───────────────────────────

export async function askAI(
  question: string,
  history:  AiMessage[] = []
): Promise<string> {
  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: question },
  ]

  const response = await anthropic.messages.create({
    model:      MODEL,
    max_tokens: MAX_TOKENS,
    system:     SYSTEM_PROMPT,
    messages,
  })

  const block = response.content[0]
  return block.type === 'text' ? block.text : ''
}

// ── Pregunta con contexto de documento ───────────────────────

export async function askWithDocument(
  question:      string,
  documentText:  string,
  history:       AiMessage[] = []
): Promise<string> {
  try {
    // Dividir el texto y seleccionar fragmentos relevantes
    const chunks   = chunkText(documentText)
    const relevant = selectRelevantChunks(chunks, question)
    const context  = relevant.map(c => c.content).join('\n\n---\n\n')

    const contextMessage = `CONTENIDO DEL DOCUMENTO (fragmentos relevantes):\n\n${context}\n\n---\nPREGUNTA DEL USUARIO: ${question}`

    const messages = [
      ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: contextMessage },
    ]

    const response = await anthropic.messages.create({
      model:      MODEL,
      max_tokens: MAX_TOKENS,
      system:     SYSTEM_PROMPT,
      messages,
    })

    const block = response.content[0]
    const answer = block.type === 'text' ? block.text : ''

    logger.info({
      event:      'AI_QUERY',
      chunks:     chunks.length,
      relevant:   relevant.length,
      question:   question.slice(0, 80),
    })

    return answer
  } catch (err) {
    logger.error({ event: 'AI_ERROR', error: String(err) })
    throw { status: 502, message: 'Error al consultar la IA. Intente nuevamente.' }
  }
}