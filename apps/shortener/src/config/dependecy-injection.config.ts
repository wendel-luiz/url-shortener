import amqp from "amqplib"
import { Kysely } from "kysely"
import { Database } from "../database/types"
import { Server } from "../server"
import { dialect } from "../database/dialect"
import { UserRepository } from "../modules/user/user.repository"
import { UrlRepository } from "../modules/url/url.repository"
import { env } from "./env.config"
import { EventBus } from "@repo/shared"
import { UserService } from "../modules/user/user.service"
import { UrlService } from "../modules/url/url.service"
import { UserListener } from "../modules/user/user.listener"
import { UrlHandler } from "../modules/url/url.handler"
import { UrlController } from "../modules/url/url.controller"
import { UrlListener } from "../modules/url/url.listener"

export async function buildServer(): Promise<Server> {
  // Base
  const db = new Kysely<Database>({ dialect })

  // Repository
  const userRepository = new UserRepository(db)
  const urlRepository = new UrlRepository(db)

  //Amqp Connection
  const amqpConnection = await amqp.connect(env.AMQP_URL)

  // Producer
  const bus = new EventBus(amqpConnection)

  // Service
  const userService = new UserService(userRepository)
  const urlService = new UrlService(urlRepository, userService)

  // Listener
  const urlListener = new UrlListener(bus, urlService)
  const userListener = new UserListener(bus, userService)

  // Handler
  const urlHandler = new UrlHandler(urlService)

  // Controller
  const urlController = new UrlController(urlHandler)

  // Server
  return new Server(urlController, userListener, urlListener)
}
