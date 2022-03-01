import { createConnection, getConnectionOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export async function connect() {
  const options = await getConnectionOptions()
  Object.assign(options, { namingStrategy: new SnakeNamingStrategy() })

  return await createConnection(options)
}
