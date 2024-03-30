import { NotFoundException } from "@repo/shared"
import { UserService } from "../../modules/user/user.service"
import { UserRepository } from "../../modules/user/user.repository"

jest.mock("../../modules/user/user.repository")

const UserRepositoryMocked = UserRepository as jest.Mock<UserRepository>

function sutFactory() {
  const userRepository =
    new UserRepositoryMocked() as jest.Mocked<UserRepository>

  const sut = new UserService(userRepository)
  return { sut, userRepository }
}

describe("userService", () => {
  describe("Given that I want to create a new user", () => {
    describe("When I provide a userId", () => {
      test("Then should the user be created", async () => {
        const { sut, userRepository } = sutFactory()
        await sut.create("id1234")
        expect(userRepository.insert).toHaveBeenCalled()
      })
    })
  })

  describe("Given that I want to find a user by its public id", () => {
    describe("When I pass the id", () => {
      test("Then should the user be found", async () => {
        const { sut, userRepository } = sutFactory()

        userRepository.findById.mockResolvedValueOnce({
          id: 1,
          code: "123",
          deletedAt: undefined,
        })

        const user = await sut.findById("id12345")

        expect(userRepository.findById).toHaveBeenCalled()
        expect(user.code).toBe("123")
      })
    })

    describe("When I pass a inexisting id", () => {
      test("Then a not found exception should be thrown", async () => {
        const { sut, userRepository } = sutFactory()

        userRepository.findById.mockResolvedValueOnce(undefined)

        let response, error

        try {
          response = await sut.findById("id12345")
        } catch (err) {
          error = err
        }

        expect(userRepository.findById).toHaveBeenCalled()
        expect(error instanceof NotFoundException).toBe(true)
      })
    })
  })
})
