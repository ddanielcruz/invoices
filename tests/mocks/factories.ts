import faker from '@faker-js/faker'

import { Invoice } from '../../src/database/entities'

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
