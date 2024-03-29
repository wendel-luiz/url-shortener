import { Kysely } from "kysely"
import amqp from "amqplib"
import { Database } from "../database/types"
import { dialect } from "../database/dialect"
import { Server } from "../server"
import { UserRepository } from "../modules/user/user.repository"
import { UserService } from "../modules/user/user.service"
import { UserHandler } from "../modules/user/user.handler"
import { UserController } from "../modules/user/user.controller"
import { env, EventBus } from "@repo/shared"

export async function buildServer(): Promise<Server> {
  // Base
  const db = new Kysely<Database>({ dialect })

  // Repository
  const userRepository = new UserRepository(db)

  //Amqp Connection
  const amqpConnection = await amqp.connect(env.AMQP_URL)

  // Producer
  const bus = new EventBus(amqpConnection)
  await bus.configure()

  // Service
  const userService = new UserService(userRepository, bus)

  // Handler
  const userHandler = new UserHandler(userService)

  // Controller
  const userController = new UserController(userHandler)

  // Server
  return new Server(userController)
}
