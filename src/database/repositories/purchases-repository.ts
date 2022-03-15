import { getRepository, Repository } from 'typeorm'

import { Purchase } from '../entities'

export interface PurchasesRepository {
  findByProduct(productId: string): Promise<Purchase[]>
  store(purchases: Purchase[]): Promise<Purchase[]>
}

export class PurchasesRepositoryImpl implements PurchasesRepository {
  private readonly repository: Repository<Purchase>

  constructor() {
    this.repository = getRepository(Purchase)
  }

  findByProduct(productId: string): Promise<Purchase[]> {
    return this.repository.find({ productId })
  }

  store(purchases: Purchase[]): Promise<Purchase[]> {
    return this.repository.save(purchases)
  }
}
