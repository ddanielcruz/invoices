import { Invoice } from '../../src/database/entities'
import { InvoicesRepository } from '../../src/database/repositories'
import { FAKE_INVOICE } from './factories'

export const makeInvoicesRepository = (): InvoicesRepository => {
  class InvoicesRepositoryStub implements InvoicesRepository {
    async findByUrl(): Promise<Invoice | undefined> {
      return FAKE_INVOICE
    }

    async store(invoice: Invoice): Promise<Invoice> {
      return invoice
    }
  }
  return new InvoicesRepositoryStub()
}
