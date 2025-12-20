/**
 * Locale utilities - framework-agnostic
 */

import type { LocaleSymbol, LanguageSymbol } from '../types'

/**
 * Navigation direction
 */
export enum Direction {
  Next = 1,
  Prev = -1,
}

/**
 * Extract language code from locale
 * @param locale - Full locale like "en-US"
 * @returns Language code like "en"
 */
export function locale2lang(locale: LocaleSymbol | string): LanguageSymbol {
  return locale.split('-')[0] as LanguageSymbol
}

/**
 * Extract region code from locale
 * @param locale - Full locale like "en-US"
 * @returns Region code like "us" (lowercase)
 */
export function locale2region(locale: LocaleSymbol | string): string {
  if (!locale) return ''
  const parts = locale.split('-')
  return parts.length > 1 ? parts[1].toLowerCase() : ''
}

/**
 * Get language from locale or language string
 * @param localeOrLang - Locale or language string
 * @returns Two-letter language code
 */
export function getLang(localeOrLang: string): string {
  return localeOrLang.substring(0, 2)
}

/**
 * Create a locale-aware name sorter
 * @param locale - Locale for collation
 * @returns Comparator function for sorting by name
 */
export function nameSorter(locale: LocaleSymbol | string) {
  return (a: { name: string }, b: { name: string }) =>
    a.name.localeCompare(b.name, locale, { sensitivity: 'base', ignorePunctuation: true })
}

/**
 * Validate locale format
 * @param locale - Locale string to validate
 * @returns True if valid locale format
 */
export function isValidLocale(locale: string): boolean {
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(locale)
}

/**
 * Normalize locale string
 * @param locale - Locale to normalize
 * @returns Normalized locale (e.g., "en_us" -> "en-US")
 */
export function normalizeLocale(locale: string): string {
  const parts = locale.replace('_', '-').split('-')
  if (parts.length === 1) return parts[0].toLowerCase()
  return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`
}
