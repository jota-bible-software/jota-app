/**
 * Type declarations for jota-parser
 */

declare module 'jota-parser' {
  export interface ParserOptions {
    locales: unknown[]
  }

  export class Parser {
    constructor(options: ParserOptions)
    parse(input: string): number[][]
  }

  export const enUS: unknown
  export const plPL: unknown
}
