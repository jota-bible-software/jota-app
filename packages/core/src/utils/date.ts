/**
 * Date utilities - framework-agnostic
 */

/**
 * Parse a date string in YYYY-MM-DD format
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object
 */
export function parseDate(dateString: string): Date {
  const tokens = dateString.split('-').map(it => parseInt(it))
  return new Date(tokens[0], tokens[1] - 1, tokens[2])
}

/**
 * Format a date to YYYY-MM-DD string
 * @param date - Date object (defaults to now)
 * @returns Formatted date string
 */
export function formatDate(date?: Date | string): string {
  if (!date) date = new Date()
  if (date instanceof Date) {
    const d = date.getDate().toString().padStart(2, '0')
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const y = date.getFullYear()
    return `${y}-${m}-${d}`
  } else {
    return date
  }
}

/**
 * Get difference in days between two dates
 * @param from - Start date
 * @param to - End date
 * @returns Number of days difference
 */
export function daysBetween(from: Date, to: Date): number {
  const diffTime = to.getTime() - from.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Add days to a date
 * @param date - Base date
 * @param days - Days to add (can be negative)
 * @returns New date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
