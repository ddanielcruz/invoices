import { Connection, getRepository, Repository } from 'typeorm'

import * as database from '../../../src/database/connection'
import { Address, City, Company, Country, State } from '../../../src/database/entities'
import { CompaniesRepositoryImpl } from '../../../src/database/repositories/companies-repository'
import {
  FAKE_ADDRESS,
  FAKE_CITY,
  FAKE_COMPANY_WITH_ADDR,
  FAKE_COUNTRY,
  FAKE_STATE
} from '../../mocks/factories'

const makeSut = () => {
  const sut = new CompaniesRepositoryImpl()
  return { sut }
}

describe('CompaniesRepository', () => {
  let connection: Connection
  let companiesRepository: Repository<Company>
  let addressesRepository: Repository<Address>

  const cleanDatabase = async () => {
    for (const table of ['companies', 'addresses', 'countries']) {
      await companiesRepository.query(`DELETE FROM ${table}`)
    }
  }

  beforeAll(async () => {
    connection = await database.connect()
    companiesRepository = getRepository(Company)
    addressesRepository = getRepository(Address)
    cleanDatabase()
    await getRepository(Country).save(FAKE_COUNTRY)
    await getRepository(State).save(FAKE_STATE)
    await getRepository(City).save(FAKE_CITY)
  })

  afterEach(async () => {
    await companiesRepository.query('DELETE FROM companies')
  })

  afterAll(async () => {
    cleanDatabase()
    await connection?.close()
  })

  describe('findByDocument', () => {
    test('should find by document', async () => {
      const { sut } = makeSut()
      const company = await companiesRepository.save(FAKE_COMPANY_WITH_ADDR)
      const foundCompany = await sut.findByDocument(company.document)
      expect(foundCompany).toEqual(company)
    })

    test('should load company address', async () => {
      const { sut } = makeSut()
      const company = await companiesRepository.save(FAKE_COMPANY_WITH_ADDR)
      const foundCompany = await sut.findByDocument(company.document)
      expect(foundCompany).toEqual(company)
      expect(foundCompany?.address).toBeTruthy()
    })

    test('should return undefined when not found', async () => {
      const { sut } = makeSut()
      const foundCompany = await sut.findByDocument('any-document')
      expect(foundCompany).toBeFalsy()
    })
  })

  describe('store', () => {
    test('should create a new company when brand new', async () => {
      const { sut } = makeSut()
      const createdCompany = await sut.store(FAKE_COMPANY_WITH_ADDR)
      const companies = await companiesRepository.find()
      expect(companies.length).toBe(1)
      expect(companies[0]).toEqual({ ...createdCompany, address: undefined })
    })

    test('should update company when it already exists', async () => {
      const { sut } = makeSut()
      const company = await companiesRepository.save(FAKE_COMPANY_WITH_ADDR)
      company.document = 'other-document'
      const updatedCompany = await sut.store(company)
      const companies = await companiesRepository.find()
      expect(companies.length).toBe(1)
      expect(companies[0]).toEqual({ ...updatedCompany, address: undefined })
    })

    test("should create a new address when it doesn't exist", async () => {
      const { sut } = makeSut()
      await sut.store(FAKE_COMPANY_WITH_ADDR)
      const addresses = await addressesRepository.find()
      expect(addresses.length).toBe(1)
      expect(addresses[0]).toEqual(FAKE_ADDRESS)
    })

    test('should update the existing address when it exists', async () => {
      const { sut } = makeSut()
      const company = await companiesRepository.save(FAKE_COMPANY_WITH_ADDR)
      company.address!.complement = 'any-complement'
      await sut.store(company)
      const addresses = await addressesRepository.find()
      expect(addresses.length).toBe(1)
      expect(addresses[0].complement).toEqual('any-complement')
    })
  })

  describe('findById', () => {
    test('should find company by ID', async () => {
      const { sut } = makeSut()
      await companiesRepository.save(FAKE_COMPANY_WITH_ADDR)
      const foundCompany = await sut.findById(FAKE_COMPANY_WITH_ADDR.id)
      expect(foundCompany).toBeTruthy()
      expect(foundCompany).toEqual(FAKE_COMPANY_WITH_ADDR)
    })

    test('should return undefined when company is not found', async () => {
      const { sut } = makeSut()
      const foundCompany = await sut.findById(FAKE_COMPANY_WITH_ADDR.id)
      expect(foundCompany).toBeFalsy()
    })
  })
})
