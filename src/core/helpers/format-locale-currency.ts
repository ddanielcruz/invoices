export interface LocaleOptions {
  locale: string
  currency: string
}

export const formatLocaleCurrency = (value: number, options?: LocaleOptions): string => {
  const formatter = new Intl.NumberFormat(options?.locale ?? 'pt-BR', {
    style: 'currency',
    currency: options?.currency ?? 'BRL'
  })

  return formatter.format(value)
}
