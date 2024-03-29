import { EventBus } from "@repo/shared"
import { UserService } from "./user.service"

export class UserListener {
  constructor(
    private readonly eventBus: EventBus,
    private readonly service: UserService
  ) {
    this.eventBus.subscribe("userCreated", ({ userId }, next) => {
      this.service
        .create(userId)
        .then(() => next())
        .catch((err) => next(err))
    })

    this.eventBus.subscribe("userDeleted", ({ userId }, next) => {
      this.service
        .delete(userId)
        .then(() => next())
        .catch((err) => next(err))
    })
  }

  public async close(): Promise<void> {
    this.eventBus.close()
  }
}
