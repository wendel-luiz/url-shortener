import {
  PaginatedQuery,
  paginatedQuerySchema,
  PaginatedResponse,
} from '../../../lib/paginated'

export const findManyQuerySchema = paginatedQuerySchema
export type FindManyQuery = PaginatedQuery

export interface FindManyResponse
  extends PaginatedResponse<{
    shortUrl: string
    originalUrl: string
    accesses: number
  }> {}
