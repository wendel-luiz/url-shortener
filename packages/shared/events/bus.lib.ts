import { Channel, Connection } from 'amqplib'
import { AppEvents } from './event.base'

export class EventBus {
  private readonly producerChannel: Promise<Channel>
  private readonly consumerChannel: Promise<Channel>

  constructor(private readonly connection: Connection) {
    this.producerChannel = this.connection.createChannel()
    this.consumerChannel = this.connection.createChannel()
  }

  public async publish<T extends keyof AppEvents, P extends AppEvents[T]>(
    queueName: T,
    payload: P,
  ) {
    this.producerChannel
      .then((channel) => {
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)))
      })
      .catch((err) => {
        throw err
      })
  }

  subscribe<T extends keyof AppEvents, P extends AppEvents[T]>(
    eventName: T,
    callback: (message: P, next: Function) => void,
  ): void {
    this.consumerChannel.then((channel) => {
      let retries = 0

      channel.consume(eventName, (message) => {
        if (message) {
          const data = JSON.parse(message.content.toString())

          callback(data, (error?: Error) => {
            if (!error) {
              channel.ack(message)
              return
            }

            if (retries >= 5) {
              console.log('Max retries')
              channel.ack(message)
              return
            }

            console.log('Retry number: ', retries++)
            channel.nack(message)
          })
        }
      })
    })
  }

  public async close() {
    ;(await this.producerChannel).close()
    ;(await this.consumerChannel).close()
    await this.connection.close()
  }
}
