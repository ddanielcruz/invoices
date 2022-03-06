import { City, Invoice } from '../../src/database/entities'
import { CitiesRepository, InvoicesRepository } from '../../src/database/repositories'
import { FAKE_CITY, FAKE_INVOICE, FAKE_STATE } from './factories'

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

export const makeCitiesRepository = (): CitiesRepository => {
  class CitiesRepositoryStub implements CitiesRepository {
    async searchByNormalizedName(): Promise<City[]> {
      return [{ ...FAKE_CITY, state: FAKE_STATE }]
    }

    async findById(): Promise<City | undefined> {
      return { ...FAKE_CITY, state: FAKE_STATE }
    }
  }

  return new CitiesRepositoryStub()
}
