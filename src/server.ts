import { api } from './api'
import { logger } from './config/logger'

const port = process.env.PORT || 3000

api.listen(port, () => {
  logger.info(`Successfully started server on port ${port}`)
})

process.on('SIGTERM', () => {
  return process.exit()
})
