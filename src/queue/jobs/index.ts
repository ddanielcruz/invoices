import { container } from 'tsyringe'

import { BaseJob } from './base-job'
import { ProcessInvoiceExtraction, PROCESS_INVOICE_EXTRACTION } from './process-invoice-extraction'
import { ProcessReportGeneration, PROCESS_REPORT_GENERATION } from './process-report-generation'

interface JobMapping {
  [key: string]: BaseJob
}

export const jobs: JobMapping = {
  [PROCESS_INVOICE_EXTRACTION]: container.resolve(ProcessInvoiceExtraction),
  [PROCESS_REPORT_GENERATION]: container.resolve(ProcessReportGeneration)
}
