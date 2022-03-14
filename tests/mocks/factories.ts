import faker from '@faker-js/faker'

import { normalizeString } from '../../src/core/helpers'
import {
  Address,
  City,
  Company,
  Country,
  Invoice,
  Product,
  ProductPurchase,
  State
} from '../../src/database/entities'

export const makeInvoice = (other?: Partial<Invoice>): Invoice => {
  const invoice = new Invoice(other?.url ?? faker.internet.url())
  invoice.id = other?.id ?? faker.datatype.uuid()
  invoice.companyId = other?.companyId ?? null
  invoice.status = other?.status ?? 'PENDING'
  invoice.error = other?.error ?? JSON.parse(faker.datatype.json())
  invoice.issuedAt = other?.issuedAt ?? new Date()
  invoice.createdAt = other?.createdAt ?? new Date()

  return invoice
}
export const FAKE_INVOICE = makeInvoice()

export const makeCountry = (other?: Partial<Country>): Country => {
  const country = new Country()
  country.id = other?.id ?? faker.datatype.uuid()
  country.name = other?.name ?? faker.address.country()
  country.code = other?.code ?? faker.address.countryCode()
  return country
}
export const FAKE_COUNTRY = makeCountry()

export const makeState = (country: Country, other?: Partial<State>): State => {
  const state = new State()
  state.id = other?.id ?? faker.datatype.uuid()
  state.countryId = other?.countryId ?? country.id
  state.name = other?.name ?? faker.address.state()
  state.code = other?.code ?? faker.address.stateAbbr()
  return state
}
export const FAKE_STATE = makeState(FAKE_COUNTRY)

export const makeCity = (state: State, other?: Partial<City>): City => {
  const city = new City()
  city.id = other?.id ?? faker.datatype.uuid()
  city.stateId = other?.stateId ?? state.id
  city.name = other?.name ?? faker.address.cityName()
  city.normalizedName = other?.normalizedName ?? normalizeString(city.name)
  return city
}
export const FAKE_CITY = makeCity(FAKE_STATE)

export const makeAddress = (city: City): Address => {
  const address = new Address()
  address.id = faker.datatype.uuid()
  address.cityId = city.id
  address.street = faker.address.streetName()
  address.neighborhood = faker.address.streetName()
  address.zipcode = faker.address.zipCode()
  address.complement = faker.address.secondaryAddress()
  return address
}
export const FAKE_ADDRESS = makeAddress(FAKE_CITY)

export const makeCompany = (address: Address, other?: Partial<Company>): Company => {
  const company = new Company()
  company.id = other?.id ?? faker.datatype.uuid()
  company.addressId = address.id
  company.document = other?.document ?? faker.datatype.string()
  company.companyName = other?.companyName ?? faker.company.companyName()
  company.tradeName = other?.tradeName ?? faker.company.companyName()
  company.createdAt = other?.createdAt ?? new Date()
  return company
}
export const FAKE_COMPANY = makeCompany(FAKE_ADDRESS)
export const FAKE_COMPANY_WITH_ADDR: Company = { ...FAKE_COMPANY, address: FAKE_ADDRESS }

export const makeProdudct = (company: Company, other?: Partial<Product>): Product => {
  const product = new Product()
  product.id = other?.id ?? faker.datatype.uuid()
  product.companyId = company.id
  product.referenceCode = other?.referenceCode ?? faker.datatype.number().toString()
  product.name = other?.name ?? faker.lorem.words()
  product.unitOfMeasure = other?.unitOfMeasure ?? faker.lorem.word()
  product.createdAt = other?.createdAt ?? new Date()
  return product
}
export const FAKE_PRODUCT = makeProdudct(FAKE_COMPANY)

export const makeProductPurchase = (
  invoice: Invoice,
  product: Product,
  other?: Partial<ProductPurchase>
): ProductPurchase => {
  const purchase = new ProductPurchase()
  purchase.invoiceId = invoice.id
  purchase.productId = product.id
  purchase.price = other?.price ?? faker.datatype.number()
  purchase.quantity = other?.quantity ?? faker.datatype.number()
  return purchase
}
export const FAKE_PRODUCT_PURCHASE = makeProductPurchase(FAKE_INVOICE, FAKE_PRODUCT)
