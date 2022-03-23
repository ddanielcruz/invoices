import { ExtractCompany } from '../../src/core/services/companies/extract-company'
import { ExtractInvoice, Invoice } from '../../src/core/services/invoices/extract-invoice'
import { GeneratePeriodDetailedPDFReport } from '../../src/core/services/reports/generate-period-detailed-pdf-report'
import { GeneratePeriodSummaryCSVReport } from '../../src/core/services/reports/generate-period-summary-csv-report'
import { Address, Company } from '../../src/database/entities'

export const FAKE_EXTRACTED_COMPANY = {
  document: 'any-document',
  companyName: 'any-company-name',
  tradeName: 'any-trade-name',
  address: {
    street: 'any-street',
    complement: 'any-complement',
    neighborhood: 'any-neighborhood',
    zipcode: 'any-zipcode',
    cityId: 'any-city-id'
  } as Address
} as Company

export const makeExtractCompany = (): ExtractCompany => {
  class ExtractCompanyStub implements Partial<ExtractCompany> {
    async execute(formattedDocument: string): Promise<Company | undefined> {
      return { ...FAKE_EXTRACTED_COMPANY, document: formattedDocument }
    }
  }
  return new ExtractCompanyStub() as any
}

export const FAKE_EXTRACTED_INVOICE: Invoice = {
  document: 'any-document',
  issueDate: new Date(),
  products: [
    {
      name: 'any-name',
      referenceCode: 'any-code',
      unitOfMeasure: 'any-unit-of-measure',
      quantity: 1,
      price: 10
    },
    {
      name: 'any-name',
      referenceCode: 'any-code',
      unitOfMeasure: 'any-unit-of-measure',
      quantity: 1,
      price: 10
    },
    {
      name: 'any-name',
      referenceCode: 'any-code',
      unitOfMeasure: 'any-unit-of-measure',
      quantity: 1,
      price: 12
    },
    {
      name: 'other-name',
      referenceCode: 'other-code',
      unitOfMeasure: 'other-unit-of-measure',
      quantity: 1,
      price: 10
    }
  ]
}

export const makeExtractInvoice = (): ExtractInvoice => {
  class ExtractInvoiceStub implements Partial<ExtractInvoice> {
    async execute(): Promise<Invoice> {
      return FAKE_EXTRACTED_INVOICE
    }
  }
  return new ExtractInvoiceStub() as any
}

export const makeGeneratePeriodDetailedPDFReport = (): GeneratePeriodDetailedPDFReport => {
  class GeneratePeriodDetailedPDFReportStub implements Partial<GeneratePeriodDetailedPDFReport> {
    async execute() {
      return 'any-key'
    }
  }
  return new GeneratePeriodDetailedPDFReportStub() as any
}

export const makeGeneratePeriodSummaryCSVReport = (): GeneratePeriodSummaryCSVReport => {
  class GeneratePeriodSummaryCSVReportStub implements Partial<GeneratePeriodSummaryCSVReport> {
    async execute() {
      return 'any-key'
    }
  }
  return new GeneratePeriodSummaryCSVReportStub() as any
}
