// src/app.ts

import 'dotenv/config'
import express             from 'express'
import helmet              from 'helmet'
import cors                from 'cors'
import cookieParser        from 'cookie-parser'
import { env }             from './config/env'
import { prisma }          from './config/database'
import authRoutes          from './routes/auth.routes'
import { generalLimiter }  from './middlewares/rateLimiter.middleware'
import path                from 'path'
import { errorHandler }    from './middlewares/error.middleware'
import filesRoutes         from './routes/files.routes'
import aiRoutes            from './routes/ai.routes'
import { authMiddleware }  from './middlewares/auth.middleware'
import newsRoutes          from './routes/news.routes'


const app = express()

// ── Seguridad HTTP ────────────────────────────────────────────
app.use(helmet())

// ── CORS ──────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  env.FRONTEND_URL,
  'http://localhost',
  'http://localhost:80',
  'http://localhost:5173',
  'http://127.0.0.1',
  'http://127.0.0.1:80',
  'http://127.0.0.1:5173',
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (Postman, curl, mismo servidor)
    if (!origin) return callback(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
    callback(new Error(`CORS bloqueado para: ${origin}`))
  },
  credentials:    true,
  methods:        ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Parsers ───────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// ── Rate limiting general ─────────────────────────────────────
app.use(generalLimiter)

// ── Health check ──────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: env.NODE_ENV })
})

// ── Rutas ─────────────────────────────────────────────────────
app.use('/auth', authRoutes)
app.use('/files', filesRoutes)
app.use('/ai',    aiRoutes)
app.use('/news',  newsRoutes)
app.use('/uploads', authMiddleware as express.RequestHandler, express.static(path.resolve(process.cwd(), env.UPLOAD_DIR ?? 'uploads')))
// ── 404 ───────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada.' })
})

// ── Error handler global ──────────────────────────────────────
app.use(errorHandler)

// ── Iniciar ───────────────────────────────────────────────────
const PORT = parseInt(env.PORT, 10)

async function bootstrap() {
  try {
    await prisma.$connect()
    console.log('✅ Base de datos conectada')
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`)
      console.log(`   Entorno: ${env.NODE_ENV}`)
    })
  } catch (error) {
    console.error('❌ Error al iniciar:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

bootstrap()

export default app
