import { getRepository, Repository } from 'typeorm'

import { normalizeString } from '../../core/helpers'
import { City } from '../entities'

export interface CitiesRepository {
  findById(id: string): Promise<City | undefined>
  searchByNormalizedName(name: string): Promise<City[]>
}

export class CitiesRepositoryImpl implements CitiesRepository {
  private readonly repository: Repository<City>

  constructor() {
    this.repository = getRepository(City)
  }

  findById(id: string): Promise<City | undefined> {
    return this.repository.findOne(id, { relations: ['state'] })
  }

  searchByNormalizedName(name: string): Promise<City[]> {
    const normalizedName = normalizeString(name)
    return this.repository
      .createQueryBuilder('city')
      .innerJoinAndSelect('city.state', 'state')
      .where('city.normalized_name LIKE :name', { name: `%${normalizedName}%` })
      .orderBy('city.name')
      .getMany()
  }
}
