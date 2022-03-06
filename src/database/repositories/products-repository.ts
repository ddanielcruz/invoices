import { getRepository, Repository } from 'typeorm'

import { Product } from '../entities'

export interface ProductsRepository {
  findByCompanyAndReferenceCode(companyId: string, code: string): Promise<Product | undefined>
  store(product: Product): Promise<Product>
}

export class ProductsRepositoryImpl implements ProductsRepository {
  private readonly repository: Repository<Product>

  constructor() {
    this.repository = getRepository(Product)
  }

  findByCompanyAndReferenceCode(companyId: string, code: string): Promise<Product | undefined> {
    return this.repository.findOne({ companyId, referenceCode: code })
  }

  store(product: Product): Promise<Product> {
    return this.repository.save(product)
  }
}
