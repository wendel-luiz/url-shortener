import { type Kysely, sql } from 'kysely'
import { Database } from '../types'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'text', (col) => col.notNull().unique())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updatedAt', 'timestamptz')
    .addColumn('deletedAt', 'timestamptz')
    .execute()

  await db.schema
    .createIndex('user_code_index')
    .on('user')
    .column('code')
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('user').execute()
}
