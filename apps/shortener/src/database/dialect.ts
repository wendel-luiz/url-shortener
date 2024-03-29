import { Pool } from "pg"
import { PostgresDialect } from "kysely"
import { env } from "@repo/shared"

export const dialect = new PostgresDialect({
  pool: new Pool({
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    user: env.DB_USER,
    port: env.DB_PORT,
    password: env.DB_PASSWORD,
    max: 10,
  }),
})
