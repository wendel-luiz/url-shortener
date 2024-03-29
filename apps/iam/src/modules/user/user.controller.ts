import express, { Router } from 'express'
import { UserHandler } from './user.handler'
import { signinBodySchema } from './dtos/signin.dto'
import { loginBodySchema } from './dtos/login.dto'
import { deleteParamSchema } from './dtos/delete.dto'
import { bodyParser, paramParser } from '@repo/shared'

export class UserController {
  private readonly router: Router

  constructor(private readonly handler: UserHandler) {
    this.router = express.Router()

    this.router.post(
      '/signin',
      bodyParser(signinBodySchema),
      this.handler.signin,
    )

    this.router.post('/login', bodyParser(loginBodySchema), this.handler.login)
  }

  public getRouter(): Router {
    return this.router
  }
}
