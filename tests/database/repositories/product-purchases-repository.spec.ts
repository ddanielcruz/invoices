import { Connection, getRepository, Repository } from 'typeorm'

import faker from '@faker-js/faker'

import { connect } from '../../../src/database/connection'
import {
  City,
  Company,
  Country,
  Invoice,
  Product,
  ProductPurchase,
  State
} from '../../../src/database/entities'
import { ProductPurchasesRepositoryImpl } from '../../../src/database/repositories'
import {
  FAKE_COUNTRY,
  FAKE_STATE,
  FAKE_CITY,
  FAKE_COMPANY_WITH_ADDR,
  FAKE_PRODUCT,
  FAKE_PRODUCT_PURCHASE,
  FAKE_INVOICE
} from '../../mocks/factories'

const makeSut = () => {
  const sut = new ProductPurchasesRepositoryImpl()
  return { sut }
}

describe('ProductPurchasesRepository', () => {
  let connection: Connection
  let repository: Repository<ProductPurchase>

  beforeAll(async () => {
    connection = await connect()
    repository = getRepository(ProductPurchase)
    await getRepository(Invoice).save(FAKE_INVOICE)
    await getRepository(Country).save(FAKE_COUNTRY)
    await getRepository(State).save(FAKE_STATE)
    await getRepository(City).save(FAKE_CITY)
    await getRepository(Company).save(FAKE_COMPANY_WITH_ADDR)
    await getRepository(Product).save(FAKE_PRODUCT)
    await repository.query('DELETE FROM product_purchases')
  })

  afterEach(async () => {
    await repository.query('DELETE FROM product_purchases')
  })

  afterAll(async () => {
    for (const table of ['companies', 'addresses', 'countries', 'invoices']) {
      await repository.query(`DELETE FROM ${table}`)
    }

    await connection?.close()
  })

  describe('findByProduct', () => {
    test('should find purchases by product', async () => {
      const { sut } = makeSut()
      await repository.save(FAKE_PRODUCT_PURCHASE)
      const foundPurchases = await sut.findByProduct(FAKE_PRODUCT.id)
      expect(foundPurchases.length).toBe(1)
      expect(foundPurchases[0]).toEqual(FAKE_PRODUCT_PURCHASE)
    })

    test('should return an empty list when product is not found', async () => {
      const { sut } = makeSut()
      const foundPurchases = await sut.findByProduct(faker.datatype.uuid())
      expect(foundPurchases.length).toBe(0)
    })

    test("should return an empty list when product doesn't have any purchase", async () => {
      const { sut } = makeSut()
      const foundPurchases = await sut.findByProduct(FAKE_PRODUCT.id)
      expect(foundPurchases.length).toBe(0)
    })
  })

  describe('store', () => {
    test('should create a new purchase when brand new', async () => {
      const { sut } = makeSut()
      await sut.store(FAKE_PRODUCT_PURCHASE)
      const existingPurchases = await repository.find()
      expect(existingPurchases).toEqual([FAKE_PRODUCT_PURCHASE])
    })

    test('should update purchase when already exists', async () => {
      const { sut } = makeSut()
      await repository.save(FAKE_PRODUCT_PURCHASE)
      FAKE_PRODUCT_PURCHASE.price = 10
      await sut.store(FAKE_PRODUCT_PURCHASE)
      const existingPurchases = await repository.find()
      expect(existingPurchases).toEqual([FAKE_PRODUCT_PURCHASE])
    })
  })
})
