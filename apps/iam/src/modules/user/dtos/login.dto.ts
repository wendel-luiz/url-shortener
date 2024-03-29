import { z } from 'zod'

export const loginBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strip()
export type LoginBody = z.infer<typeof loginBodySchema>

export type LoginReturnBody = {
  token: string
}
