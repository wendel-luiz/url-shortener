import { buildServer } from "./config/dependecy-injection.config"

declare module "express-serve-static-core" {
  interface Request {
    userId?: string
  }
}

async function init() {
  const server = await buildServer()
  server.start()
}

void init()
