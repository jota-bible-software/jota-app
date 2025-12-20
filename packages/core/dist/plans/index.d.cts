/**
 * Reading plans - Bible reading plan definitions
 * Framework-agnostic
 */
/**
 * Reading plan definition
 */
interface ReadingPlan {
    name: string;
    steps: number;
    description: string;
    readings: string;
}
/**
 * Parse a reading plan's readings into daily entries
 * @param plan - Reading plan
 * @returns Array of daily reading strings
 */
declare function parseReadings(plan: ReadingPlan): string[];
/**
 * Get reading for a specific day
 * @param plan - Reading plan
 * @param dayIndex - 0-based day index
 * @returns Reading string for the day
 */
declare function getReadingForDay(plan: ReadingPlan, dayIndex: number): string | undefined;
/**
 * Calculate progress percentage
 * @param currentDay - Current day (1-based)
 * @param totalDays - Total days in plan
 * @returns Progress as percentage (0-100)
 */
declare function calculateProgress(currentDay: number, totalDays: number): number;
/**
 * Get day number from start date
 * @param startDate - Plan start date
 * @param currentDate - Current date (defaults to now)
 * @returns Current day number (1-based)
 */
declare function getDayNumber(startDate: Date, currentDate?: Date): number;

export { type ReadingPlan, calculateProgress, getDayNumber, getReadingForDay, parseReadings };
