import { AppError } from './app-error'

export class NotFoundError extends AppError {
  readonly statusCode = 404

  constructor(message: string, data?: any) {
    super(message, 'NOT_FOUND', data)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
