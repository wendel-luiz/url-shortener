import { z } from 'zod'

export interface Paginated<Params> {
  page?: number
  take?: number
  params: Params
}

export interface PaginatedResponse<Data> {
  page: number
  pages: number
  length: number
  items: Data[]
}

export const paginatedQuerySchema = z.object({
  page: z
    .string()
    .transform((value) => Number(value))
    .optional(),
  take: z
    .string()
    .transform((value) => Number(value))
    .optional(),
})
export type PaginatedQuery = z.infer<typeof paginatedQuerySchema>
