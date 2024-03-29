import {
  type Generated,
  type Insertable,
  type Selectable,
  type Updateable,
} from "kysely"

export interface Database {
  user: UserTable
  url: UrlTable
}

export interface UserTable {
  id: Generated<number>
  code: string
  deletedAt?: string
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>

export interface UrlTable {
  id: Generated<number>
  userId?: number
  code: string
  url: string
  counter: Generated<number>
  createdAt: Generated<string>
  updatedAt?: string
  deletedAt?: string
}

export type Url = Selectable<UrlTable>
export type NewUrl = Insertable<UrlTable>
export type UrlUpdate = Updateable<UrlTable>
