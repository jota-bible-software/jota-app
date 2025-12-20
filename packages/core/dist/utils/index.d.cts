import { L as LocaleSymbol, a as LanguageSymbol } from '../settings-BMsGV3Lf.cjs';
import '../format-CbHAj5C_.cjs';
import '../highlight-BO7FLPJ2.cjs';
import '../bible-DkEBp6kG.cjs';

/**
 * Date utilities - framework-agnostic
 */
/**
 * Parse a date string in YYYY-MM-DD format
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object
 */
declare function parseDate(dateString: string): Date;
/**
 * Format a date to YYYY-MM-DD string
 * @param date - Date object (defaults to now)
 * @returns Formatted date string
 */
declare function formatDate(date?: Date | string): string;
/**
 * Get difference in days between two dates
 * @param from - Start date
 * @param to - End date
 * @returns Number of days difference
 */
declare function daysBetween(from: Date, to: Date): number;
/**
 * Add days to a date
 * @param date - Base date
 * @param days - Days to add (can be negative)
 * @returns New date
 */
declare function addDays(date: Date, days: number): Date;

/**
 * Text utilities - framework-agnostic
 */
/**
 * Encode HTML entities
 * @param html - Raw HTML string
 * @returns Encoded string
 */
declare function encodeHtml(html: string): string;
/**
 * Decode HTML entities
 * @param encoded - Encoded HTML string
 * @returns Decoded string
 */
declare function decodeHtml(encoded: string): string;
/**
 * Format an error message with prefix
 * @param prefix - Error prefix
 * @param ex - Error object or unknown value
 * @returns Formatted error message
 */
declare function errorMessage(prefix: string, ex: unknown): string;
/**
 * Escape regex special characters
 * @param str - String to escape
 * @returns Escaped string safe for use in RegExp
 */
declare function escapeRegex(str: string): string;
/**
 * Normalize whitespace in a string
 * @param str - Input string
 * @returns String with normalized whitespace
 */
declare function normalizeWhitespace(str: string): string;

/**
 * Locale utilities - framework-agnostic
 */

/**
 * Navigation direction
 */
declare enum Direction {
    Next = 1,
    Prev = -1
}
/**
 * Extract language code from locale
 * @param locale - Full locale like "en-US"
 * @returns Language code like "en"
 */
declare function locale2lang(locale: LocaleSymbol | string): LanguageSymbol;
/**
 * Extract region code from locale
 * @param locale - Full locale like "en-US"
 * @returns Region code like "us" (lowercase)
 */
declare function locale2region(locale: LocaleSymbol | string): string;
/**
 * Get language from locale or language string
 * @param localeOrLang - Locale or language string
 * @returns Two-letter language code
 */
declare function getLang(localeOrLang: string): string;
/**
 * Create a locale-aware name sorter
 * @param locale - Locale for collation
 * @returns Comparator function for sorting by name
 */
declare function nameSorter(locale: LocaleSymbol | string): (a: {
    name: string;
}, b: {
    name: string;
}) => number;
/**
 * Validate locale format
 * @param locale - Locale string to validate
 * @returns True if valid locale format
 */
declare function isValidLocale(locale: string): boolean;
/**
 * Normalize locale string
 * @param locale - Locale to normalize
 * @returns Normalized locale (e.g., "en_us" -> "en-US")
 */
declare function normalizeLocale(locale: string): string;

export { Direction, addDays, daysBetween, decodeHtml, encodeHtml, errorMessage, escapeRegex, formatDate, getLang, isValidLocale, locale2lang, locale2region, nameSorter, normalizeLocale, normalizeWhitespace, parseDate };
