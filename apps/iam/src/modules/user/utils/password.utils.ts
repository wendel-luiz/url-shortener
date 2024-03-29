import bcrypt from 'bcrypt'

export function hash(password: string): string {
  const hash = bcrypt.hashSync(password, 10)
  return hash
}

export function isPasswordEqual(password: string, hash: string): boolean {
  const result = bcrypt.compareSync(password, hash)
  return result
}
