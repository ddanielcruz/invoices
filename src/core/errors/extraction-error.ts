import { AppError } from './app-error'

export class ExtractionError extends AppError {
  readonly statusCode = 406

  constructor(message: string, code: string, data?: any) {
    super(message, code, data)
    Object.setPrototypeOf(this, ExtractionError.prototype)
  }
}
