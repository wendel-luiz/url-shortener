import { EventBus } from "@repo/shared"
import { UrlService } from "./url.service"

export class UrlListener {
  constructor(
    private readonly eventBus: EventBus,
    private readonly service: UrlService
  ) {
    this.eventBus.subscribe("userDeleted", ({ userId }, next) => {
      this.service
        .deleteAllByUser(userId)
        .then(() => next())
        .catch((err) => next(err))
    })
  }

  public async close(): Promise<void> {
    this.eventBus.close()
  }
}
