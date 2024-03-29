import { Kysely } from "kysely"
import { Database, NewUrl, Url, UrlUpdate } from "../../database/types"

export class UrlRepository {
  constructor(private readonly connection: Kysely<Database>) {}

  async insert(newUrl: NewUrl): Promise<Url> {
    return await this.connection
      .insertInto("url")
      .values(newUrl)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async findMany(userId: number): Promise<Array<Url>> {
    return await this.connection
      .selectFrom("url")
      .selectAll()
      .where("url.userId", "=", userId)
      .where("url.deletedAt", "is", null)
      .execute()
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
}
