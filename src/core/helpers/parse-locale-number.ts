/**
 * Parse a localized number to a float. Source: https://stackoverflow.com/a/29273131/9883187
 * @param {string} stringNumber - the localized number
 * @param {string} locale - [optional] the locale that the number is represented in. Omit this parameter to use the current locale.
 */
export const parseLocaleNumber = (stringNumber: string, locale?: string): number => {
  const thousandSeparator = Intl.NumberFormat(locale)
    .format(1111)
    .replace(/\p{Number}/gu, '')
  const decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, '')

  return parseFloat(
    stringNumber
      .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
      .replace(new RegExp('\\' + decimalSeparator), '.')
  )
}
