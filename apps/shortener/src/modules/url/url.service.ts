import { createHash } from "crypto"
import { UrlRepository } from "./url.repository"
import { UserService } from "../user/user.service"
import { env, NotFoundException, UnauthorizedException } from "@repo/shared"
import { Url } from "../../database/types"
import { FindManyResponse } from "./dtos/find-many.dto"

export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly userService: UserService
  ) {}

  async create(url: string, userId?: string): Promise<{ url: string }> {
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

    return {
      url: env.SERVER_URL + shortenedUrl.code,
    }
  }

  async findMany(
    userId: string,
    page?: number,
    take?: number
  ): Promise<FindManyResponse> {
    const user = await this.userService.findById(userId)
    const urls = await this.urlRepository.findMany({
      params: {
        userId: user.id,
      },
      page,
      take,
    })

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

    return url.url
  }

  public async update(
    userId: string,
    code: string,
    newUrl: string
  ): Promise<{ url: string }> {
    const user = await this.userService.findById(userId)
    const url = await this.urlRepository.findByCode(code)
    if (!url) {
      throw new NotFoundException("Url not found.")
    }

    if (user.id !== url.userId) {
      throw new UnauthorizedException("Unauthorized.")
    }

    const updatedUrl = await this.urlRepository.update(url.id, {
      url: newUrl,
    })

    return {
      url: env.SERVER_URL + updatedUrl.code,
    }
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
    await this.urlRepository.deleteAllByUser(user.id)
  }
}
