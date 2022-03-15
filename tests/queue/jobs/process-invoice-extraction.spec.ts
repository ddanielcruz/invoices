import { ExtractionError, InternalServerError, NotFoundError } from '../../../src/core/errors'
import { ProcessInvoiceExtraction } from '../../../src/queue/jobs/process-invoice-extraction'
import { FAKE_COMPANY_WITH_ADDR, FAKE_INVOICE } from '../../mocks/factories'
import {
  makeCompaniesRepository,
  makeInvoicesRepository,
  makePurchasesRepository,
  makeProductsRepository
} from '../../mocks/repositories'
import {
  FAKE_EXTRACTED_COMPANY,
  FAKE_EXTRACTED_INVOICE,
  makeExtractCompany,
  makeExtractInvoice
} from '../../mocks/services'

const makeSut = () => {
  const invoicesRepositoryStub = makeInvoicesRepository()
  const companiesRepositoryStub = makeCompaniesRepository()
  const productsRepositoryStub = makeProductsRepository()
  const purchasesRepositoryStub = makePurchasesRepository()
  const extractCompanyStub = makeExtractCompany()
  const extractInvoiceStub = makeExtractInvoice()
  const sut = new ProcessInvoiceExtraction(
    invoicesRepositoryStub,
    companiesRepositoryStub,
    productsRepositoryStub,
    purchasesRepositoryStub,
    extractCompanyStub,
    extractInvoiceStub
  )

  return {
    sut,
    invoicesRepositoryStub,
    companiesRepositoryStub,
    productsRepositoryStub,
    purchasesRepositoryStub,
    extractCompanyStub,
    extractInvoiceStub
  }
}

const FAKE_ID = 'any-id'

describe('ProcessInvoiceExtraction', () => {
  test('should load invoice using InvoicesRepository', async () => {
    const { sut, invoicesRepositoryStub } = makeSut()
    const findByIdSpy = jest.spyOn(invoicesRepositoryStub, 'findById')
    await sut.execute(FAKE_ID)
    expect(findByIdSpy).toHaveBeenCalledWith(FAKE_ID)
  })

  test('should throw an error when instance is not found', async () => {
    const { sut, invoicesRepositoryStub } = makeSut()
    jest.spyOn(invoicesRepositoryStub, 'findById').mockResolvedValueOnce(undefined)
    const promise = sut.execute(FAKE_ID)
    await expect(promise).rejects.toThrow(NotFoundError)
  })

  test('should extract invoice by URL using ExtractInvoice', async () => {
    const { sut, extractInvoiceStub } = makeSut()
    const executeSpy = jest.spyOn(extractInvoiceStub, 'execute')
    await sut.execute(FAKE_ID)
    expect(executeSpy).toHaveBeenCalledWith(FAKE_INVOICE.url)
  })

  test('should set as FAILURE when invoice fails to be extracted', async () => {
    const { sut, extractInvoiceStub, invoicesRepositoryStub } = makeSut()
    const storeSpy = jest.spyOn(invoicesRepositoryStub, 'store')
    jest
      .spyOn(extractInvoiceStub, 'execute')
      .mockRejectedValueOnce(new ExtractionError('any-message', 'any-code'))
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith({ ...FAKE_INVOICE, status: 'FAILURE' })
  })

  test('should load company by found document using CompaniesRepository', async () => {
    const { sut, companiesRepositoryStub } = makeSut()
    const findByDocumentSpy = jest.spyOn(companiesRepositoryStub, 'findByDocument')
    await sut.execute(FAKE_ID)
    expect(findByDocumentSpy).toHaveBeenCalledWith(FAKE_EXTRACTED_INVOICE.document)
  })

  test('should extract company when not found using ExtractCompany', async () => {
    const { sut, extractCompanyStub } = makeSut()
    const executeSpy = jest.spyOn(extractCompanyStub, 'execute')
    await sut.execute(FAKE_ID)
    expect(executeSpy).toHaveBeenCalledWith(FAKE_EXTRACTED_INVOICE.document)
  })

  test('should set invoice as FAILURE when company is not found in the extraction', async () => {
    const { sut, extractCompanyStub, invoicesRepositoryStub } = makeSut()
    const storeSpy = jest.spyOn(invoicesRepositoryStub, 'store')
    jest.spyOn(extractCompanyStub, 'execute').mockResolvedValueOnce(undefined)
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith({ ...FAKE_INVOICE, status: 'FAILURE' })
  })

  test('should store extracted company using CompaniesRepository', async () => {
    const { sut, companiesRepositoryStub } = makeSut()
    const storeSpy = jest.spyOn(companiesRepositoryStub, 'store')
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith(FAKE_EXTRACTED_COMPANY)
  })

  test("should not extract company when it's found using the repository", async () => {
    const { sut, extractCompanyStub, companiesRepositoryStub } = makeSut()
    const executeSpy = jest.spyOn(extractCompanyStub, 'execute')
    jest
      .spyOn(companiesRepositoryStub, 'findByDocument')
      .mockResolvedValueOnce(FAKE_COMPANY_WITH_ADDR)
    await sut.execute(FAKE_ID)
    expect(executeSpy).not.toHaveBeenCalled()
  })

  test('should load product by reference code and company using ProductsRepository', async () => {
    const { sut, productsRepositoryStub } = makeSut()
    const findByCompanyAndReferenceCodeSpy = jest.spyOn(
      productsRepositoryStub,
      'findByCompanyAndReferenceCode'
    )
    await sut.execute(FAKE_ID)
    expect(findByCompanyAndReferenceCodeSpy).toHaveBeenCalledWith(
      expect.any(String),
      FAKE_EXTRACTED_INVOICE.products[0].referenceCode
    )
  })

  test('should create a new product when it is not found', async () => {
    const { sut, productsRepositoryStub } = makeSut()
    const storeSpy = jest.spyOn(productsRepositoryStub, 'store')
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith({
      companyId: expect.any(String),
      referenceCode: FAKE_EXTRACTED_INVOICE.products[0].referenceCode,
      name: FAKE_EXTRACTED_INVOICE.products[0].name,
      unitOfMeasure: FAKE_EXTRACTED_INVOICE.products[0].unitOfMeasure
    })
  })

  test('should store product purchases grouped by reference code and price', async () => {
    const { sut, purchasesRepositoryStub } = makeSut()
    const storeSpy = jest.spyOn(purchasesRepositoryStub, 'store')
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith([
      {
        invoiceId: expect.any(String),
        productId: expect.any(String),
        price: 10,
        quantity: 2
      },
      {
        invoiceId: expect.any(String),
        productId: expect.any(String),
        price: 12,
        quantity: 1
      },
      {
        invoiceId: expect.any(String),
        productId: expect.any(String),
        price: 10,
        quantity: 1
      }
    ])
  })

  test('should set invoice status to SUCCESS when completed extraction', async () => {
    const { sut, invoicesRepositoryStub } = makeSut()
    const storeSpy = jest.spyOn(invoicesRepositoryStub, 'store')
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith({ ...FAKE_INVOICE, status: 'SUCCESS' })
  })

  test('should set invoice status to FAILURE with error information on custom errors', async () => {
    const { sut, invoicesRepositoryStub, extractInvoiceStub } = makeSut()
    const storeSpy = jest.spyOn(invoicesRepositoryStub, 'store')
    const error = new ExtractionError('any-message', 'any-code')
    jest.spyOn(extractInvoiceStub, 'execute').mockRejectedValueOnce(error)
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith({
      ...FAKE_INVOICE,
      status: 'FAILURE',
      error: error.serialize()
    })
  })

  test('should set invoice status to FAILURE on any unexpected error with error information', async () => {
    const { sut, invoicesRepositoryStub, extractCompanyStub } = makeSut()
    const storeSpy = jest.spyOn(invoicesRepositoryStub, 'store')
    const error = new Error('any-error')
    jest.spyOn(extractCompanyStub, 'execute').mockRejectedValueOnce(error)
    await sut.execute(FAKE_ID)
    expect(storeSpy).toHaveBeenCalledWith({
      ...FAKE_INVOICE,
      status: 'FAILURE',
      error: new InternalServerError(error).serialize()
    })
  })
})
