import { NotFoundError, UnprocessableEntityError } from '../../../src/core/errors'
import { ReportPeriodData } from '../../../src/database/entities'
import { ProcessReportGeneration } from '../../../src/queue/jobs/process-report-generation'
import { makeReport } from '../../mocks/factories'
import { makeReportsRepository } from '../../mocks/repositories'
import {
  makeGeneratePeriodDetailedPDFReport,
  makeGeneratePeriodSummaryCSVReport
} from '../../mocks/services'

const makeSut = () => {
  const repositoryStub = makeReportsRepository()
  const generatePeriodDetailedStub = makeGeneratePeriodDetailedPDFReport()
  const generatePeriodSummaryStub = makeGeneratePeriodSummaryCSVReport()
  const sut = new ProcessReportGeneration(
    repositoryStub,
    generatePeriodDetailedStub,
    generatePeriodSummaryStub
  )

  return { sut, repositoryStub, generatePeriodDetailedStub, generatePeriodSummaryStub }
}

const FAKE_ID = 'any-id'
const FAKE_PERIOD: ReportPeriodData = {
  startDate: new Date(),
  endDate: new Date()
}

describe('ProcessReportGeneration', () => {
  test('should load report using ReportsRepository', async () => {
    const { sut, repositoryStub } = makeSut()
    const findByIdSpy = jest.spyOn(repositoryStub, 'findById')
    await sut.execute(FAKE_ID)
    expect(findByIdSpy).toHaveBeenCalledWith(FAKE_ID)
  })

  test('should throw when report is not found', async () => {
    const { sut, repositoryStub } = makeSut()
    jest.spyOn(repositoryStub, 'findById').mockResolvedValueOnce(undefined)
    const promise = sut.execute(FAKE_ID)
    await expect(promise).rejects.toThrow(NotFoundError)
  })

  test('should generate period detailed report when type is PERIOD_DETAILED_PDF', async () => {
    const { sut, repositoryStub, generatePeriodDetailedStub } = makeSut()
    const executeSpy = jest.spyOn(generatePeriodDetailedStub, 'execute')
    jest
      .spyOn(repositoryStub, 'findById')
      .mockResolvedValueOnce(makeReport({ type: 'PERIOD_DETAILED_PDF', data: FAKE_PERIOD }))
    await sut.execute(FAKE_ID)
    expect(executeSpy).toHaveBeenCalledWith(FAKE_PERIOD)
  })

  test('should generate period summary report when type is PERIOD_SUMMARY_CSV', async () => {
    const { sut, repositoryStub, generatePeriodSummaryStub } = makeSut()
    const executeSpy = jest.spyOn(generatePeriodSummaryStub, 'execute')
    jest
      .spyOn(repositoryStub, 'findById')
      .mockResolvedValueOnce(makeReport({ type: 'PERIOD_SUMMARY_CSV', data: FAKE_PERIOD }))
    await sut.execute(FAKE_ID)
    expect(executeSpy).toHaveBeenCalledWith(FAKE_PERIOD)
  })

  test.each(['PERIOD_DETAILED_PDF', 'PERIOD_SUMMARY_CSV'])(
    'should store report as SUCCESS with generated key on success, type %s',
    async (type: any) => {
      const { sut, repositoryStub } = makeSut()
      const storeSpy = jest.spyOn(repositoryStub, 'store')
      const report = makeReport({ type, data: FAKE_PERIOD })
      jest.spyOn(repositoryStub, 'findById').mockResolvedValueOnce(report)
      await sut.execute(FAKE_ID)
      expect(storeSpy).toHaveBeenCalledWith({
        ...report,
        status: 'SUCCESS',
        key: 'any-key'
      })
    }
  )

  test('should store report as FAILURE when type is not supported/implemented', async () => {
    const { sut, repositoryStub } = makeSut()
    const storeSpy = jest.spyOn(repositoryStub, 'store')
    const report = makeReport({ type: 'any-type' as any })
    jest.spyOn(repositoryStub, 'findById').mockResolvedValueOnce(report)
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith({
      ...report,
      status: 'FAILURE',
      error: {
        error: expect.any(String),
        code: 'UNPROCESSABLE_ENTITY'
      }
    })
  })

  test('should store report with triggered error', async () => {
    const { sut, repositoryStub, generatePeriodDetailedStub } = makeSut()
    const storeSpy = jest.spyOn(repositoryStub, 'store')
    const report = makeReport({ type: 'PERIOD_DETAILED_PDF' })
    jest.spyOn(repositoryStub, 'findById').mockResolvedValueOnce(report)
    jest
      .spyOn(generatePeriodDetailedStub, 'execute')
      .mockRejectedValueOnce(
        new UnprocessableEntityError({ message: 'any-message', code: 'any-code' })
      )
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith({
      ...report,
      status: 'FAILURE',
      error: {
        error: 'any-message',
        code: 'any-code'
      }
    })
  })

  test('should create an internal server error on unknown errors', async () => {
    const { sut, repositoryStub, generatePeriodDetailedStub } = makeSut()
    const storeSpy = jest.spyOn(repositoryStub, 'store')
    const report = makeReport({ type: 'PERIOD_DETAILED_PDF' })
    jest.spyOn(repositoryStub, 'findById').mockResolvedValueOnce(report)
    jest.spyOn(generatePeriodDetailedStub, 'execute').mockRejectedValueOnce(new Error())
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith({
      ...report,
      status: 'FAILURE',
      error: {
        error: expect.any(String),
        code: 'UNKNOWN_ERROR',
        data: expect.anything()
      }
    })
  })
})
