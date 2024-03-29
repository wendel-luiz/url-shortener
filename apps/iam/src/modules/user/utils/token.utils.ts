import { type JwtPayload, type Secret, sign } from 'jsonwebtoken'
import { env } from '../../../config/env.config'
import { User } from '../../../database/types'

export function generateJWT(user: User, expiration: number): string {
  const secret: Secret = env.TOKEN_SECRET
  const payload: JwtPayload = {
    sub: user.code,
    exp: expiration,
    alg: 'HS256',
    typ: 'JWT',
    iss: env.SERVER_NAME,
  }

  const token = sign(payload, secret)

  return token
}
