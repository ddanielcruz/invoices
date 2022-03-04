import { QueueInvoiceExtraction } from '../../../../src/core/services/invoices/queue-invoice-extraction'
import { PROCESS_INVOICE_EXTRACTION } from '../../../../src/queue/jobs/process-invoice-extraction'
import { makeInvoice } from '../../../mocks/factories'
import { makeQueue } from '../../../mocks/infra'
import { makeInvoicesRepository } from '../../../mocks/repositories'

const makeSut = () => {
  const repositoryStub = makeInvoicesRepository()
  const queueStub = makeQueue()
  const sut = new QueueInvoiceExtraction(repositoryStub, queueStub)
  jest.spyOn(repositoryStub, 'findByUrl').mockResolvedValue(undefined)

  return { repositoryStub, queueStub, sut }
}

const FAKE_URL = 'https://www.github.com'

describe('QueueInvoiceExtraction', () => {
  test('should throw when data is invalid', async () => {
    const { sut } = makeSut()
    for (const value of ['', 'invalid-url']) {
      const promise = sut.execute(value)
      await expect(promise).rejects.toThrow()
    }
  })

  test('should verify if invoice was already extracted', async () => {
    const { sut, repositoryStub } = makeSut()
    const findByUrlSpy = jest.spyOn(repositoryStub, 'findByUrl')
    await sut.execute(FAKE_URL)
    expect(findByUrlSpy).toHaveBeenCalledWith(FAKE_URL)
  })

  test.each(['PENDING', 'SUCCESS'])(
    'should ignore request when invoice was already extracted: %s',
    async (status: any) => {
      const { sut, repositoryStub, queueStub } = makeSut()
      const storeSpy = jest.spyOn(repositoryStub, 'store')
      const addSpy = jest.spyOn(queueStub, 'add')
      jest.spyOn(repositoryStub, 'findByUrl').mockResolvedValueOnce(makeInvoice({ status }))
      await sut.execute(FAKE_URL)
      expect(storeSpy).not.toHaveBeenCalled()
      expect(addSpy).not.toHaveBeenCalled()
    }
  )

  test("should create a new invoice when it wasn't extracted yet", async () => {
    const { sut, repositoryStub } = makeSut()
    const storeSpy = jest.spyOn(repositoryStub, 'store')
    await sut.execute(FAKE_URL)
    expect(storeSpy).toHaveBeenCalledWith({
      url: FAKE_URL,
      status: 'PENDING'
    })
  })

  test('should reset existing invoice when it already exists and it failed', async () => {
    const { sut, repositoryStub } = makeSut()
    const storeSpy = jest.spyOn(repositoryStub, 'store')
    const failedExtraction = makeInvoice({ status: 'FAILURE' })
    jest.spyOn(repositoryStub, 'findByUrl').mockResolvedValueOnce(failedExtraction)
    await sut.execute(failedExtraction.url)
    expect(storeSpy).toHaveBeenCalledWith({
      ...failedExtraction,
      error: null,
      status: 'PENDING'
    })
  })

  test('should queue invoice to be extracted', async () => {
    const { sut, queueStub, repositoryStub } = makeSut()
    jest.spyOn(repositoryStub, 'store').mockResolvedValueOnce(makeInvoice({ id: 'any-id' }))
    const addSpy = jest.spyOn(queueStub, 'add')
    await sut.execute(FAKE_URL)
    expect(addSpy).toHaveBeenCalledWith(PROCESS_INVOICE_EXTRACTION, 'any-id')
  })
})
