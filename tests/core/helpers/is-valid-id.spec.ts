import { isValidUrl } from '../../../src/core/helpers/is-valid-url'

describe('isValidUrl', () => {
  test.each(['any-url', 'any.url', '100'])('should return false when url is invalid: %s', url => {
    expect(isValidUrl(url)).toBe(false)
  })

  test.each([
    'https://www.google.com',
    'http://www.google.com',
    'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx?p=any|id'
  ])('should return true when url is valid: %s', url => {
    expect(isValidUrl(url)).toBe(true)
  })
})
