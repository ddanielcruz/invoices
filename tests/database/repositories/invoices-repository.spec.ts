import { Connection, getRepository, Repository } from 'typeorm'

import faker from '@faker-js/faker'

import { connect } from '../../../src/database/connection'
import {
  Address,
  City,
  Company,
  Country,
  Invoice,
  Product,
  Purchase,
  State
} from '../../../src/database/entities'
import { InvoicesRepositoryImpl } from '../../../src/database/repositories'
import {
  FAKE_ADDRESS,
  FAKE_CITY,
  FAKE_COMPANY,
  FAKE_COUNTRY,
  FAKE_INVOICE,
  FAKE_PRODUCT,
  FAKE_PURCHASE,
  FAKE_STATE,
  makeInvoice
} from '../../mocks/factories'

const makeSut = () => {
  const sut = new InvoicesRepositoryImpl()
  return { sut }
}

describe('InvoicesRepository', () => {
  let connection: Connection
  let repository: Repository<Invoice>

  beforeAll(async () => {
    connection = await connect()
    repository = getRepository(Invoice)
    await getRepository(Country).save(FAKE_COUNTRY)
    await getRepository(State).save(FAKE_STATE)
    await getRepository(City).save(FAKE_CITY)
    await getRepository(Address).save(FAKE_ADDRESS)
    await getRepository(Company).save(FAKE_COMPANY)
    await getRepository(Product).save(FAKE_PRODUCT)
    await repository.query('DELETE FROM invoices')
  })

  afterEach(async () => {
    await repository.query('DELETE FROM invoices')
  })

  afterAll(async () => {
    const tables = ['companies', 'addresses', 'countries', 'invoices']
    const query = tables.map(table => `DELETE FROM ${table}`).join(';')
    await repository.query(query)
    await connection?.close()
  })

  describe('findById', () => {
    test('should find invoice by ID', async () => {
      const { sut } = makeSut()
      const invoice = await repository.save(makeInvoice())
      const foundInvoice = await sut.findById(invoice.id)
      expect(foundInvoice).toEqual(invoice)
    })

    test('should return undefined when invoice is not found', async () => {
      const { sut } = makeSut()
      const foundInvoice = await sut.findById(faker.datatype.uuid())
      expect(foundInvoice).toBeFalsy()
    })
  })

  describe('findByUrl', () => {
    test('should find invoice by URL', async () => {
      const { sut } = makeSut()
      const invoice = await repository.save(makeInvoice())
      const foundInvoice = await sut.findByUrl(invoice.url)
      expect(foundInvoice).toEqual(invoice)
    })

    test('should find invoice by URL in different case', async () => {
      const { sut } = makeSut()
      const invoice = await repository.save(makeInvoice())
      const foundInvoice = await sut.findByUrl(invoice.url.toUpperCase())
      expect(foundInvoice).toEqual(invoice)
    })

    test('should find invoice by URL with extra spaces', async () => {
      const { sut } = makeSut()
      const invoice = await repository.save(makeInvoice())
      const foundInvoice = await sut.findByUrl(` ${invoice.url} `)
      expect(foundInvoice).toEqual(invoice)
    })

    test('should return undefined when invoice is not found', async () => {
      const { sut } = makeSut()
      const foundInvoice = await sut.findByUrl('any-url')
      expect(foundInvoice).toBeFalsy()
    })
  })

  describe('store', () => {
    test('should create a new invoice when brand new', async () => {
      const { sut } = makeSut()
      const invoice = await sut.store(makeInvoice())
      const existingInvoices = await repository.find()
      expect(existingInvoices.length).toBe(1)
      expect(existingInvoices[0]).toEqual(invoice)
    })

    test('should update invoice when already exists', async () => {
      const { sut } = makeSut()
      const existingInvoice = await repository.save(makeInvoice())
      existingInvoice.url = 'other-url'
      const updatedInvoice = await sut.store(existingInvoice)
      const existingInvoices = await repository.find()
      expect(existingInvoices.length).toBe(1)
      expect(existingInvoices[0]).toEqual(updatedInvoice)
      expect(updatedInvoice).toEqual(existingInvoice)
    })

    test('should sanitize URL before storing', async () => {
      const { sut } = makeSut()
      await sut.store(makeInvoice({ url: 'ANY-URL' }))
      const existingInvoices = await repository.find()
      expect(existingInvoices[0].url).toBe('any-url')
    })
  })

  describe('findManyByPeriod', () => {
    const startDate = new Date(2022, 0, 1)
    const endDate = new Date(2022, 1, 1)
    const betweenDates = [
      new Date(2022, 0, 1, 12),
      new Date(2022, 0, 15),
      new Date(2022, 0, 16),
      new Date(2022, 1, 1, 12)
    ]

    test('should find invoices between start and end date', async () => {
      const { sut } = makeSut()
      await repository.save([
        makeInvoice({ companyId: FAKE_COMPANY.id, issuedAt: betweenDates[1] }),
        makeInvoice({ companyId: FAKE_COMPANY.id, issuedAt: betweenDates[2] })
      ])
      const foundInvoices = await sut.findManyByPeriod(startDate, endDate)
      expect(foundInvoices.length).toBe(2)
    })

    test('should include invoice company and purchase information', async () => {
      const { sut } = makeSut()
      const invoice = makeInvoice({ companyId: FAKE_COMPANY.id, issuedAt: betweenDates[1] })
      await repository.save(invoice)
      const purchase = await getRepository(Purchase).save({
        ...FAKE_PURCHASE,
        invoiceId: invoice.id
      })
      const [foundInvoice] = await sut.findManyByPeriod(startDate, endDate)
      expect(foundInvoice).toEqual({
        ...invoice,
        company: {
          ...FAKE_COMPANY,
          address: {
            ...FAKE_ADDRESS,
            city: FAKE_CITY
          }
        },
        purchases: [{ ...purchase, product: FAKE_PRODUCT }]
      })
    })

    test('should ignore invoices without an issue date', async () => {
      const { sut } = makeSut()
      await repository.save({ ...FAKE_INVOICE, issuedAt: null })
      const foundInvoices = await sut.findManyByPeriod(startDate, endDate)
      expect(foundInvoices.length).toBe(0)
    })

    test('should ignore invoices outside the target period', async () => {
      const { sut } = makeSut()
      await repository.save({ ...FAKE_INVOICE, issuedAt: new Date(2021, 0, 1) })
      const foundInvoices = await sut.findManyByPeriod(startDate, endDate)
      expect(foundInvoices.length).toBe(0)
    })

    test('should include invoices issued at the start date', async () => {
      const { sut } = makeSut()
      await repository.save(makeInvoice({ companyId: FAKE_COMPANY.id, issuedAt: betweenDates[0] }))
      const foundInvoices = await sut.findManyByPeriod(startDate, endDate)
      expect(foundInvoices.length).toBe(1)
    })

    test('should include invoices issued at the end date', async () => {
      const { sut } = makeSut()
      await repository.save(makeInvoice({ companyId: FAKE_COMPANY.id, issuedAt: betweenDates[3] }))
      const foundInvoices = await sut.findManyByPeriod(startDate, endDate)
      expect(foundInvoices.length).toBe(1)
    })

    test('should order invoices by issue date', async () => {
      const { sut } = makeSut()
      const invoiceOne = makeInvoice({ companyId: FAKE_COMPANY.id, issuedAt: betweenDates[2] })
      const invoiceTwo = makeInvoice({ companyId: FAKE_COMPANY.id, issuedAt: betweenDates[1] })
      await repository.save([invoiceOne, invoiceTwo])
      const foundInvoices = await sut.findManyByPeriod(startDate, endDate)
      expect(foundInvoices.length).toBe(2)
      expect(foundInvoices[0].id).toBe(invoiceTwo.id)
      expect(foundInvoices[1].id).toBe(invoiceOne.id)
    })
  })
})
