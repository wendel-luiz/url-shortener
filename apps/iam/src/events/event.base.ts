export type AppEvents = {
  userCreated: UserCreatedEvent
  userDeleted: UserDeletedEvent
}

export type UserCreatedEvent = {
  userId: string
}

export type UserDeletedEvent = {
  userId: string
}
