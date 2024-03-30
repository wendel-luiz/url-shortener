import { Kysely } from 'kysely'
import { Database, NewUser, User, UserUpdate } from '../../database/types'

export class UserRepository {
  constructor(private readonly conn: Kysely<Database>) {}

  async insert(newUser: NewUser): Promise<User> {
    return await this.conn
      .insertInto('user')
      .values(newUser)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.conn
      .selectFrom('user')
      .selectAll()
      .where('user.code', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst()
  }

  async findByEmail(
    email: string,
    options?: { withDeleted: boolean },
  ): Promise<User | undefined> {
    const withoutDeleted = !options?.withDeleted
    return await this.conn
      .selectFrom('user')
      .selectAll()
      .where('user.email', '=', email)
      .$if(withoutDeleted, (qb) => qb.where('deletedAt', 'is', null))
      .executeTakeFirst()
  }

  async update(id: number, updatedUser: UserUpdate): Promise<User> {
    return await this.conn
      .updateTable('user')
      .set(updatedUser)
      .returningAll()
      .where('user.id', '=', id)
      .executeTakeFirstOrThrow()
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
