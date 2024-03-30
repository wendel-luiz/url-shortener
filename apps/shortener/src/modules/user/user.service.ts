import { User } from "../../database/types"
import { NotFoundException } from "../../lib/exceptions.lib"
import { UserRepository } from "./user.repository"

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create(userId: string): Promise<User> {
    const newUser = await this.userRepository.insert({
      code: userId,
    })
    return newUser
  }

  public async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException("User not found.")
    }

    return user
  }

  public async delete(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException("User not found.")
    }

    await this.userRepository.delete(user.id)
  }
}
