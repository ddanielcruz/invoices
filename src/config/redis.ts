export interface RedisConfig {
  host: string
  port: string
  password: string | undefined
}

export const config: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || '6379',
  password: process.env.REDIS_PASS
}
