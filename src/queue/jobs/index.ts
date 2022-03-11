import { container } from 'tsyringe'

import { BaseJob } from './base-job'
import { ProcessInvoiceExtraction, PROCESS_INVOICE_EXTRACTION } from './process-invoice-extraction'

interface JobMapping {
  [key: string]: BaseJob
}

export const jobs: JobMapping = {
  [PROCESS_INVOICE_EXTRACTION]: container.resolve(ProcessInvoiceExtraction)
}
