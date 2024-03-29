import { z } from "zod"

export const updateParamsSchema = z
  .object({
    code: z.string(),
  })
  .strip()
export type UpdateParams = z.infer<typeof updateParamsSchema>

export const updateBodySchema = z
  .object({
    url: z.string().url(),
  })
  .strip()
export type UpdateBody = z.infer<typeof updateBodySchema>
