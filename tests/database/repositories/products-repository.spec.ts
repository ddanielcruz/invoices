import { Connection, getRepository, Repository } from 'typeorm'

import faker from '@faker-js/faker'

import { connect } from '../../../src/database/connection'
import { City, Company, Country, Product, State } from '../../../src/database/entities'
import { ProductsRepositoryImpl } from '../../../src/database/repositories'
import {
  FAKE_CITY,
  FAKE_COMPANY_WITH_ADDR,
  FAKE_COUNTRY,
  FAKE_PRODUCT,
  FAKE_STATE
} from '../../mocks/factories'

const makeSut = () => {
  const sut = new ProductsRepositoryImpl()
  return { sut }
}

describe('ProductsRepository', () => {
  let connection: Connection
  let repository: Repository<Product>

  beforeAll(async () => {
    connection = await connect()
    repository = getRepository(Product)
    await getRepository(Country).save(FAKE_COUNTRY)
    await getRepository(State).save(FAKE_STATE)
    await getRepository(City).save(FAKE_CITY)
    await getRepository(Company).save(FAKE_COMPANY_WITH_ADDR)
    await repository.query('DELETE FROM products')
  })

  afterEach(async () => {
    await repository.query('DELETE FROM products')
  })

  afterAll(async () => {
    for (const table of ['companies', 'addresses', 'countries']) {
      await repository.query(`DELETE FROM ${table}`)
    }

    await connection?.close()
  })

  describe('findByCompanyAndReferenceCode', () => {
    test('should find a product by company and reference code', async () => {
      const { sut } = makeSut()
      await repository.save(FAKE_PRODUCT)
      const foundProduct = await sut.findByCompanyAndReferenceCode(
        FAKE_PRODUCT.companyId,
        FAKE_PRODUCT.referenceCode
      )
      expect(foundProduct).toEqual(FAKE_PRODUCT)
    })

    test('should return undefined when product is not found', async () => {
      const { sut } = makeSut()
      const foundProduct = await sut.findByCompanyAndReferenceCode(
        faker.datatype.uuid(),
        'any-code'
      )
      expect(foundProduct).toBeFalsy()
    })
  })

  describe('store', () => {
    test('should create a new product when brand new', async () => {
      const { sut } = makeSut()
      await sut.store(FAKE_PRODUCT)
      const existingProducts = await repository.find()
      expect(existingProducts.length).toBe(1)
      expect(existingProducts[0]).toEqual(FAKE_PRODUCT)
    })

    test('should update product when already exists', async () => {
      const { sut } = makeSut()
      await repository.save(FAKE_PRODUCT)
      FAKE_PRODUCT.name = 'any-name'
      await sut.store(FAKE_PRODUCT)
      const existingProducts = await repository.find()
      expect(existingProducts.length).toBe(1)
      expect(existingProducts[0].name).toBe('any-name')
    })
  })
})
