import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { QueueInvoiceExtraction } from '../../core/services/invoices/queue-invoice-extraction'

export async function create(request: Request, response: Response): Promise<Response> {
  const service = container.resolve(QueueInvoiceExtraction)
  await service.execute(request.body?.url)

  return response.status(204).send()
}
