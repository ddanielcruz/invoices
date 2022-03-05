import { getRepository, Repository } from 'typeorm'

import { Company } from '../entities'

export interface CompaniesRepository {
  findByDocument(document: string): Promise<Company | undefined>
  findById(id: string): Promise<Company | undefined>
  store(company: Company): Promise<Company>
}

export class CompaniesRepositoryImpl implements CompaniesRepository {
  private readonly repository: Repository<Company>

  constructor() {
    this.repository = getRepository(Company)
  }

  findById(id: string): Promise<Company | undefined> {
    return this.repository.findOne(id, { relations: ['address'] })
  }

  findByDocument(document: string): Promise<Company | undefined> {
    return this.repository.findOne({ where: { document }, relations: ['address'] })
  }

  store(company: Company): Promise<Company> {
    return this.repository.save(company)
  }
}
