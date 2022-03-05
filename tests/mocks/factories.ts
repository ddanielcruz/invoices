import faker from '@faker-js/faker'

import { normalizeString } from '../../src/core/helpers'
import { City, Country, Invoice, State } from '../../src/database/entities'

export const makeInvoice = (other?: Partial<Invoice>): Invoice => {
  const invoice = new Invoice(other?.url ?? faker.internet.url())
  invoice.id = other?.id ?? faker.datatype.uuid()
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
