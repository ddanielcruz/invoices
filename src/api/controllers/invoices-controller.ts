import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { FindManyByPeriod } from '../../core/services/invoices/find-many-by-period'
import { QueueInvoiceExtraction } from '../../core/services/invoices/queue-invoice-extraction'

export async function listByPeriod(request: Request, response: Response): Promise<Response> {
  const service = container.resolve(FindManyByPeriod)
  const invoices = await service.execute(request.query as any)

  return response.json(invoices)
}

export async function create(request: Request, response: Response): Promise<Response> {
  const service = container.resolve(QueueInvoiceExtraction)
  await service.execute(request.body?.url)

  return response.status(204).send()
}
