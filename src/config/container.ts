import { container } from 'tsyringe'

import { InvoicesRepositoryImpl } from '../database/repositories'
import { queue } from '../queue'

// Infra
container.registerInstance('Queue', queue)

// Repositories
container.registerSingleton('InvoicesRepository', InvoicesRepositoryImpl)
