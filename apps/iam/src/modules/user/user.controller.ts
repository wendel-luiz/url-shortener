import express, { Router } from 'express'
import { UserHandler } from './user.handler'
import { signinBodySchema } from './dtos/signin.dto'
import { loginBodySchema } from './dtos/login.dto'
import { changePasswordBodySchema } from './dtos/change-password.dto'
import { bodyParser } from '../../middleware/body-parser'
import { authMiddleware } from '../../middleware/auth.middleware'

export class UserController {
  private readonly router: Router

  constructor(private readonly handler: UserHandler) {
    this.router = express.Router()

    this.router.patch(
      '/',
      authMiddleware,
      bodyParser(changePasswordBodySchema),
      this.handler.login,
    )

    this.router.delete('/', authMiddleware, this.handler.delete)

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
