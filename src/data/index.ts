import { LocaleDataV2, LocaleSymbol } from 'src/types'
import { enUSLocaleData } from './data-en-US'
import { plPLLocaleData } from './data-pl-PL'
import { ptBRLocaleData } from './data-pt-BR'

// The full record of all locale data
export const localeData: Record<LocaleSymbol, LocaleDataV2> = {
  'en-US': enUSLocaleData,
  'pl-PL': plPLLocaleData,
  'pt-BR': ptBRLocaleData,
}

// Export type for use in other places
export type LocaleDataRecord = typeof localeData
