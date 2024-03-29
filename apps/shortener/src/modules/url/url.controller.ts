import express, { Router } from "express"
import { UrlHandler } from "./url.handler"
import { bodyParser, paramParser } from "@repo/shared"
import { createBodySchema } from "./dtos/create.dto"
import { transformParamsSchema } from "./dtos/transform.dto"
import { updateBodySchema, updateParamsSchema } from "./dtos/update.dto"
import { deleteParamsSchema } from "./dtos/delete.dto"

export class UrlController {
  private readonly router: Router

  constructor(private readonly handler: UrlHandler) {
    this.router = express.Router()

    this.router.post("/", bodyParser(createBodySchema), this.handler.create)

    this.router.get(
      "/",
      paramParser(transformParamsSchema),
      this.handler.transform
    )

    this.router.get("/all", this.handler.findMany)

    this.router.patch(
      "/:code",
      paramParser(updateParamsSchema),
      bodyParser(updateBodySchema),
      this.handler.update
    )

    this.router.delete(
      "/:code",
      paramParser(deleteParamsSchema),
      this.handler.delete
    )
  }

  public getRouter(): Router {
    return this.router
  }
}
