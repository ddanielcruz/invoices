import { City, Company, Invoice, Product, ProductPurchase } from '../../src/database/entities'
import {
  CitiesRepository,
  CompaniesRepository,
  InvoicesRepository,
  ProductPurchasesRepository,
  ProductsRepository
} from '../../src/database/repositories'
import { FAKE_CITY, FAKE_COMPANY_WITH_ADDR, FAKE_INVOICE, FAKE_STATE } from './factories'

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
      return company
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
      return product
    }
  }
  return new ProductsRepositoryStub()
}

export const makeProductPurchasesRepository = (): ProductPurchasesRepository => {
  class ProductPurchasesRepositoryStub implements ProductPurchasesRepository {
    async findByProduct(): Promise<ProductPurchase[]> {
      return []
    }

    async store(purchases: ProductPurchase[]): Promise<ProductPurchase[]> {
      return purchases
    }
  }
  return new ProductPurchasesRepositoryStub()
}
