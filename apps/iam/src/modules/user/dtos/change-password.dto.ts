import { z } from 'zod'

export const changePasswordBodySchema = z
  .object({
    password: z.string(),
  })
  .strip()
export type ChangePasswordBody = z.infer<typeof changePasswordBodySchema>

export type ChangePasswordReturnBody = {
  id: string
  email: string
  createdAt: string
}
