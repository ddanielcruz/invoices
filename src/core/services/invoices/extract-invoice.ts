import axios from 'axios'
import * as cheerio from 'cheerio'
import { singleton } from 'tsyringe'
import { URL } from 'url'

import { dayjs } from '../../../config/dayjs'
import { logger } from '../../../config/logger'
import { ExtractionError } from '../../errors'
import { parseLocaleNumber } from '../../helpers/parse-locale-number'

export interface InvoiceProduct {
  referenceCode: string
  name: string
  unitOfMeasure: string
  quantity: number
  price: number
}

export interface Invoice {
  document: string
  issueDate: Date
  products: InvoiceProduct[]
}

@singleton()
export class ExtractInvoice {
  async execute(rawUrl: string): Promise<Invoice> {
    // Retrieve invoice ID and compose invoice URL
    logger.debug(`Extracting invoice "${rawUrl}"`)
    const invoiceId = this.retrieveInvoiceId(rawUrl)
    const dataUrl = `https://www.sefaz.rs.gov.br/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-NFC_QRCODE_1.asp?p=${invoiceId}`

    // Request invoice information and parse receive response
    const response = await axios.get(dataUrl, { responseType: 'arraybuffer' })
    const $ = cheerio.load(response.data.toString('latin1'))

    // Extract invoice information
    const issueDate = this.extractIssueDate($)
    const document = this.extractDocument($)
    const products = this.extractProducts($)
    logger.debug(`Successfully extracted invoice "${invoiceId}"`)

    return { document, issueDate, products }
  }

  private retrieveInvoiceId(url: string): string {
    // Parse URL and get the invoice ID from the parameters
    const invoiceId = new URL(url).searchParams.get('p')
    logger.debug(`Found invoice ID: "${invoiceId}"`)

    // Throw an error if didn't find to interrupt the execution
    if (!invoiceId) {
      throw new ExtractionError('Invoice ID not found.', 'INVALID_INVOICE_ID', { url })
    }

    return invoiceId
  }

  private extractIssueDate($: cheerio.CheerioAPI): Date {
    // Find issue information container
    const issueContainer = $('.NFCCabecalho_SubTitulo:contains("Data de Emissão:")').text()
    if (!issueContainer) {
      throw new ExtractionError('Invoice not found.', 'INVOICE_NOT_FOUND')
    }

    // Extract and parse issue date
    const rawIssueDate = issueContainer.split('Data de Emissão:')[1].trim()
    return dayjs(`${rawIssueDate}-03:00`, 'DD/MM/YYYY HH:mm:ssZ').toDate()
  }

  private extractDocument($: cheerio.CheerioAPI): string {
    // Same idea of the issue date extraction, but simplified since we already checked the invoice is valid
    const documentContainer = $('.NFCCabecalho_SubTitulo1:contains("CNPJ:")').text()
    return documentContainer.split('CNPJ:')[1].split('Inscrição')[0].trim()
  }

  private extractProducts($: cheerio.CheerioAPI): InvoiceProduct[] {
    const products: InvoiceProduct[] = []
    const productsContainer = $('table.NFCCabecalho:contains("Vl Unit") tbody')

    for (const child of productsContainer.children().slice(1)) {
      const info = $(child)
        .text()
        .split('\n')
        .map(value => value.trim())
        .filter(Boolean)

      products.push({
        referenceCode: info[0],
        name: info[1],
        quantity: parseLocaleNumber(info[2], 'pt-BR'),
        unitOfMeasure: info[3],
        price: parseLocaleNumber(info[4], 'pt-BR')
      })
    }

    return products
  }
}
