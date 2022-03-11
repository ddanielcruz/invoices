import { Connection, getRepository, Repository } from 'typeorm'

import faker from '@faker-js/faker'

import { connect } from '../../../src/database/connection'
import { Invoice } from '../../../src/database/entities'
import { InvoicesRepositoryImpl } from '../../../src/database/repositories'
import { makeInvoice } from '../../mocks/factories'

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
    await repository.query('DELETE FROM invoices')
  })

  afterEach(async () => {
    await repository.query('DELETE FROM invoices')
  })

  afterAll(async () => {
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
})
