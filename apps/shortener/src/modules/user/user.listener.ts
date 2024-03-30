import { EventBus } from '../../events/bus.lib'
import { UserService } from './user.service'

export class UserListener {
  constructor(
    private readonly eventBus: EventBus,
    private readonly service: UserService,
  ) {}

  public async subscribe(): Promise<void> {
    await this.eventBus.subscribe(
      'shortener-userCreated-user',
      'userCreated',
      ({ userId }, next) => {
        this.service
          .create(userId)
          .then(() => next())
          .catch((err) => next(err))
      },
    )

    await this.eventBus.subscribe(
      'shortener-userDeleted-user',
      'userDeleted',
      ({ userId }, next) => {
        this.service
          .delete(userId)
          .then(() => next())
          .catch((err) => next(err))
      },
    )
  }

  public async close(): Promise<void> {
    this.eventBus.close()
  }
}
