import express from 'express'
import http from 'http'
import cors from 'cors'
import { UserController } from './modules/user/user.controller'
import { env } from 'process'
import { setUserMiddleware } from './middleware/get-user.middleware'
import { errorHandler } from './middleware/error-handler'

export class Server {
  private readonly app
  private server: http.Server | undefined

  constructor(private readonly userController: UserController) {
    this.app = express()

    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(setUserMiddleware)

    this.app.use(this.userController.getRouter())

    this.app.use(errorHandler)
  }

  public start() {
    this.server = this.app.listen(env.SERVER_PORT, () => {
      console.info(`Server listening on port ${env.SERVER_PORT}`)
    })
  }

  public stop() {
    this.server?.close()
  }
}
