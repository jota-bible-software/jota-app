/**
 * Services index
 * Re-exports all services for easier imports
 */

export { AppService, getAppService, initializeAppService, resetAppService } from './app-service'
export type { AppServiceConfig } from './app-service'

export { BibleService } from './bible-service'
export type { TranslationState } from './bible-service'

export { SearchService } from './search-service'
export type { SearchState } from './search-service'

export { HighlightService } from './highlight-service'

export { NotificationService } from './notification-service'
export type { NotificationOptions, NotificationHandler } from './notification-service'
