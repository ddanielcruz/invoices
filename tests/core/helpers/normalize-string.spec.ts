import { normalizeString } from '../../../src/core/helpers/normalize-string'

describe('NormalizeString', () => {
  test('should remove blank characters from string', async () => {
    const result = normalizeString(' ANY-VALUE ')
    expect(result).toBe('ANY-VALUE')
  })

  test('should upper case string', async () => {
    const result = normalizeString('any-value')
    expect(result).toBe('ANY-VALUE')
  })

  test('should replace latin characters', async () => {
    const result = normalizeString('áóíêôàçÀÁü')
    expect(result).toBe('AOIEOACAAU')
  })
})
