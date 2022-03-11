import { Queue } from 'bullmq'
import { inject, singleton } from 'tsyringe'

import { Invoice } from '../../../database/entities'
import { InvoicesRepository } from '../../../database/repositories'
import { PROCESS_INVOICE_EXTRACTION } from '../../../queue/jobs/process-invoice-extraction'
import { FieldError } from '../../errors'
import { isValidUrl } from '../../helpers'

@singleton()
export class QueueInvoiceExtraction {
  constructor(
    @inject('InvoicesRepository')
    private readonly repository: InvoicesRepository,

    @inject('Queue')
    private readonly queue: Queue
  ) {}

  async execute(url: string): Promise<Invoice> {
    // Validate and sanitize received URL
    url = this.validate(url)

    // Search invoice by URL to check if it already exists
    let invoice = await this.repository.findByUrl(url)

    // Ignore request if invoice is pending to be extracted or if it was already successfully extracted
    if (invoice?.status === 'PENDING' || invoice?.status === 'SUCCESS') {
      return invoice
    }

    // Create a new invoice if didn't find any, otherwise just reset the failed one
    if (!invoice) {
      invoice = new Invoice(url)
    } else {
      invoice.status = 'PENDING'
      invoice.error = null
    }

    // Store invoice and queue it to be extracted
    invoice = await this.repository.store(invoice)
    this.queue.add(PROCESS_INVOICE_EXTRACTION, invoice.id)

    return invoice
  }

  validate(url: string): string {
    // Sanitize received URL and throw an error if it's not valid
    const sanitizedUrl = url.toLowerCase().trim()
    if (!sanitizedUrl || !isValidUrl(sanitizedUrl)) {
      const errors = [new FieldError('url', 'Received url is not valid.')]
      FieldError.throw(errors)
    }

    return sanitizedUrl
  }
}
