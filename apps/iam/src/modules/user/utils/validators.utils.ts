import { isStrongPassword } from 'validator'
import { isEmail } from 'validator'

export function isPasswordStrong(password: string): boolean {
  return isStrongPassword(password, {
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
}

export function isEmailValid(email: string): boolean {
  return isEmail(email)
}
