import Joi from 'joi'
import { inject, singleton } from 'tsyringe'

import { Invoice } from '../../../database/entities'
import { InvoicesRepository } from '../../../database/repositories'
import { FieldError } from '../../errors'

export interface FindManyByPeriodData {
  startDate: string
  endDate: string
}

const validator = Joi.object<FindManyByPeriodData>().keys({
  startDate: Joi.string().isoDate().required(),
  endDate: Joi.string().isoDate().required()
})

@singleton()
export class FindManyByPeriod {
  constructor(
    @inject('InvoicesRepository')
    private readonly repository: InvoicesRepository
  ) {}

  async execute(data: FindManyByPeriodData): Promise<Invoice[]> {
    // Validate and sanitize received data
    data = this.validate(data)

    // Parse dates and find invoices by period
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    return await this.repository.findManyByPeriod(startDate, endDate)
  }

  private validate(data: FindManyByPeriodData): FindManyByPeriodData {
    const { value, error } = validator.validate(data, { abortEarly: false, stripUnknown: true })
    const errors = FieldError.generate(error)

    if (errors.length) {
      FieldError.throw(errors)
    }

    return value!
  }
}
