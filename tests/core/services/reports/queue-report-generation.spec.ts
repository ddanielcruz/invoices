import { ValidationError } from '../../../../src/core/errors'
import {
  QueueReportGeneration,
  QueueReportGenerationData
} from '../../../../src/core/services/reports/queue-report-generation'
import { PROCESS_REPORT_GENERATION } from '../../../../src/queue/jobs/process-report-generation'
import { FAKE_REPORT } from '../../../mocks/factories'
import { makeQueue } from '../../../mocks/infra'
import { makeReportsRepository } from '../../../mocks/repositories'

const makeSut = () => {
  const repositoryStub = makeReportsRepository()
  const queueStub = makeQueue()
  const sut = new QueueReportGeneration(repositoryStub, queueStub)
  return { repositoryStub, queueStub, sut }
}

const FAKE_DATA: QueueReportGenerationData = {
  type: 'PERIOD_DETAILED_PDF',
  data: {
    startDate: '2022-03-20T00:00:00.000Z',
    endDate: '2022-03-22T00:00:00.000Z'
  }
}

describe('QueueReportGeneration', () => {
  test.each([undefined, null, '', 'any-type'])(
    'should throw when type is invalid: %s',
    async (type: any) => {
      const { sut } = makeSut()
      const promise = sut.execute({ ...FAKE_DATA, type })
      await expect(promise).rejects.toThrow(ValidationError)
    }
  )

  test.each([undefined, null, '', 'any-data'])(
    'should throw when data is invalid: "%s"',
    async (data: any) => {
      const { sut } = makeSut()
      const promise = sut.execute({ ...FAKE_DATA, data })
      await expect(promise).rejects.toThrow(ValidationError)
    }
  )

  test('should throw when start date is not valid', async () => {
    const { sut } = makeSut()
    const promise = sut.execute({
      ...FAKE_DATA,
      data: { ...FAKE_DATA.data, startDate: 'any-date' }
    })
    await expect(promise).rejects.toThrow(ValidationError)
  })

  test('should throw when end date is not valid', async () => {
    const { sut } = makeSut()
    const promise = sut.execute({
      ...FAKE_DATA,
      data: { ...FAKE_DATA.data, endDate: 'any-date' }
    })
    await expect(promise).rejects.toThrow(ValidationError)
  })

  test('should create a new report with received data', async () => {
    const { sut, repositoryStub } = makeSut()
    const storeSpy = jest.spyOn(repositoryStub, 'store')
    await sut.execute(FAKE_DATA)
    expect(storeSpy).toHaveBeenCalledWith({
      type: FAKE_DATA.type,
      data: {
        startDate: new Date(FAKE_DATA.data.startDate),
        endDate: new Date(FAKE_DATA.data.endDate)
      },
      status: 'PENDING'
    })
  })

  test('should queue report to be processed', async () => {
    const { sut, repositoryStub, queueStub } = makeSut()
    const addSpy = jest.spyOn(queueStub, 'add')
    jest.spyOn(repositoryStub, 'store').mockResolvedValueOnce(FAKE_REPORT)
    await sut.execute(FAKE_DATA)
    expect(addSpy).toHaveBeenCalledWith(PROCESS_REPORT_GENERATION, FAKE_REPORT.id)
  })

  test('should return created report on success', async () => {
    const { sut, repositoryStub } = makeSut()
    jest.spyOn(repositoryStub, 'store').mockResolvedValueOnce(FAKE_REPORT)
    const report = await sut.execute(FAKE_DATA)
    expect(report).toEqual(FAKE_REPORT)
  })
})
