import { Request, Response } from 'express'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { Exception } from '../lib/exceptions.lib'

export function errorHandler(err: unknown, _: Request, res: Response): unknown {
  if (err instanceof Exception) {
    return res.status(err.code).json({
      message: err.message,
    })
  }

  if (err instanceof z.ZodError) {
    return res.status(403).json({
      message:
        process.env.NODE_ENV !== 'prod'
          ? fromZodError(err).toString()
          : 'Validation error',
    })
  }

  console.error(
    `Internal Server Error: Message: ${(err as Error).message} Stack: ${
      (err as Error).stack
    }`,
  )

  return res.status(500).json({
    message: 'Internal Server Error.',
  })
}
