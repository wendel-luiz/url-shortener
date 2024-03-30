import { type NextFunction, type Request, type Response } from 'express'
import { type ZodSchema } from 'zod'

export function paramParser(paramSchema: ZodSchema) {
  return function parser(req: Request, res: Response, next: NextFunction) {
    const parsed = paramSchema.parse(req.params)
    req.params = parsed
    next()
  }
}
