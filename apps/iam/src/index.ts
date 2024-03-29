import { buildServer } from "./config/dependecy-injection.config"

async function init() {
  const server = await buildServer()
  server.start()
}

void init()
