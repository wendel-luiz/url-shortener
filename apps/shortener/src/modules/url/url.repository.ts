import { Kysely } from "kysely"
import { Database, NewUrl, Url, UrlUpdate } from "../../database/types"
import { FindManyResponse } from "./dtos/find-many.dto"
import { Paginated } from "../../lib/paginated"
import { env } from "../../config/env.config"

export class UrlRepository {
  constructor(private readonly connection: Kysely<Database>) {}

  async insert(newUrl: NewUrl): Promise<Url> {
    return await this.connection
      .insertInto("url")
      .values(newUrl)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async findMany(
    params: Paginated<{ userId: number }>
  ): Promise<FindManyResponse> {
    const take = Number(params.take ?? 10)
    const page = Number(params.page ?? 1)

    const skip = take * (page - 1)

    const query = this.connection
      .selectFrom("url")
      .selectAll()
      .where("url.userId", "=", params.params.userId)
      .where("url.deletedAt", "is", null)

    const [data, count] = await Promise.all([
      query.offset(skip).limit(take).orderBy("createdAt").execute(),
      query
        .clearSelect()
        .select((eb) => eb.fn.count<number>("url.id").as("total"))
        .executeTakeFirst(),
    ])

    const total = count?.total ?? 0
    const pages = Math.ceil(total / take)

    return {
      page,
      pages,
      length: data.length,
      items: data.map((url) => ({
        shortUrl: env.SERVER_URL + url.code,
        originalUrl: url.url,
        accesses: url.counter,
      })),
    }
  }

  async findByCode(code: string): Promise<Url | undefined> {
    return await this.connection
      .selectFrom("url")
      .selectAll()
      .where("url.code", "=", code)
      .where("url.deletedAt", "is", null)
      .executeTakeFirst()
  }

  async update(id: number, url: UrlUpdate): Promise<Url> {
    return await this.connection
      .updateTable("url")
      .set({ ...url, updatedAt: new Date().toISOString() })
      .returningAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow()
  }

  async delete(id: number): Promise<void> {
    await this.connection
      .updateTable("url")
      .set({
        deletedAt: new Date().toISOString(),
      })
      .where("id", "=", id)
      .executeTakeFirstOrThrow()
  }

  async deleteAllByUser(userId: number): Promise<void> {
    await this.connection
      .updateTable("url")
      .set({
        deletedAt: new Date().toISOString(),
      })
      .where("url.userId", "=", userId)
      .executeTakeFirstOrThrow()
  }
}
