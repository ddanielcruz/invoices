import { MigrationInterface, QueryRunner } from 'typeorm'

import { normalizeString } from '../../core/helpers'
import countries from '../data/countries.json'
import { Country, State } from '../entities'
export class seedCountriesStatesAndCities1646170506374 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let values = countries.map(({ name, alpha2 }) => `('${name}', '${alpha2}')`).join(', ')
    const results: Country[] = await queryRunner.query(
      `INSERT INTO countries (name, code) VALUES ${values} RETURNING *`
    )

    for (const country of countries) {
      const countryId = results.find(({ code }) => code === country.alpha2)!.id
      values = country.states
        .map(({ name, abbreviation }) => `('${countryId}', '${name}', '${abbreviation}')`)
        .join(', ')
      const statesResults: State[] = await queryRunner.query(
        `INSERT INTO states (country_id, name, code) VALUES ${values} RETURNING *`
      )

      for (const state of country.states) {
        const stateId = statesResults.find(({ code }) => code === state.abbreviation)!.id
        values = state.cities
          .map(name => {
            const sanitizedName = name.replace("'", "''")
            return `('${stateId}', '${sanitizedName}', '${normalizeString(sanitizedName)}')`
          })
          .join(', ')
        await queryRunner.query(
          `INSERT INTO cities (state_id, name, normalized_name) VALUES ${values}`
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const { alpha2 } of countries) {
      await queryRunner.query(`DELETE FROM countries WHERE code = $1`, [alpha2])
    }
  }
}
