import { ValidationError } from '../../../../src/core/errors'
import {
  FindManyByPeriod,
  FindManyByPeriodData
} from '../../../../src/core/services/invoices/find-many-by-period'
import { FAKE_INVOICE } from '../../../mocks/factories'
import { makeInvoicesRepository } from '../../../mocks/repositories'

const makeSut = () => {
  const repositoryStub = makeInvoicesRepository()
  const sut = new FindManyByPeriod(repositoryStub)
  return { repositoryStub, sut }
}

const FAKE_DATA: FindManyByPeriodData = {
  startDate: '2022-03-20T00:00:00.000Z',
  endDate: '2022-03-21T00:00:00.000Z'
}

describe('FindManyByPeriod', () => {
  test.each([undefined, null, '', 'any-date'])(
    'should throw when start date is not valid: "%s"',
    async (startDate: any) => {
      const { sut } = makeSut()
      const promise = sut.execute({ ...FAKE_DATA, startDate })
      await expect(promise).rejects.toThrow(ValidationError)
    }
  )

  test.each([undefined, null, '', 'any-date'])(
    'should throw when end date is not valid: "%s"',
    async (endDate: any) => {
      const { sut } = makeSut()
      const promise = sut.execute({ ...FAKE_DATA, endDate })
      await expect(promise).rejects.toThrow(ValidationError)
    }
  )

  test('should find invoices by period using InvoicesRepository', async () => {
    const { sut, repositoryStub } = makeSut()
    const findManyByPeriodSpy = jest.spyOn(repositoryStub, 'findManyByPeriod')
    await sut.execute(FAKE_DATA)
    expect(findManyByPeriodSpy).toHaveBeenCalled()
  })

  test('should find invoices using parsed dates', async () => {
    const { sut, repositoryStub } = makeSut()
    const findManyByPeriodSpy = jest.spyOn(repositoryStub, 'findManyByPeriod')
    await sut.execute(FAKE_DATA)
    expect(findManyByPeriodSpy).toHaveBeenCalledWith(
      new Date(FAKE_DATA.startDate),
      new Date(FAKE_DATA.endDate)
    )
  })

  test('should return a list of invoices on success', async () => {
    const { sut } = makeSut()
    const invoices = await sut.execute(FAKE_DATA)
    expect(invoices.length).toBe(2)
    expect(invoices[0].id).toBe(FAKE_INVOICE.id)
  })

  test('should return an empty list when no invoice was found', async () => {
    const { sut, repositoryStub } = makeSut()
    jest.spyOn(repositoryStub, 'findManyByPeriod').mockResolvedValueOnce([])
    const invoices = await sut.execute(FAKE_DATA)
    expect(invoices.length).toBe(0)
  })
})
