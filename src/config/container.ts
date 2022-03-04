import { container } from 'tsyringe'

import { InvoicesRepositoryImpl } from '../database/repositories'

// Repositories
container.registerSingleton('InvoicesRepository', InvoicesRepositoryImpl)
