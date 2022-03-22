import { Between, getRepository, Repository } from 'typeorm'

import { Invoice } from '../entities'

export interface InvoicesRepository {
  findById(id: string): Promise<Invoice | undefined>
  findByUrl(url: string): Promise<Invoice | undefined>
  findManyByPeriod(startDate: Date, endDate: Date): Promise<Invoice[]>
  store(invoice: Invoice): Promise<Invoice>
}

export class InvoicesRepositoryImpl implements InvoicesRepository {
  private readonly repository: Repository<Invoice>

  constructor() {
    this.repository = getRepository(Invoice)
  }

  findById(id: string): Promise<Invoice | undefined> {
    return this.repository.findOne(id)
  }

  findByUrl(url: string): Promise<Invoice | undefined> {
    return this.repository.findOne({ url: this.sanitizeUrl(url) })
  }

  findManyByPeriod(startDate: Date, endDate: Date): Promise<Invoice[]> {
    endDate.setHours(23, 59, 59)
    return this.repository.find({
      where: { issuedAt: Between(startDate, endDate) },
      relations: ['company', 'company.address', 'purchases', 'purchases.product'],
      order: { issuedAt: 'ASC' }
    })
  }

  store(invoice: Invoice): Promise<Invoice> {
    invoice.url = this.sanitizeUrl(invoice.url)
    return this.repository.save(invoice)
  }

  private sanitizeUrl(url: string) {
    return url.toLowerCase().trim()
  }
}
