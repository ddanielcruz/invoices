import { getRepository, Repository } from 'typeorm'

import { ProductPurchase } from '../entities'

export interface ProductPurchasesRepository {
  findByProduct(productId: string): Promise<ProductPurchase[]>
  store(purchase: ProductPurchase): Promise<ProductPurchase>
}

export class ProductPurchasesRepositoryImpl implements ProductPurchasesRepository {
  private readonly repository: Repository<ProductPurchase>

  constructor() {
    this.repository = getRepository(ProductPurchase)
  }

  findByProduct(productId: string): Promise<ProductPurchase[]> {
    return this.repository.find({ productId })
  }

  store(purchase: ProductPurchase): Promise<ProductPurchase> {
    return this.repository.save(purchase)
  }
}
