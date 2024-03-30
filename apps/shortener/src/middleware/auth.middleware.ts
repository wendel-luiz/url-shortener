import { NextFunction, Request, Response } from 'express'
import { UnauthorizedException } from '../lib/exceptions.lib'

export function authMiddleware(req: Request, _: Response, next: NextFunction) {
  if (!req.userId) {
    next(new UnauthorizedException('Unauthorized.'))
    return
  }

  next()
}
