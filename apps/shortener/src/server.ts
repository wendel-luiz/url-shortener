import express from "express"
import http from "http"
import cors from "cors"
import { env } from "process"
import { UrlController } from "./modules/url/url.controller"
import { authMiddleware, errorHandler, EventBus } from "@repo/shared"
import { UserListener } from "./modules/user/user.listener"
import { UrlListener } from "./modules/url/url.listener"

export class Server {
  private readonly app
  private server: http.Server | undefined

  constructor(
    private readonly urlController: UrlController,
    private readonly userListener: UserListener,
    private readonly urlListener: UrlListener
  ) {
    this.app = express()

    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(authMiddleware)

    this.app.use(this.urlController.getRouter())

    this.app.use(errorHandler)
  }

  public start() {
    this.server = this.app.listen(env.SERVER_PORT, () => {
      console.info(`Server listening on port ${env.SERVER_PORT}`)
    })
  }

  public async stop() {
    await this.urlListener.close()
    await this.userListener.close()

    this.server?.close()
  }
}
