import { RequestHandler } from "express"
import { UrlService } from "./url.service"
import { CreateBody } from "./dtos/create.dto"
import { TransformParams } from "./dtos/transform.dto"
import { UpdateBody, UpdateParams } from "./dtos/update.dto"
import { DeleteParams } from "./dtos/delete.dto"
import { FindManyQuery } from "./dtos/find-many.dto"

export class UrlHandler {
  constructor(private readonly service: UrlService) {}

  public create: RequestHandler<unknown, unknown, CreateBody, unknown> = (
    req,
    res,
    next
  ) => {
    this.service
      .create(req.body.url, req.userId)
      .then((result) => res.status(201).json(result))
      .catch((err) => next(err))
  }

  public findMany: RequestHandler<unknown, unknown, unknown, FindManyQuery> = (
    req,
    res,
    next
  ) => {
    this.service
      .findMany(req.userId!, req.query.page, req.query.take)
      .then((result) => res.status(201).json(result))
      .catch((err) => next(err))
  }

  public transform: RequestHandler<TransformParams, unknown, unknown, unknown> =
    (req, res, next) => {
      this.service
        .transform(req.params.code)
        .then((result) => res.status(307).redirect(result))
        .catch((err) => next(err))
    }

  public update: RequestHandler<UpdateParams, unknown, UpdateBody, unknown> = (
    req,
    res,
    next
  ) => {
    this.service
      .update(req.userId!, req.params.code, req.body.url)
      .then((result) => res.status(201).json(result))
      .catch((err) => next(err))
  }

  public delete: RequestHandler<DeleteParams, unknown, unknown, unknown> = (
    req,
    res,
    next
  ) => {
    this.service
      .delete(req.userId!, req.params.code)
      .then(() => res.status(204).send())
      .catch((err) => next(err))
  }
}
