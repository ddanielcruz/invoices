import { unlink, access } from 'fs/promises'

import { GeneratePeriodDetailedPDFReport } from '../../../../src/core/services/reports/generate-period-detailed-pdf-report'
import { ReportPeriodData } from '../../../../src/database/entities'
import { makeInvoicesRepository } from '../../../mocks/repositories'

const makeSut = () => {
  const repositoryStub = makeInvoicesRepository()
  const sut = new GeneratePeriodDetailedPDFReport(repositoryStub)
  return { sut, repositoryStub }
}

const FAKE_PERIOD: ReportPeriodData = {
  startDate: new Date(2022, 0, 1),
  endDate: new Date()
}

const REPORT_KEY = 'period-detailed-test.pdf'
const reportExists = async (): Promise<boolean> => {
  try {
    await access(`tmp/${REPORT_KEY}`)
    return true
  } catch {
    return false
  }
}

describe('GeneratePeriodDetailedPDFReport', () => {
  test('should generate sample report with fake data', async () => {
    const { sut, repositoryStub } = makeSut()
    const findManyByPeriodSpy = jest.spyOn(repositoryStub, 'findManyByPeriod')
    Date.now = jest.fn().mockReturnValueOnce('test')
    if (await reportExists()) {
      await unlink(`tmp/${REPORT_KEY}`)
    }

    const generatedKey = await sut.execute(FAKE_PERIOD)
    const generatedReport = await reportExists()
    expect(findManyByPeriodSpy).toHaveBeenCalledWith(FAKE_PERIOD.startDate, FAKE_PERIOD.endDate)
    expect(generatedKey).toEqual(REPORT_KEY)
    expect(generatedReport).toBeTruthy()
  })
})
