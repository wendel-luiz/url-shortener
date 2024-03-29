import { z } from "zod"

export const deleteParamsSchema = z
  .object({
    code: z.string(),
  })
  .strip()
export type DeleteParams = z.infer<typeof deleteParamsSchema>
