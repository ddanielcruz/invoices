import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { QueueReportGeneration } from '../../core/services/reports/queue-report-generation'

export async function create(request: Request, response: Response): Promise<Response> {
  const service = container.resolve(QueueReportGeneration)
  const report = await service.execute(request.body)

  return response.json(report)
}
