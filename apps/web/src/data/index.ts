import { LocaleDataV2, LocaleSymbol } from 'src/types'
import { enUSLocaleData } from './data-en-US'
import { plPLLocaleData } from './data-pl-PL'
import { ptBRLocaleData } from './data-pt-BR'

// The full record of all locale data
// Type assertion needed as the locale data files use the legacy LocaleData type
// which is structurally compatible but missing the locale field in BookNamingV2
export const localeData: Record<LocaleSymbol, LocaleDataV2> = {
  'en-US': enUSLocaleData as unknown as LocaleDataV2,
  'pl-PL': plPLLocaleData as unknown as LocaleDataV2,
  'pt-BR': ptBRLocaleData as unknown as LocaleDataV2,
}

// Export type for use in other places
export type LocaleDataRecord = typeof localeData
