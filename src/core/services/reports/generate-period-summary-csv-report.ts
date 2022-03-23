import { createWriteStream } from 'fs'
import { inject, singleton } from 'tsyringe'

import { format } from '@fast-csv/format'

import { ReportPeriodData } from '../../../database/entities'
import { InvoicesRepository } from '../../../database/repositories'

interface InvoiceRow {
  company: string
  document: string
  issuedAt: string
  total: number
}

@singleton()
export class GeneratePeriodSummaryCSVReport {
  constructor(
    @inject('InvoicesRepository')
    private readonly repository: InvoicesRepository
  ) {}

  async execute({ startDate, endDate }: ReportPeriodData): Promise<string> {
    // Load invoices from the period and create document key
    const invoices = await this.repository.findManyByPeriod(startDate, endDate)
    const key = `period-summary-${Date.now()}.csv`

    // Map found invoices to row format
    const rows = invoices.map<InvoiceRow>(invoice => {
      return {
        company: invoice.company!.tradeName,
        document: invoice.company!.document,
        issuedAt: invoice.issuedAt!.toISOString(),
        total: invoice.total!
      }
    })

    return new Promise<string>((resolve, reject) => {
      try {
        // Initialize CSV tream and write rows
        const stream = format({ headers: ['company', 'document', 'issuedAt', 'total'] })
        stream.pipe(createWriteStream(`tmp/${key}`))
        stream.on('error', reject)
        stream.on('end', () => resolve(key))
        rows.forEach(row => stream.write(row))
        stream.end()
      } catch (error) {
        reject(error)
      }
    })
  }
}
