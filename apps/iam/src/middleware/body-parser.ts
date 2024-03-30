import { type NextFunction, type Request, type Response } from 'express'
import { type ZodSchema } from 'zod'

export function bodyParser(bodySchema: ZodSchema) {
  return function parser(req: Request, _: Response, next: NextFunction) {
    const parsed = bodySchema.parse(req.body)
    req.body = parsed
    next()
  }
}
