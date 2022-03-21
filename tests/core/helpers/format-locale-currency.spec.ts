import { formatLocaleCurrency } from '../../../src/core/helpers'

describe('formatLocaleCurrency', () => {
  test.each([
    [100, 'R$\xa0100,00'],
    [1000, 'R$\xa01.000,00'],
    [0.1, 'R$\xa00,10']
  ])('should format value to brazilian format: %s', async (value: number, formatted: string) => {
    const result = formatLocaleCurrency(value)
    expect(result).toEqual(formatted)
  })

  test.each([
    [100, '$100.00'],
    [1000, '$1,000.00'],
    [0.1, '$0.10']
  ])('should format value to american format: %s', async (value: number, formatted: string) => {
    const result = formatLocaleCurrency(value, { currency: 'USD', locale: 'en-US' })
    expect(result).toEqual(formatted)
  })
})
