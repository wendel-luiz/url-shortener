import {
  type Generated,
  type Insertable,
  type Selectable,
  type Updateable,
} from 'kysely'

export interface Database {
  user: UserTable
}

export interface UserTable {
  id: Generated<number>
  code: string
  email: string
  password: string
  createdAt: Generated<string>
  updatedAt?: string
  deletedAt?: string
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>
