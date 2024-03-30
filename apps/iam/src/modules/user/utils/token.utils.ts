import { type JwtPayload, type Secret, sign } from "jsonwebtoken"
import { User } from "../../../database/types"
import { env } from "../../../config/env.config"

export function generateJWT(user: User, expiration: number): string {
  const secret: Secret = env.TOKEN_SECRET
  const payload: JwtPayload = {
    sub: user.code,
    exp: expiration,
    alg: "HS256",
    typ: "JWT",
    iss: env.SERVER_NAME,
  }

  const token = sign(payload, secret)

  return token
}
