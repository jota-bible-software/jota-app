import { LocaleDataV2, LocaleSymbol } from 'src/types'
import { enUSLocaleData } from './data-en-US'
import { plPLLocaleData } from './data-pl-PL'

// The full record of all locale data
export const localeData: Record<LocaleSymbol, LocaleDataV2> = {
  'en-US': enUSLocaleData,
  'pl-PL': plPLLocaleData,
}

// Export type for use in other places
export type LocaleDataRecord = typeof localeData
