/**
 * Utilities module - framework-agnostic helper functions
 */

// Date utilities
export {
  parseDate,
  formatDate,
  daysBetween,
  addDays,
} from './date'

// Text utilities
export {
  encodeHtml,
  decodeHtml,
  errorMessage,
  escapeRegex,
  normalizeWhitespace,
} from './text'

// Locale utilities
export {
  Direction,
  locale2lang,
  locale2region,
  getLang,
  nameSorter,
  isValidLocale,
  normalizeLocale,
} from './locale'
