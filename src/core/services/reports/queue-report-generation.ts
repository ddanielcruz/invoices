import { Queue } from 'bullmq'
import Joi from 'joi'
import { inject, singleton } from 'tsyringe'

import { Report, ReportPeriodData, ReportType } from '../../../database/entities'
import { ReportsRepository } from '../../../database/repositories'
import { PROCESS_REPORT_GENERATION } from '../../../queue/jobs/process-report-generation'
import { FieldError } from '../../errors'

export interface RawPeriodData {
  startDate: string
  endDate: string
}

export interface QueueReportGenerationData {
  type: ReportType
  data: RawPeriodData
}

const validator = Joi.object<QueueReportGenerationData>().keys({
  type: Joi.string().valid('PERIOD_SUMMARY_CSV', 'PERIOD_DETAILED_PDF').required(),
  data: Joi.alternatives(
    Joi.object<RawPeriodData>().keys({
      startDate: Joi.string().isoDate().required(),
      endDate: Joi.string().isoDate().required()
    })
  ).required()
})

@singleton()
export class QueueReportGeneration {
  constructor(
    @inject('ReportsRepository')
    private readonly repository: ReportsRepository,

    @inject('Queue')
    private readonly queue: Queue
  ) {}

  async execute(data: QueueReportGenerationData) {
    // Validate and sanitize data
    data = this.validate(data)

    // Parse data and create a new report
    let report = new Report()
    report.type = data.type
    report.data = this.parseData(data.data)
    report = await this.repository.store(report)

    // Queue report to be processed and return created report
    await this.queue.add(PROCESS_REPORT_GENERATION, report.id)
    return report
  }

  private validate(data: QueueReportGenerationData): QueueReportGenerationData {
    const { value, error } = validator.validate(data, { abortEarly: true, stripUnknown: true })
    const errors = FieldError.generate(error)

    if (errors.length) {
      FieldError.throw(errors)
    }

    return value!
  }

  private parseData({ startDate, endDate }: RawPeriodData): ReportPeriodData {
    return {
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    }
  }
}
