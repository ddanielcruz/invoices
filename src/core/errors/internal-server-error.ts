import { AppError } from './app-error'

export class InternalServerError extends AppError {
  readonly statusCode = 500

  constructor(error: Error, code = 'UNKNOWN_ERROR') {
    super(error.message, code, { name: error.name, stack: error.stack })
    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}
