import { Style, TFontDictionary } from 'pdfmake/interfaces'

export const fonts: TFontDictionary = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
}

export const defaultStyle: Style = {
  font: 'Helvetica',
  fontSize: 13
}

export const bold = true

export const colors = {
  darkAccent: '#0b5394',
  lightAccent: '#1155cc',
  divider: '#999',
  primaryText: '#343434',
  secondaryText: '#666'
}
