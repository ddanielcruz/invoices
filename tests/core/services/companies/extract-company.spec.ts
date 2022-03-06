import { readFile } from 'fs/promises'
import path from 'path'

import { ExtractCompany } from '../../../../src/core/services/companies/extract-company'
import { Company } from '../../../../src/database/entities'
import { FAKE_COUNTRY, FAKE_STATE, makeCity, makeState } from '../../../mocks/factories'
import { makeCitiesRepository } from '../../../mocks/repositories'

const makeSut = () => {
  const citiesRepositoryStub = makeCitiesRepository()
  const sut = new ExtractCompany(citiesRepositoryStub)
  FAKE_STATE.name = 'Rio Grande do Sul'

  return { sut, citiesRepositoryStub }
}

const VALID_DOC = '11591248000190'
const INVALID_DOC = '22222248000190'
const NO_TRADE_NAME_DOC = '39736635000197'

jest.mock('axios', () => ({
  get: jest.fn(async (url: string) => {
    if (url.endsWith(INVALID_DOC)) {
      return { data: 'any-data' }
    }

    const filename = url.endsWith(VALID_DOC) ? 'found-company' : 'found-company-no-trade-name'
    const filepath = path.resolve(__dirname, '..', '..', '..', 'fixtures', `${filename}.html`)
    const data = await readFile(filepath)

    return { data }
  })
}))

describe('ExtractCompany', () => {
  test('should return undefined when data not found', async () => {
    const { sut } = makeSut()
    const company = await sut.execute(INVALID_DOC)
    expect(company).toBeFalsy()
  })

  test('should find city using CitiesRepository', async () => {
    const { sut, citiesRepositoryStub } = makeSut()
    const searchByNormalizedNameSpy = jest.spyOn(citiesRepositoryStub, 'searchByNormalizedName')
    await sut.execute(VALID_DOC)
    expect(searchByNormalizedNameSpy).toHaveBeenCalled()
  })

  test('should throw when city is not found', async () => {
    const { sut, citiesRepositoryStub } = makeSut()
    jest.spyOn(citiesRepositoryStub, 'searchByNormalizedName').mockResolvedValueOnce([])
    const promise = sut.execute(VALID_DOC)
    await expect(promise).rejects.toThrow()
  })

  test('should throw when find a city but from different state', async () => {
    const { sut, citiesRepositoryStub } = makeSut()
    jest
      .spyOn(citiesRepositoryStub, 'searchByNormalizedName')
      .mockResolvedValueOnce([makeCity(makeState(FAKE_COUNTRY, { name: 'any-state' }))])
    const promise = sut.execute(VALID_DOC)
    await expect(promise).rejects.toThrow()
  })

  test('should return a company on success', async () => {
    const { sut } = makeSut()
    const company = await sut.execute(VALID_DOC)
    expect(company).toBeTruthy()
    expect(company).toBeInstanceOf(Company)
  })

  test('should use company name when trade name is empty', async () => {
    const { sut } = makeSut()
    const company = await sut.execute(NO_TRADE_NAME_DOC)
    expect(company).toBeTruthy()
    expect(company?.companyName).toBe(company?.tradeName)
  })
})
