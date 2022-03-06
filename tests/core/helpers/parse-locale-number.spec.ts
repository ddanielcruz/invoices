import { parseLocaleNumber } from '../../../src/core/helpers/parse-locale-number'

describe('parseLocaleNumber', () => {
  test.each([
    ['1.000', 1000],
    ['100', 100],
    ['1,1', 1.1],
    ['10.000,1', 10000.1],
    ['10000', 10000],
    ['10.000', 10000],
    ['10000,1', 10000.1]
  ])('should correctly parse value', async (rawValue, expectedResult) => {
    const result = parseLocaleNumber(rawValue, 'pt-BR')
    expect(result).toBe(expectedResult)
  })
})
