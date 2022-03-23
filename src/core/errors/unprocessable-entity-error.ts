import { AppError } from './app-error'

export interface UnprocessableEntityErrorOptions {
  message: string
  code?: string
  data?: any
}

export class UnprocessableEntityError extends AppError {
  readonly statusCode = 422

  constructor({ message, code, data }: UnprocessableEntityErrorOptions) {
    super(message, code ?? 'UNPROCESSABLE_ENTITY', data)
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype)
  }
}
