import { RedisConfig, config as redisConfig } from './redis'

export interface QueueConfig {
  name: string
  connection: RedisConfig
  concurrency: number
}

export const config: QueueConfig = {
  name: process.env.QUEUE_NAME || 'Invoices',
  connection: redisConfig,
  concurrency: Number(process.env.QUEUE_CONCURRENCY) || 2
}
