import express, { Router } from "express"
import { UserHandler } from "./user.handler"
import { signinBodySchema } from "./dtos/signin.dto"
import { loginBodySchema } from "./dtos/login.dto"
import { authMiddleware, bodyParser, paramParser } from "@repo/shared"
import { changePasswordBodySchema } from "./dtos/change-password.dto"

export class UserController {
  private readonly router: Router

  constructor(private readonly handler: UserHandler) {
    this.router = express.Router()

    this.router.post(
      "/signin",
      bodyParser(signinBodySchema),
      this.handler.signin
    )

    this.router.post("/login", bodyParser(loginBodySchema), this.handler.login)

    this.router.patch(
      "/",
      authMiddleware,
      bodyParser(changePasswordBodySchema),
      this.handler.login
    )

    this.router.delete("/", authMiddleware, this.handler.delete)
  }

  public getRouter(): Router {
    return this.router
  }
}
