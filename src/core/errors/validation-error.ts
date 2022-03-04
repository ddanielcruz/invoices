import { ValidationError as JoiValidationError } from 'joi'

import { AppError } from './app-error'

export class FieldError {
  constructor(public readonly field: string, public readonly message: string) {}

  static generate(error: JoiValidationError | undefined): FieldError[] {
    const errors = error?.details ?? []
    return errors
      .filter(error => error.type !== 'object.unknown')
      .map(error => new FieldError(error.context?.label || 'unknown', error.message))
  }

  static includes(errors: FieldError[], ...properties: string[]): boolean {
    return errors.some(error => properties.includes(error.field))
  }

  static throw(errors: FieldError[]) {
    throw new ValidationError(errors)
  }
}

export class ValidationError extends AppError {
  readonly statusCode = 400

  constructor(errors: FieldError[]) {
    super('One or more validations failed.', 'VALIDATION_FAILED', errors)
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}
