import express, { Router } from 'express'
import { UrlHandler } from './url.handler'
import { createBodySchema } from './dtos/create.dto'
import { transformParamsSchema } from './dtos/transform.dto'
import { updateBodySchema, updateParamsSchema } from './dtos/update.dto'
import { deleteParamsSchema } from './dtos/delete.dto'
import { bodyParser } from '../../middleware/body-parser'
import { authMiddleware } from '../../middleware/auth.middleware'
import { paramParser } from '../../middleware/param-parser'

export class UrlController {
  private readonly router: Router

  constructor(private readonly handler: UrlHandler) {
    this.router = express.Router()

    this.router.post('/', bodyParser(createBodySchema), this.handler.create)
    this.router.get('/all', authMiddleware, this.handler.findMany)

    this.router.get(
      '/:code',
      paramParser(transformParamsSchema),
      this.handler.transform,
    )

    this.router.patch(
      '/:code',
      authMiddleware,
      paramParser(updateParamsSchema),
      bodyParser(updateBodySchema),
      this.handler.update,
    )

    this.router.delete(
      '/:code',
      authMiddleware,
      paramParser(deleteParamsSchema),
      this.handler.delete,
    )
  }

  public getRouter(): Router {
    return this.router
  }
}
