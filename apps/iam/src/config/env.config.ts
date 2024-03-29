import { InvalidEnvFileException } from '@repo/shared'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.string(),
  SERVER_PORT: z.string().transform((value) => Number(value)),
  DB_PORT: z.string().transform((value) => Number(value)),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  TOKEN_SECRET: z.string(),
  SERVER_NAME: z.string(),
  AMQP_URL: z.string().url(),
})
type Env = z.infer<typeof envSchema>

class Environment {
  private readonly props: Env

  constructor() {
    const values = envSchema.safeParse({
      NODE_ENV: process.env.NODE_ENV,
      SERVER_PORT: process.env.SERVER_PORT,
      DB_PORT: process.env.DB_PORT,
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_DATABASE: process.env.DB_DATABASE,
      TOKEN_SECRET: process.env.TOKEN_SECRET,
      SERVER_NAME: process.env.SERVER_NAME,
      AMQP_URL: process.env.AMQP_URL,
    })

    if (!values.success) {
      throw new InvalidEnvFileException()
    }

    this.props = values.data
  }

  public get NODE_ENV(): string {
    return this.props.NODE_ENV
  }

  public get SERVER_PORT(): number {
    return this.props.SERVER_PORT
  }

  public get DB_PORT(): number {
    return this.props.DB_PORT
  }

  public get DB_HOST(): string {
    return this.props.DB_HOST
  }

  public get DB_USER(): string {
    return this.props.DB_USER
  }

  public get DB_PASSWORD(): string {
    return this.props.DB_PASSWORD
  }

  public get DB_DATABASE(): string {
    return this.props.DB_DATABASE
  }

  public get TOKEN_SECRET(): string {
    return this.props.TOKEN_SECRET
  }

  public get SERVER_NAME(): string {
    return this.props.SERVER_NAME
  }

  public get AMQP_URL(): string {
    return this.props.AMQP_URL
  }
}

export const env = new Environment()
