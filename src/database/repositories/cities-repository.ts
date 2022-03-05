import { getRepository, Repository } from 'typeorm'

import { normalizeString } from '../../core/helpers'
import { City } from '../entities'

export interface CitiesRepository {
  findById(id: string): Promise<City | undefined>
  findByNormalizedName(name: string): Promise<City | undefined>
}

export class CitiesRepositoryImpl implements CitiesRepository {
  private readonly repository: Repository<City>

  constructor() {
    this.repository = getRepository(City)
  }

  findById(id: string): Promise<City | undefined> {
    return this.repository.findOne(id, { relations: ['state'] })
  }

  findByNormalizedName(name: string): Promise<City | undefined> {
    const normalizedName = normalizeString(name)
    return this.repository.findOne({ normalizedName })
  }
}
