/**
 * Reading plans - Bible reading plan definitions
 * Framework-agnostic
 */

/**
 * Reading plan definition
 */
export interface ReadingPlan {
  name: string
  steps: number
  description: string
  readings: string
}

/**
 * Parse a reading plan's readings into daily entries
 * @param plan - Reading plan
 * @returns Array of daily reading strings
 */
export function parseReadings(plan: ReadingPlan): string[] {
  return plan.readings
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
}

/**
 * Get reading for a specific day
 * @param plan - Reading plan
 * @param dayIndex - 0-based day index
 * @returns Reading string for the day
 */
export function getReadingForDay(plan: ReadingPlan, dayIndex: number): string | undefined {
  const readings = parseReadings(plan)
  return readings[dayIndex]
}

/**
 * Calculate progress percentage
 * @param currentDay - Current day (1-based)
 * @param totalDays - Total days in plan
 * @returns Progress as percentage (0-100)
 */
export function calculateProgress(currentDay: number, totalDays: number): number {
  if (totalDays <= 0) return 0
  return Math.min(100, Math.round((currentDay / totalDays) * 100))
}

/**
 * Get day number from start date
 * @param startDate - Plan start date
 * @param currentDate - Current date (defaults to now)
 * @returns Current day number (1-based)
 */
export function getDayNumber(startDate: Date, currentDate: Date = new Date()): number {
  const diffTime = currentDate.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays + 1)
}
