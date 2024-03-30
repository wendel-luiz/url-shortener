import { Channel, Connection } from "amqplib"
import { AppEvents } from "./event.base"

export class EventBus {
  private producerChannel: Channel | undefined
  private consumerChannel: Channel | undefined

  constructor(private readonly connection: Connection) {}

  public async configure(): Promise<void> {
    this.producerChannel = await this.connection.createChannel()
    this.consumerChannel = await this.connection.createChannel()

    await this.producerChannel.assertExchange("userCreated", "fanout")
    await this.producerChannel.assertExchange("userDeleted", "fanout")

    await this.producerChannel.assertExchange("deadLetterExchange", "topic", {
      durable: true,
    })
    const dlq = await this.producerChannel.assertQueue("deadLetterQueue", {
      durable: true,
    })
    await this.producerChannel.bindQueue(dlq.queue, "deadLetterExchange", "#")
  }

  public async publish<T extends keyof AppEvents, P extends AppEvents[T]>(
    event: T,
    payload: P
  ) {
    this.producerChannel?.publish(
      event,
      "",
      Buffer.from(JSON.stringify(payload))
    )
  }

  async subscribe<T extends keyof AppEvents, P extends AppEvents[T]>(
    queueName: string,
    event: T,
    callback: (message: P, next: Function) => void
  ): Promise<void> {
    await this.consumerChannel?.assertQueue(queueName, {
      deadLetterExchange: "deadLetterExchange",
    })
    await this.consumerChannel?.bindQueue(queueName, event, "")
    await this.consumerChannel?.consume(queueName, (message) => {
      if (message) {
        const data = JSON.parse(message.content.toString())

        callback(data, (error?: Error) => {
          if (!error) {
            this.consumerChannel?.ack(message)
            return
          }

          this.consumerChannel?.nack(message)
        })
      }
    })
  }

  public async close() {
    await this.producerChannel?.close()
    await this.consumerChannel?.close()
    await this.connection.close()
  }
}
