import { Connection, getRepository, Repository } from 'typeorm'

import { connect } from '../../../src/database/connection'
import { City, Country, State } from '../../../src/database/entities'
import { CitiesRepositoryImpl } from '../../../src/database/repositories'
import { FAKE_CITY, FAKE_COUNTRY, FAKE_STATE, makeCity } from '../../mocks/factories'

const makeSut = () => {
  const sut = new CitiesRepositoryImpl()
  return { sut }
}

describe('CitiesRepository', () => {
  let connection: Connection
  let repository: Repository<City>
  let state: State

  beforeAll(async () => {
    connection = await connect()
    repository = getRepository(City)
    await repository.query('DELETE FROM countries')
    await getRepository(Country).save(FAKE_COUNTRY)
    state = await getRepository(State).save(FAKE_STATE)
  })

  afterEach(async () => {
    await repository.query('DELETE FROM cities')
  })

  afterAll(async () => {
    await repository.query('DELETE FROM countries')
    await connection?.close()
  })

  describe('findById', () => {
    test('should find city by ID with state loaded', async () => {
      const { sut } = makeSut()
      const city = await repository.save(FAKE_CITY)
      const foundCity = await sut.findById(city.id)
      expect(foundCity).toBeTruthy()
      expect(foundCity).toEqual({ ...city, state })
    })

    test('should return undefined when city was not found', async () => {
      const { sut } = makeSut()
      const foundCity = await sut.findById(FAKE_CITY.id)
      expect(foundCity).toBeFalsy()
    })
  })

  describe('findByNormalizedName', () => {
    test('should find city by name', async () => {
      const { sut } = makeSut()
      const city = await repository.save(makeCity(state, { name: 'any-name' }))
      const foundCity = await sut.findByNormalizedName(city.name)
      expect(foundCity).toEqual(city)
    })

    test('should find city by normalized name', async () => {
      const { sut } = makeSut()
      const city = await repository.save(makeCity(state, { name: 'any-name' }))
      const foundCity = await sut.findByNormalizedName(city.normalizedName)
      expect(foundCity).toEqual(city)
    })

    test('should return undefined when city is not found', async () => {
      const { sut } = makeSut()
      const foundCity = await sut.findByNormalizedName('any-name')
      expect(foundCity).toBeFalsy()
    })
  })
})
