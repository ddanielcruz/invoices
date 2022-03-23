import { inject, singleton } from 'tsyringe'

import { logger } from '../../config/logger'
import {
  AppError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError
} from '../../core/errors'
import { GeneratePeriodDetailedPDFReport } from '../../core/services/reports/generate-period-detailed-pdf-report'
import { GeneratePeriodSummaryCSVReport } from '../../core/services/reports/generate-period-summary-csv-report'
import { ReportsRepository } from '../../database/repositories'
import { BaseJob } from './base-job'

export const PROCESS_REPORT_GENERATION = 'PROCESS_REPORT_GENERATION'

@singleton()
export class ProcessReportGeneration implements BaseJob<string> {
  constructor(
    @inject('ReportsRepository')
    private readonly repository: ReportsRepository,
    private readonly generatePeriodDetailed: GeneratePeriodDetailedPDFReport,
    private readonly generatePeriodSummary: GeneratePeriodSummaryCSVReport
  ) {}

  async execute(id: string): Promise<void> {
    // Find report by ID and throw if not found
    const report = await this.repository.findById(id)
    if (!report) {
      throw new NotFoundError('Report not found.', { id })
    }

    try {
      // Generate report depending on the selected type and update report key
      switch (report.type) {
        case 'PERIOD_DETAILED_PDF':
          report.key = await this.generatePeriodDetailed.execute(report.data)
          break
        case 'PERIOD_SUMMARY_CSV':
          report.key = await this.generatePeriodSummary.execute(report.data)
          break
        default:
          // Throw an error when report type wasn't implemented yet
          throw new UnprocessableEntityError({ message: 'Report type not supported/implemented.' })
      }

      // Set status to SUCCESS to complete
      report.status = 'SUCCESS'
    } catch (error: any) {
      // Serialize error if custom one, otherwise create an internal error to serialize
      if (error instanceof AppError) {
        report.error = error.serialize()
      } else {
        logger.error(error)
        report.error = new InternalServerError(error).serialize()
      }

      // Set status to FAILURE to complete
      report.status = 'FAILURE'
    } finally {
      // Update report after completing the processing
      await this.repository.store(report)
    }
  }
}
