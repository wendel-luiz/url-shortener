import { sql, type Kysely } from 'kysely'
import { Database } from '../types'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'text', (col) => col.notNull().unique())
    .addColumn('deletedAt', 'timestamptz')
    .execute()

  await db.schema
    .createIndex('user_code_index')
    .on('user')
    .column('code')
    .execute()

  await db.schema
    .createTable('url')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('userId', 'integer', (col) => col.references('user.id'))
    .addColumn('code', 'text', (col) => col.notNull().unique())
    .addColumn('url', 'text', (col) => col.notNull())
    .addColumn('counter', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updatedAt', 'timestamptz')
    .addColumn('deletedAt', 'timestamptz')
    .execute()

  await db.schema
    .createIndex('url_code_index')
    .on('url')
    .column('code')
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('user').execute()
}
