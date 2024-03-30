import { UserRepository } from "./user.repository"
import { isEmailValid, isPasswordStrong } from "./utils/validators.utils"
import { hash, isPasswordEqual } from "./utils/password.utils"
import { generate } from "short-uuid"
import { SigninBody, SigninReturnBody } from "./dtos/signin.dto"
import { LoginBody, LoginReturnBody } from "./dtos/login.dto"
import { generateJWT } from "./utils/token.utils"
import { addDays } from "date-fns"
import { ChangePasswordReturnBody } from "./dtos/change-password.dto"
import { EventBus } from "../../events/bus.lib"
import {
  BadCredentialsException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../lib/exceptions.lib"

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bus: EventBus
  ) {}

  async signin({ email, password }: SigninBody): Promise<SigninReturnBody> {
    const isStrong = isPasswordStrong(password)
    if (!isStrong) {
      throw new BadRequestException("Provided password is too weak.")
    }

    const isValid = isEmailValid(email)
    if (!isValid) {
      throw new BadRequestException("Provided e-mail is invalid.")
    }

    const anotherUser = await this.userRepository.findByEmail(email, {
      withDeleted: true,
    })
    if (anotherUser) {
      throw new ConflictException("E-mail already in use.")
    }

    const newUser = await this.userRepository.insert({
      email,
      password: hash(password),
      code: generate(),
    })

    await this.bus.publish("userCreated", {
      userId: newUser.code,
    })

    const expiration = addDays(new Date(), 7).getTime()
    const token = generateJWT(newUser, expiration)

    return {
      id: newUser.code,
      email: newUser.email,
      createdAt: newUser.createdAt,
      token: token,
    }
  }

  async login({ email, password }: LoginBody): Promise<LoginReturnBody> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new BadCredentialsException("Bad credentials.")
    }

    const isEqual = isPasswordEqual(password, user.password)
    if (!isEqual) {
      throw new BadCredentialsException("Bad credentials.")
    }

    const expiration = addDays(new Date(), 7).getTime()
    const token = generateJWT(user, expiration)

    return {
      token: token,
    }
  }

  async changePassword(
    userId: string,
    password: string
  ): Promise<ChangePasswordReturnBody> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException("User not found.")
    }

    const isStrong = isPasswordStrong(password)
    if (!isStrong) {
      throw new BadRequestException("Provided password is too weak.")
    }

    const newPassword = hash(password)

    const updatedUser = await this.userRepository.update(user.id, {
      password: newPassword,
    })

    return {
      id: updatedUser.code,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
    }
  }

  async delete(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException("User not found.")
    }

    await this.userRepository.delete(user.id)
    await this.bus.publish("userDeleted", {
      userId,
    })
  }
}
