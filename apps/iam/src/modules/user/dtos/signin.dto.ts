import { z } from 'zod'

export const signinBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strip()
export type SigninBody = z.infer<typeof signinBodySchema>

export type SigninReturnBody = {
  id: string
  email: string
  createdAt: string
  token: string
}
