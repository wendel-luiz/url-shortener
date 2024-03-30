import { Kysely } from 'kysely'
import { Database, NewUser, User } from '../../database/types'

export class UserRepository {
  constructor(private readonly conn: Kysely<Database>) {}

  async insert(newUser: NewUser): Promise<User> {
    return await this.conn
      .insertInto('user')
      .values(newUser)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async findById(userId: string): Promise<User | undefined> {
    return await this.conn
      .selectFrom('user')
      .selectAll()
      .where('user.code', '=', userId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst()
  }

  async delete(id: number): Promise<User> {
    return await this.conn
      .updateTable('user')
      .set('deletedAt', new Date().toISOString())
      .returningAll()
      .where('user.id', '=', id)
      .executeTakeFirstOrThrow()
  }
}
