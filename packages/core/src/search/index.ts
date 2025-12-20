/**
 * Search module - Bible reference parsing and content search
 */

// Parser
export {
  parseReferences,
  osisToPassage,
  createParser,
  Parser,
  enUS,
  plPL,
} from './parser'

// Search engine
export {
  search,
  searchContent,
  ensureGlobalRegex,
  sortAndDeduplicate,
  type SearchResultItem,
} from './engine'

// Reference resolver
export { resolveOsisToPassages } from './reference-resolver'
