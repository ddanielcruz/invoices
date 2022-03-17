import { getRepository, Repository } from 'typeorm'

import { Report } from '../entities'

export interface ReportsRepository {
  findById(id: string): Promise<Report | undefined>
  store(report: Report): Promise<Report>
}

export class ReportsRepositoryImpl implements ReportsRepository {
  private readonly repository: Repository<Report>

  constructor() {
    this.repository = getRepository(Report)
  }

  findById(id: string): Promise<Report | undefined> {
    return this.repository.findOne({ where: { id } })
  }

  store(report: Report): Promise<Report> {
    return this.repository.save(report)
  }
}
