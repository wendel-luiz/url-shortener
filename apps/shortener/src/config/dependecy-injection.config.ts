import amqp, { Connection } from "amqplib"
import { Kysely } from "kysely"
import { Database } from "../database/types"
import { Server } from "../server"
import { dialect } from "../database/dialect"
import { UserRepository } from "../modules/user/user.repository"
import { UrlRepository } from "../modules/url/url.repository"
import { UserService } from "../modules/user/user.service"
import { UrlService } from "../modules/url/url.service"
import { UserListener } from "../modules/user/user.listener"
import { UrlHandler } from "../modules/url/url.handler"
import { UrlController } from "../modules/url/url.controller"
import { UrlListener } from "../modules/url/url.listener"
import { EventBus } from "../events/bus.lib"
import { env } from "./env.config"

export async function buildServer(): Promise<Server> {
  // Base
  const db = new Kysely<Database>({ dialect })

  // Repository
  const userRepository = new UserRepository(db)
  const urlRepository = new UrlRepository(db)

  // Amqp Connection
  // Ugly solution for when the app runs inside docker via compose
  const amqpConnection = await amqp.connect(env.AMQP_URL)

  // Producer
  const bus = new EventBus(amqpConnection)
  await bus.configure()

  // Service
  const userService = new UserService(userRepository)
  const urlService = new UrlService(urlRepository, userService)

  // Listener
  const urlListener = new UrlListener(bus, urlService)
  await urlListener.subscribe()

  const userListener = new UserListener(bus, userService)
  await userListener.subscribe()

  // Handler
  const urlHandler = new UrlHandler(urlService)

  // Controller
  const urlController = new UrlController(urlHandler)

  // Server
  return new Server(urlController, userListener, urlListener)
}
