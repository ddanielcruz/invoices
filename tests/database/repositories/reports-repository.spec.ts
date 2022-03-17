import { Connection, Repository, getRepository } from 'typeorm'

import faker from '@faker-js/faker'

import { connect } from '../../../src/database/connection'
import { Report } from '../../../src/database/entities'
import { ReportsRepositoryImpl } from '../../../src/database/repositories'
import { FAKE_REPORT } from '../../mocks/factories'

const makeSut = () => {
  const sut = new ReportsRepositoryImpl()
  return { sut }
}

describe('ReportsRepository', () => {
  let connection: Connection
  let repository: Repository<Report>

  beforeAll(async () => {
    connection = await connect()
    repository = getRepository(Report)
    await repository.query('DELETE FROM reports')
  })

  afterEach(async () => {
    await repository.query('DELETE FROM reports')
  })

  afterAll(async () => {
    await connection?.close()
  })

  describe('findById', () => {
    test('should find report by ID', async () => {
      const { sut } = makeSut()
      await repository.save(FAKE_REPORT)
      const foundReport = await sut.findById(FAKE_REPORT.id)
      expect(foundReport).toEqual(FAKE_REPORT)
    })

    test('should return undefined when report is not found', async () => {
      const { sut } = makeSut()
      const foundReport = await sut.findById(faker.datatype.uuid())
      expect(foundReport).toBeFalsy()
    })
  })

  describe('store', () => {
    test('should create a new report when brand new', async () => {
      const { sut } = makeSut()
      await sut.store(FAKE_REPORT)
      const reports = await repository.find()
      expect(reports).toEqual([FAKE_REPORT])
    })

    test('should update report when it already exists', async () => {
      const { sut } = makeSut()
      await repository.save(FAKE_REPORT)
      FAKE_REPORT.key = 'any-key'
      await sut.store(FAKE_REPORT)
      const reports = await repository.find()
      expect(reports).toEqual([{ ...FAKE_REPORT, key: 'any-key' }])
    })
  })
})
