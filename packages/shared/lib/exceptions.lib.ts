export class Exception extends Error {
  public code: number

  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}

export class InternalServerError extends Exception {
  constructor() {
    super('Internal Server Error', 500)
  }
}

export class InvalidEnvFileException extends Exception {
  constructor() {
    super('Invalid env file', 500)
  }
}

export class BadRequestException extends Exception {
  constructor(message: string) {
    super(message, 400)
  }
}

export class NotFoundException extends Exception {
  constructor(message: string) {
    super(message, 404)
  }
}

export class BadCredentialsException extends Exception {
  constructor(message: string) {
    super(message, 400)
  }
}

export class ConflictException extends Exception {
  constructor(message: string) {
    super(message, 409)
  }
}

export class UnauthorizedException extends Exception {
  constructor(message: string) {
    super(message, 401)
  }
}
