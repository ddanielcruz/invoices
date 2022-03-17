import faker from '@faker-js/faker'

import { City, Company, Invoice, Product, Purchase, Report } from '../../src/database/entities'
import {
  CitiesRepository,
  CompaniesRepository,
  InvoicesRepository,
  PurchasesRepository,
  ProductsRepository,
  ReportsRepository
} from '../../src/database/repositories'
import {
  FAKE_CITY,
  FAKE_COMPANY_WITH_ADDR,
  FAKE_INVOICE,
  FAKE_REPORT,
  FAKE_STATE
} from './factories'

export const makeInvoicesRepository = (): InvoicesRepository => {
  class InvoicesRepositoryStub implements InvoicesRepository {
    async findById(): Promise<Invoice | undefined> {
      return FAKE_INVOICE
    }

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

export const makeCompaniesRepository = (): CompaniesRepository => {
  class CompaniesRepositoryStub implements CompaniesRepository {
    async findByDocument(): Promise<Company | undefined> {
      return undefined
    }

    async findById(): Promise<Company | undefined> {
      return FAKE_COMPANY_WITH_ADDR
    }

    async store(company: Company): Promise<Company> {
      return { ...company, id: company.id ?? faker.datatype.uuid() }
    }
  }
  return new CompaniesRepositoryStub()
}

export const makeProductsRepository = (): ProductsRepository => {
  class ProductsRepositoryStub implements ProductsRepository {
    async findByCompanyAndReferenceCode(): Promise<Product | undefined> {
      return undefined
    }

    async store(product: Product): Promise<Product> {
      return { ...product, id: product.id ?? faker.datatype.uuid() }
    }
  }
  return new ProductsRepositoryStub()
}

export const makePurchasesRepository = (): PurchasesRepository => {
  class PurchasesRepositoryStub implements PurchasesRepository {
    async findByProduct(): Promise<Purchase[]> {
      return []
    }

    async store(purchases: Purchase[]): Promise<Purchase[]> {
      return purchases
    }
  }
  return new PurchasesRepositoryStub()
}

export const makeReportsRepository = (): ReportsRepository => {
  class ReportsRepositoryStub implements ReportsRepository {
    async findById(): Promise<Report | undefined> {
      return FAKE_REPORT
    }

    async store(report: Report): Promise<Report> {
      return report
    }
  }
  return new ReportsRepositoryStub()
}
