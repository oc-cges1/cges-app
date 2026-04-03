// src/utils/hash.ts

import bcrypt    from 'bcryptjs'
import { env }  from '../config/env'

const ROUNDS = parseInt(env.BCRYPT_ROUNDS, 10)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS)
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}
