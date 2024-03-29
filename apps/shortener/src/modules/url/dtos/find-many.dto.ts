import {
  PaginatedQuery,
  paginatedQuerySchema,
  PaginatedResponse,
} from "@repo/shared"

export const findManyQuerySchema = paginatedQuerySchema
export type FindManyQuery = PaginatedQuery

export interface FindManyResponse
  extends PaginatedResponse<{
    shortUrl: string
    originalUrl: string
    accesses: number
  }> {}
