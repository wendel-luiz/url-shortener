import { z } from 'zod'

export const createBodySchema = z
  .object({
    url: z.string().url(),
  })
  .strip()
export type CreateBody = z.infer<typeof createBodySchema>
export type CreateProps = CreateBody
export type CreateResponse = {
  url: string
}
