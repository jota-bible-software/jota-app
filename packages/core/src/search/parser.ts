/**
 * Bible reference parsing
 * Framework-agnostic wrapper for jota-parser
 */

import { Parser, enUS, plPL } from 'jota-parser'
import type { Passage } from '../types'
import { osisBooks } from '../bible/books'

// Create default parser with English and Polish locales
const defaultParser = new Parser({ locales: [plPL, enUS] })

/**
 * Parse Bible references from text input
 * @param input - Text containing Bible references
 * @param parser - Optional custom parser instance
 * @returns Array of passages
 */
export function parseReferences(input: string, parser = defaultParser): Passage[] {
  return parser.parse(input).map((v: number[]) => {
    const b = v[0]
    const c = v[1] - 1
    const s = v[2] ? v[2] - 1 : undefined
    const e = v[3] ? v[3] - 1 : s
    return [b, c, s, e] as Passage
  })
}

/**
 * Convert OSIS code to passage indices
 * @param osis - OSIS code like "Gen.1.1"
 * @returns Array of [bookIndex, chapterIndex, verseIndex]
 */
export function osisToPassage(osis: string): number[] {
  const match = [...osis.matchAll(/(\w+)\.(\d+)\.?(\d+)?/g)][0] || [null, osis]
  return [osisBooks.indexOf(match[1] as typeof osisBooks[number]), parseInt(match[2]) - 1, parseInt(match[3]) - 1]
}

/**
 * Create a new parser with custom locales
 */
export function createParser(options: { locales: unknown[] }): InstanceType<typeof Parser> {
  return new Parser(options)
}

export { Parser, enUS, plPL }
