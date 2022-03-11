import { inject, singleton } from 'tsyringe'

import { logger } from '../../config/logger'
import { AppError, ExtractionError, InternalServerError, NotFoundError } from '../../core/errors'
import { ExtractCompany } from '../../core/services/companies/extract-company'
import { ExtractInvoice, InvoiceProduct } from '../../core/services/invoices/extract-invoice'
import { Company, Product, ProductPurchase } from '../../database/entities'
import {
  CompaniesRepository,
  InvoicesRepository,
  ProductPurchasesRepository,
  ProductsRepository
} from '../../database/repositories'
import { BaseJob } from './base-job'

export const PROCESS_INVOICE_EXTRACTION = 'PROCESS_INVOICE_EXTRACTION'

@singleton()
export class ProcessInvoiceExtraction implements BaseJob<string> {
  constructor(
    @inject('InvoicesRepository')
    private readonly invoicesRepository: InvoicesRepository,

    @inject('CompaniesRepository')
    private readonly companiesRepository: CompaniesRepository,

    @inject('ProductsRepository')
    private readonly productsRepository: ProductsRepository,

    @inject('ProductPurchasesRepository')
    private readonly purchasesRepository: ProductPurchasesRepository,

    private readonly extractCompany: ExtractCompany,
    private readonly extractInvoice: ExtractInvoice
  ) {}

  async execute(id: string): Promise<void> {
    logger.info(`Processing invoice "${id}"`)

    // Load invoice using repository and throw if not found
    const invoice = await this.invoicesRepository.findById(id)
    if (!invoice) {
      throw new NotFoundError('Invoice not found.')
    }

    try {
      // Extract invoice and load or extract company by found document
      const { document, issueDate, products } = await this.extractInvoice.execute(invoice.url)
      const company = await this.loadOrExtractCompany(document)

      // Initialize purchases map to group duplicated products
      const purchasesMap: { [key: string]: ProductPurchase } = {}

      // Store each product of the invoice
      for (const invoiceProduct of products) {
        // Load or create product
        const product = await this.loadOrCreateProduct(company.id, invoiceProduct)

        // Compose product-price key and get it from the map
        const { referenceCode, price, quantity } = invoiceProduct
        const key = `${referenceCode}-${price}`
        let purchase: ProductPurchase | undefined = purchasesMap[key]

        // Simply sum the quantity if it exists, otherwise creates a new purchase
        if (purchase) {
          purchase.quantity += quantity
        } else {
          purchase = purchasesMap[key] = new ProductPurchase()
          purchase.invoiceId = invoice.id
          purchase.productId = product.id
          purchase.price = price
          purchase.quantity = quantity
        }
      }

      // Store all extracted purchases
      const purchases = Object.values(purchasesMap)
      await this.purchasesRepository.store(purchases)

      // Set invoice extraction as SUCCESS and complete the processing
      invoice.status = 'SUCCESS'
      invoice.issuedAt = issueDate
      await this.invoicesRepository.store(invoice)
      logger.info(`Successfully extracted invoice "${id}"`)
    } catch (error: any) {
      // Serialize received error if custom or create a new internal one to serialize
      if (error instanceof AppError) {
        invoice.error = error.serialize()
      } else {
        logger.error(error)
        invoice.error = new InternalServerError(error).serialize()
      }

      // Set invoice extraction as FAILURE and complete the processing
      invoice.status = 'FAILURE'
      await this.invoicesRepository.store(invoice)
      logger.error(`Invoice "${id}" failed to be extracted due to "${invoice.error.code}"`)
    }
  }

  private async loadOrExtractCompany(document: string): Promise<Company> {
    // Load company by document in case it was already extracted
    logger.debug(`Loading company ${document}`)
    let company = await this.companiesRepository.findByDocument(document)

    if (!company) {
      // Extract company by document and throw if it was not found
      company = await this.extractCompany.execute(document)
      if (!company) {
        throw new ExtractionError('Company not found.', 'COMPANY_NOT_FOUND', { document })
      }

      // Otherwise just store it in the database
      company = await this.companiesRepository.store(company)
    }

    return company
  }

  private async loadOrCreateProduct(
    companyId: string,
    invoiceProduct: InvoiceProduct
  ): Promise<Product> {
    // Check if product exists by company and reference code
    let product = await this.productsRepository.findByCompanyAndReferenceCode(
      companyId,
      invoiceProduct.referenceCode
    )

    // Create a new product if it doesn't exist yet
    if (!product) {
      product = new Product()
      product.companyId = companyId
      product.referenceCode = invoiceProduct.referenceCode
      product.name = invoiceProduct.name
      product.unitOfMeasure = invoiceProduct.unitOfMeasure
      product = await this.productsRepository.store(product)
    }

    return product
  }
}
