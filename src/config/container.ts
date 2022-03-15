import { container } from 'tsyringe'

import {
  CitiesRepositoryImpl,
  CompaniesRepositoryImpl,
  InvoicesRepositoryImpl,
  PurchasesRepositoryImpl,
  ProductsRepositoryImpl
} from '../database/repositories'
import { queue } from '../queue'

// Infra
container.registerInstance('Queue', queue)

// Repositories
container.registerSingleton('CitiesRepository', CitiesRepositoryImpl)
container.registerSingleton('CompaniesRepository', CompaniesRepositoryImpl)
container.registerSingleton('InvoicesRepository', InvoicesRepositoryImpl)
container.registerSingleton('ProductsRepository', ProductsRepositoryImpl)
container.registerSingleton('PurchasesRepository', PurchasesRepositoryImpl)
