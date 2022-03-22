import { createWriteStream } from 'fs'
import PdfPrinter from 'pdfmake'
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces'
import { inject, singleton } from 'tsyringe'

import { dayjs } from '../../../config/dayjs'
import { fonts, defaultStyle, bold, colors } from '../../../config/pdf'
import { Invoice, ReportPeriodData } from '../../../database/entities'
import { InvoicesRepository } from '../../../database/repositories'
import { formatLocaleCurrency } from '../../helpers'

@singleton()
export class GeneratePeriodDetailedPDFReport {
  constructor(
    @inject('InvoicesRepository')
    private readonly repository: InvoicesRepository
  ) {}

  async execute(period: ReportPeriodData): Promise<string> {
    // Load invoices from the period and calculate total value
    const invoices = await this.repository.findManyByPeriod(period.startDate, period.endDate)
    const invoicesTotal = invoices.reduce((total, invoice) => total + invoice.total!, 0)

    // Create a new promise to complete execution only when the document is generated
    return new Promise<string>((resolve, reject) => {
      // Initialize PDF printer with configurated fonts
      const printer = new PdfPrinter(fonts)

      // Create document definition
      const definition: TDocumentDefinitions = {
        defaultStyle,
        styles: this.buildStyles(),
        content: [this.buildHeader(period, invoicesTotal), invoices.map(this.buildInvoice)]
      }

      // Create key and document for definition
      const key = `period-detailed-${Date.now()}.pdf`
      const doc = printer.createPdfKitDocument(definition)

      // Set up write stream to save the file and end the operation when completed
      doc.pipe(createWriteStream(`tmp/${key}`))
      doc.on('end', () => resolve(key))
      doc.on('error', reject)
      doc.end()
    })
  }

  private buildStyles(): StyleDictionary {
    return {
      header: {
        fontSize: 18,
        bold,
        color: colors.darkAccent
      },
      secondary: {
        color: colors.secondaryText
      },
      period: {
        bold,
        color: colors.primaryText
      },
      totalValue: {
        alignment: 'right',
        color: colors.lightAccent,
        bold
      },
      companyName: {
        color: colors.lightAccent,
        bold,
        fontSize: 14
      },
      tableCell: {
        margin: [2, 4, 2, 2],
        alignment: 'right'
      }
    }
  }

  private buildHeader(period: ReportPeriodData, total: number): Content {
    const timestamp = dayjs().format('DD/MM/YYYY HH:mm')
    const startDate = dayjs(period.startDate).format('DD/MM/YYYY')
    const endDate = dayjs(period.endDate).format('DD/MM/YYYY')

    return [
      {
        margin: [0, 0, 0, 8],
        columns: [
          {
            text: 'Invoices Report',
            style: 'header'
          },
          {
            text: timestamp,
            style: 'secondary',
            alignment: 'right'
          }
        ]
      },
      {
        margin: [0, 0, 0, 24],
        columns: [
          {
            text: [
              'Summary report from ',
              { text: startDate, style: 'period' },
              ' to ',
              { text: endDate, style: 'period' },
              '.'
            ],
            style: 'secondary'
          },
          {
            text: formatLocaleCurrency(total),
            style: 'totalValue',
            width: 'auto',
            color: colors.darkAccent
          }
        ]
      },
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: colors.divider }
        ]
      }
    ]
  }

  private buildInvoice(invoice: Invoice): Content {
    const issueDate = dayjs(invoice.issuedAt!).format('DD/MM/YYYY HH:mm')

    return [
      {
        margin: [0, 24, 0, 0],
        columns: [
          {
            text: [
              {
                text: invoice.company!.tradeName,
                style: 'companyName'
              },
              {
                text: `, ${invoice.company!.address!.city!.name}`,
                style: 'secondary',
                fontSize: 12
              }
            ]
          },
          {
            text: issueDate,
            alignment: 'right',
            color: colors.primaryText,
            bold,
            width: 'auto'
          }
        ]
      },
      {
        text: formatLocaleCurrency(invoice.total!),
        style: 'totalValue',
        margin: [0, 4, 0, 0]
      },
      {
        margin: [0, 12, 0, 0],
        table: {
          layout: 'lightHorizontalLines',
          widths: ['*', 80, 80],
          body: invoice.purchases!.map(({ product, price, quantity }) => {
            return [
              {
                text: product!.name,
                style: 'tableCell',
                alignment: 'left'
              },
              {
                text: formatLocaleCurrency(price),
                style: 'tableCell',
                bold
              },
              {
                text: `${quantity.toLocaleString('pt-BR')} ${product!.unitOfMeasure}`,
                style: 'tableCell'
              }
            ]
          })
        }
      }
    ]
  }
}
