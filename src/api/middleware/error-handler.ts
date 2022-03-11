import { Request, Response, NextFunction } from 'express'

import { logger } from '../../config/logger'
import { AppError, InternalServerError } from '../../core/errors'

export const errorHandler = async (
  error: Error,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json(error.serialize())
  }

  logger.error(error.stack ?? error)
  return response.status(500).json(new InternalServerError(error).serialize())
}
