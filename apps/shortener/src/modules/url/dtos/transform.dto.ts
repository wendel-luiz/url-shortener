import { z } from "zod"

export const transformParamsSchema = z
  .object({
    code: z.string(),
  })
  .strip()
export type TransformParams = z.infer<typeof transformParamsSchema>
