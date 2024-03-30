import { EventBus } from '../../events/bus.lib'
import { UrlService } from './url.service'

export class UrlListener {
  constructor(
    private readonly eventBus: EventBus,
    private readonly service: UrlService,
  ) {}

  public async subscribe(): Promise<void> {
    await this.eventBus.subscribe(
      'shortener-userDeleted-url',
      'userDeleted',
      ({ userId }, next) => {
        this.service
          .deleteAllByUser(userId)
          .then(() => next())
          .catch((err) => next(err))
      },
    )
  }

  public async close(): Promise<void> {
    this.eventBus.close()
  }
}
