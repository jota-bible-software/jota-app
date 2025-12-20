/**
 * Text utilities - framework-agnostic
 */

/**
 * Encode HTML entities
 * @param html - Raw HTML string
 * @returns Encoded string
 */
export function encodeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
}

/**
 * Decode HTML entities
 * @param encoded - Encoded HTML string
 * @returns Decoded string
 */
export function decodeHtml(encoded: string): string {
  return encoded
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&quot;/g, '"')
}

/**
 * Format an error message with prefix
 * @param prefix - Error prefix
 * @param ex - Error object or unknown value
 * @returns Formatted error message
 */
export function errorMessage(prefix: string, ex: unknown): string {
  const message = ex instanceof Error ? ex.message : String(ex)
  return `${prefix} ${message}`
}

/**
 * Escape regex special characters
 * @param str - String to escape
 * @returns Escaped string safe for use in RegExp
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Normalize whitespace in a string
 * @param str - Input string
 * @returns String with normalized whitespace
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim()
}
