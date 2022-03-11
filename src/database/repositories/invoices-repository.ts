import { getRepository, Repository } from 'typeorm'

import { Invoice } from '../entities'

export interface InvoicesRepository {
  findById(id: string): Promise<Invoice | undefined>
  findByUrl(url: string): Promise<Invoice | undefined>
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

  store(invoice: Invoice): Promise<Invoice> {
    invoice.url = this.sanitizeUrl(invoice.url)
    return this.repository.save(invoice)
  }

  private sanitizeUrl(url: string) {
    return url.toLowerCase().trim()
  }
}
