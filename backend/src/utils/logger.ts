// src/utils/logger.ts

import fs   from 'fs'
import path from 'path'

const LOG_DIR  = path.resolve(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'security.log')

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })

function write(level: string, data: object) {
  const line = JSON.stringify({ level, ...data }) + '\n'
  // Consola
  if (level === 'error') {
    console.error(line)
  } else if (level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }
  // Archivo
  fs.appendFileSync(LOG_FILE, line)
}

export const logger = {
  info:  (data: object) => write('info',  data),
  warn:  (data: object) => write('warn',  data),
  error: (data: object) => write('error', data),
}