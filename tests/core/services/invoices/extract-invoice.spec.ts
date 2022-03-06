import { readFile } from 'fs/promises'
import path from 'path'

import { ExtractInvoice } from '../../../../src/core/services/invoices/extract-invoice'

const FOUND_URL = 'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx?p=found'
const NOT_FOUND_URL = 'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx?p=not-found'
const FAKE_URL = 'https://www.google.com'

jest.mock('axios', () => ({
  get: jest.fn(async (url: string) => {
    if (url.includes('not-found')) {
      return { data: '' }
    }

    const filepath = path.resolve(__dirname, '..', '..', '..', 'fixtures', 'found-invoice.html')
    const data = await readFile(filepath)

    return { data: { toString: () => data.toString() } }
  })
}))

const makeSut = () => {
  const sut = new ExtractInvoice()
  return { sut }
}

describe('ExtractInvoice', () => {
  test("should throw when URL doesn't include the invoice ID", async () => {
    const { sut } = makeSut()
    const promise = sut.execute(FAKE_URL)
    await expect(promise).rejects.toThrow()
  })

  test('should throw when issue date not found', async () => {
    const { sut } = makeSut()
    const promise = sut.execute(NOT_FOUND_URL)
    await expect(promise).rejects.toThrow()
  })

  test('should parse received information', async () => {
    const { sut } = makeSut()
    const invoice = await sut.execute(FOUND_URL)
    expect(invoice.document).toBe('13.221.164/0001-90')
    expect(invoice.issueDate.getTime()).toBe(1636028777000)
    expect(invoice.products.length).toBe(5)
    expect(invoice.products[0]).toEqual({
      referenceCode: '934',
      name: 'Mel Sulmel 1kg',
      unitOfMeasure: 'UN',
      price: 33
    })
  })
})
