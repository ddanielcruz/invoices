import { Queue } from 'bullmq'

import { config } from '../config/queue'

export const queue = new Queue(config.name, {
  connection: config.connection
})
