import { createHash } from "crypto"
import { UrlRepository } from "./url.repository"
import { UserService } from "../user/user.service"
import { NotFoundException, UnauthorizedException } from "@repo/shared"
import { Url } from "../../database/types"
import { env } from "../../config/env.config"

export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly userService: UserService
  ) {}

  async create(url: string, userId?: string): Promise<string> {
    const data = url + Math.random().toString()
    const sha256Hash = createHash("sha256").update(data).digest("hex")
    const base64Encoded = Buffer.from(sha256Hash).toString("base64")
    const code = base64Encoded.substring(0, 6)

    let user
    if (userId) {
      user = await this.userService.findById(userId)
    }

    const shortenedUrl = await this.urlRepository.insert({
      code,
      url,
      userId: user?.id,
    })

    return shortenedUrl.code
  }

  async findMany(userId: string): Promise<Array<Url>> {
    const user = await this.userService.findById(userId)
    const urls = await this.urlRepository.findMany(user.id)

    return urls
  }

  public async transform(code: string): Promise<string> {
    const url = await this.urlRepository.findByCode(code)
    if (!url) {
      throw new NotFoundException("Url not found.")
    }

    await this.urlRepository.update(url.id, {
      counter: url.counter + 1,
    })

    return env.SERVER_URL + url.url
  }

  public async update(
    userId: string,
    code: string,
    newUrl: string
  ): Promise<string> {
    const user = await this.userService.findById(userId)
    const url = await this.urlRepository.findByCode(code)
    if (!url) {
      throw new NotFoundException("Url not found.")
    }

    if (user.id !== url.userId) {
      throw new UnauthorizedException("Unauthorized.")
    }

    await this.urlRepository.update(url.id, {
      url: newUrl,
    })

    return url.url
  }

  public async delete(userId: string, code: string): Promise<void> {
    const user = await this.userService.findById(userId)
    const url = await this.urlRepository.findByCode(code)
    if (!url) {
      throw new NotFoundException("Url not found.")
    }

    if (user.id !== url.userId) {
      throw new UnauthorizedException("Unauthorized.")
    }

    await this.urlRepository.delete(url.id)
  }

  public async deleteAllByUser(userId: string): Promise<void> {
    const user = await this.userService.findById(userId)
    const urls = await this.urlRepository.findMany(user.id)
    if (!urls) {
      throw new NotFoundException("Url not found.")
    }

    await Promise.all(
      urls.map(async (url) => {
        await this.urlRepository.delete(url.id)
      })
    )
  }
}
