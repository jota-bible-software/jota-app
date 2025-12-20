/**
 * App Service
 * Main orchestrator for all services
 */

import type { AdapterSuite } from '@jota/adapters'
import { getAdapters } from '../adapters/web-adapter-config'
import { BibleService } from './bible-service'
import { SearchService } from './search-service'
import { HighlightService } from './highlight-service'
import { NotificationService } from './notification-service'

export interface AppServiceConfig {
  adapters?: AdapterSuite
}

export class AppService {
  private _adapters: AdapterSuite
  private _bible: BibleService
  private _search: SearchService
  private _highlights: HighlightService
  private _notifications: NotificationService
  private _initialized = false

  constructor(config: AppServiceConfig = {}) {
    this._adapters = config.adapters || getAdapters()

    // Create notification service first (used by others for error handling)
    this._notifications = new NotificationService()

    // Create services with adapter injection
    this._bible = new BibleService(
      this._adapters.network,
      this._adapters.storage
    )
    this._search = new SearchService(this._bible)
    this._highlights = new HighlightService(this._adapters.storage)
  }

  get adapters(): AdapterSuite {
    return this._adapters
  }

  get bible(): BibleService {
    return this._bible
  }

  get search(): SearchService {
    return this._search
  }

  get highlights(): HighlightService {
    return this._highlights
  }

  get notifications(): NotificationService {
    return this._notifications
  }

  get initialized(): boolean {
    return this._initialized
  }

  async initialize(): Promise<void> {
    if (this._initialized) return

    try {
      // Load highlights from storage
      await this._highlights.load()

      this._initialized = true
    } catch (error) {
      this._notifications.error(
        'Failed to initialize app',
        error instanceof Error ? error.message : String(error)
      )
      throw error
    }
  }

  async shutdown(): Promise<void> {
    // Cleanup resources if needed
    this._initialized = false
  }
}

// Singleton instance
let appServiceInstance: AppService | null = null

export function getAppService(): AppService {
  if (!appServiceInstance) {
    throw new Error('AppService not initialized. Call initializeAppService() first.')
  }
  return appServiceInstance
}

export function initializeAppService(config?: AppServiceConfig): AppService {
  if (appServiceInstance) {
    console.warn('AppService already initialized')
    return appServiceInstance
  }
  appServiceInstance = new AppService(config)
  return appServiceInstance
}

export function resetAppService(): void {
  appServiceInstance = null
}
