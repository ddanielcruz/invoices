import { Style, TFontDictionary } from 'pdfmake/interfaces'

// TODO: Set up Roboto font
export const fonts: TFontDictionary = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
}

// TODO: Set up margin and other document properties
export const defaultStyle: Style = {
  font: 'Helvetica'
}
