import { transports, createLogger, format } from 'winston'
import 'winston-daily-rotate-file'

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'

// Default configuration for file rotation
const rotateFileConfig = {
  maxFiles: 7,
  dirname: 'logs',
  extension: '.log'
}

// Initialize logger with file transports and log level based on active environment
export const logger = createLogger({
  level: isDev ? 'debug' : 'http',
  transports: [
    new transports.DailyRotateFile({
      ...rotateFileConfig,
      filename: 'combined-%DATE%'
    }),
    new transports.DailyRotateFile({
      ...rotateFileConfig,
      filename: 'errors-%DATE%',
      level: 'error'
    })
  ],
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `[${[info.timestamp]}] ${info.level}: ${info.message}`)
  )
})

// If environment is development add a console logger
if (isDev) {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  )
}
