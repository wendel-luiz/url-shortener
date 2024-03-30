import { RequestHandler } from "express"
import { UserService } from "./user.service"
import { SigninBody } from "./dtos/signin.dto"
import { LoginBody } from "./dtos/login.dto"
import { ChangePasswordBody } from "./dtos/change-password.dto"

export class UserHandler {
  constructor(private readonly service: UserService) {}

  public signin: RequestHandler<unknown, unknown, SigninBody, unknown> = (
    req,
    res,
    next
  ) => {
    this.service
      .signin(req.body)
      .then((result) => res.status(201).json(result))
      .catch((err) => next(err))
  }

  public login: RequestHandler<unknown, unknown, LoginBody, unknown> = (
    req,
    res,
    next
  ) => {
    this.service
      .login(req.body)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }

  public changePassword: RequestHandler<
    unknown,
    unknown,
    ChangePasswordBody,
    unknown
  > = (req, res, next) => {
    this.service
      .changePassword(req.userId!, req.body.password)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }

  public delete: RequestHandler<unknown, unknown, unknown, unknown> = (
    req,
    res,
    next
  ) => {
    this.service
      .delete(req.userId!)
      .then(() => res.status(204).send())
      .catch((err) => next(err))
  }
}
