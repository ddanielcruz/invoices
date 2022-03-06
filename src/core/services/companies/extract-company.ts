import axios from 'axios'
import * as cheerio from 'cheerio'
import { inject, singleton } from 'tsyringe'

import { logger } from '../../../config/logger'
import { Address, Company } from '../../../database/entities'
import { CitiesRepository } from '../../../database/repositories'
import { ExtractionError } from '../../errors'

@singleton()
export class ExtractCompany {
  constructor(
    @inject('CitiesRepository')
    private readonly citiesRepository: CitiesRepository
  ) {}

  async execute(formattedDocument: string): Promise<Company | undefined> {
    // Sanitize document removing all non-numeric characters
    logger.info(`Extracting company with document "${formattedDocument}"`)
    const document = formattedDocument.replace(/\D/g, '')

    // Request company data from third-party source and parse it
    const response = await axios.get(`https://cnpj.biz/${document}`)
    const $ = cheerio.load(response.data)

    // Find company name and trade name
    const companyName = $('p:contains("Razão Social")').text().replace('Razão Social:', '').trim()
    const tradeName = $('p:contains("Nome Fantasia")').text().replace('Nome Fantasia:', '').trim()
    if (!companyName) {
      logger.debug(`Company with document "${formattedDocument}" was not found`)
      return undefined
    }

    // Try to load the city by city name and state name and interrupt if didn't find a match
    const cityName = $('p:contains("Município:")').text().replace('Município:', '').trim()
    const stateName = $('p:contains("Estado:")').text().replace('Estado:', '').trim()
    const cities = await this.citiesRepository.searchByNormalizedName(cityName)
    const city = cities.find(city => city.state!.name === stateName)

    if (!city) {
      throw new ExtractionError('City not found.', 'CITY_NOT_FOUND', { cityName, stateName })
    }

    // Find address information
    const address = new Address()
    address.street = $('p:contains("Logradouro:")').text().replace('Logradouro:', '').trim()
    address.complement = $('p:contains("Complemento:")').text().replace('Complemento:', '').trim()
    address.neighborhood = $('p:contains("Bairro:")').text().replace('Bairro:', '').trim()
    address.zipcode = $('p:contains("CEP:")').text().replace('CEP:', '').trim()
    address.cityId = city.id

    // Create the company and complete the extraction
    const company = new Company()
    company.document = formattedDocument
    company.companyName = companyName
    company.tradeName = tradeName || companyName
    company.address = address

    logger.debug(`Successfully extracted company "${formattedDocument}"`)
    return company
  }
}
