import { NextFunction, Request, Response } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import {
  InternalServerError,
  UnauthorizedException,
} from '../lib/exceptions.lib'

export function setUserMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    next()
    return
  }

  const secret = process.env.TOKEN_SECRET
  if (!secret) {
    throw new InternalServerError()
  }

  verify(token, secret, (err, decoded) => {
    if (err || !decoded) {
      next(new UnauthorizedException('Unauthorized'))
      return
    }

    req.userId = (decoded as JwtPayload).sub!
    next()
  })
}
