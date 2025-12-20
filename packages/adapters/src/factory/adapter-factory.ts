/**
 * Adapter factory
 * Creates platform-specific adapters based on configuration
 */

import type { IStorageAdapter } from '../interfaces/storage'
import type { INetworkAdapter } from '../interfaces/network'
import type { IAudioAdapter } from '../interfaces/audio'
import type { IPlatformAdapter } from '../interfaces/platform'

import type {
  AdapterConfig,
  StorageConfig,
  NetworkConfig,
  AudioConfig,
  PlatformConfig,
} from './config'
import { defaultWebConfig, mergeConfig } from './config'

// Web adapters
import { LocalStorageAdapter } from '../web/local-storage-adapter'
import { IndexedDBAdapter } from '../web/indexed-db-adapter'
import { WebNetworkAdapter } from '../web/web-network-adapter'
import { WebAudioAdapter } from '../web/web-audio-adapter'
import { WebPlatformAdapter } from '../web/web-platform-adapter'

// Memory/mock adapters
import { MemoryStorageAdapter } from '../memory/memory-storage-adapter'
import { MockNetworkAdapter } from '../memory/mock-network-adapter'
import { MockAudioAdapter } from '../memory/mock-audio-adapter'
import { MockPlatformAdapter } from '../memory/mock-platform-adapter'

/**
 * Adapter suite containing all adapters
 */
export interface AdapterSuite {
  storage: IStorageAdapter
  network: INetworkAdapter
  audio: IAudioAdapter
  platform: IPlatformAdapter
}

/**
 * Hybrid storage adapter that uses different adapters for small and large data
 */
class HybridStorageAdapter implements IStorageAdapter {
  constructor(
    private small: IStorageAdapter,
    private large: IStorageAdapter
  ) {}

  // Key-value uses small storage
  get<T>(key: string) {
    return this.small.get<T>(key)
  }
  set<T>(key: string, value: T) {
    return this.small.set(key, value)
  }
  delete(key: string) {
    return this.small.delete(key)
  }
  async clear() {
    await this.small.clear()
    await this.large.clear()
  }
  keys() {
    return this.small.keys()
  }

  // Structured storage uses large storage
  getStructured<T>(collection: string, id: string) {
    return this.large.getStructured<T>(collection, id)
  }
  setStructured<T>(collection: string, id: string, value: T) {
    return this.large.setStructured(collection, id, value)
  }
  deleteStructured(collection: string, id?: string) {
    return this.large.deleteStructured(collection, id)
  }
  listStructured(collection: string) {
    return this.large.listStructured(collection)
  }

  // Batch uses small storage
  getBatch<T>(keys: string[]) {
    return this.small.getBatch<T>(keys)
  }
  setBatch(data: Record<string, unknown>) {
    return this.small.setBatch(data)
  }

  // Events from both
  onChanged<T>(callback: (event: { key: string; oldValue: T | null; newValue: T | null }) => void) {
    const unsub1 = this.small.onChanged(callback)
    const unsub2 = this.large.onChanged(callback)
    return () => {
      unsub1()
      unsub2()
    }
  }
}

/**
 * Async localStorage adapter wrapper
 * Wraps synchronous localStorage for IStorageAdapter compatibility
 */
class AsyncLocalStorageAdapter implements IStorageAdapter {
  private adapter: LocalStorageAdapter
  private listeners: Set<(event: { key: string; oldValue: unknown; newValue: unknown }) => void> =
    new Set()

  constructor(prefix?: string) {
    this.adapter = new LocalStorageAdapter(prefix)
  }

  async get<T>(key: string): Promise<T | null> {
    return this.adapter.get<T>(key)
  }

  async set<T>(key: string, value: T): Promise<void> {
    const oldValue = this.adapter.get(key)
    this.adapter.set(key, value)
    this.notifyChange(key, oldValue, value)
  }

  async delete(key: string): Promise<void> {
    const oldValue = this.adapter.get(key)
    this.adapter.remove(key)
    this.notifyChange(key, oldValue, null)
  }

  async clear(): Promise<void> {
    this.adapter.clear()
  }

  async keys(): Promise<string[]> {
    return this.adapter.keys()
  }

  // Structured storage - simulate with prefixed keys
  async getStructured<T>(collection: string, id: string): Promise<T | null> {
    return this.adapter.get<T>(`_coll_${collection}_${id}`)
  }

  async setStructured<T>(collection: string, id: string, value: T): Promise<void> {
    this.adapter.set(`_coll_${collection}_${id}`, value)
  }

  async deleteStructured(collection: string, id?: string): Promise<void> {
    if (id !== undefined) {
      this.adapter.remove(`_coll_${collection}_${id}`)
    } else {
      const prefix = `_coll_${collection}_`
      const keys = this.adapter.keys().filter((k) => k.startsWith(prefix))
      keys.forEach((k) => this.adapter.remove(k))
    }
  }

  async listStructured(collection: string): Promise<string[]> {
    const prefix = `_coll_${collection}_`
    return this.adapter
      .keys()
      .filter((k) => k.startsWith(prefix))
      .map((k) => k.substring(prefix.length))
  }

  async getBatch<T>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {}
    for (const key of keys) {
      result[key] = this.adapter.get<T>(key)
    }
    return result
  }

  async setBatch(data: Record<string, unknown>): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      this.adapter.set(key, value)
    }
  }

  private notifyChange(key: string, oldValue: unknown, newValue: unknown): void {
    this.listeners.forEach((cb) => cb({ key, oldValue, newValue }))
  }

  onChanged<T>(callback: (event: { key: string; oldValue: T | null; newValue: T | null }) => void) {
    this.listeners.add(callback as (event: { key: string; oldValue: unknown; newValue: unknown }) => void)
    return () => {
      this.listeners.delete(callback as (event: { key: string; oldValue: unknown; newValue: unknown }) => void)
    }
  }
}

/**
 * Create a storage adapter based on configuration
 */
export function createStorageAdapter(config?: StorageConfig): IStorageAdapter {
  const cfg = config ?? defaultWebConfig.storage!

  switch (cfg.type) {
    case 'memory':
      return new MemoryStorageAdapter(cfg)

    case 'localStorage':
      return new AsyncLocalStorageAdapter(cfg.prefix)

    case 'indexedDB':
      return new IndexedDBAdapter({
        prefix: cfg.prefix,
        dbName: cfg.dbName,
      })

    case 'hybrid': {
      const smallConfig = cfg.small ?? { type: 'localStorage' as const }
      const largeConfig = cfg.large ?? { type: 'indexedDB' as const }

      const smallAdapter =
        smallConfig.type === 'memory'
          ? new MemoryStorageAdapter(smallConfig.config)
          : new AsyncLocalStorageAdapter(smallConfig.config?.prefix)

      const largeAdapter =
        largeConfig.type === 'memory'
          ? new MemoryStorageAdapter(largeConfig.config)
          : new IndexedDBAdapter({
              prefix: largeConfig.config?.prefix,
              dbName: largeConfig.config?.dbName,
            })

      return new HybridStorageAdapter(smallAdapter, largeAdapter)
    }

    default:
      return new MemoryStorageAdapter()
  }
}

/**
 * Create a network adapter based on configuration
 */
export function createNetworkAdapter(config?: NetworkConfig): INetworkAdapter {
  const cfg = config ?? defaultWebConfig.network!

  switch (cfg.type) {
    case 'mock':
      return new MockNetworkAdapter()

    case 'fetch':
    default:
      return new WebNetworkAdapter({
        baseUrl: cfg.baseUrl,
        timeout: cfg.timeout,
        headers: cfg.headers,
        debug: cfg.debug,
        retry: cfg.retry,
      })
  }
}

/**
 * Create an audio adapter based on configuration
 */
export function createAudioAdapter(config?: AudioConfig): IAudioAdapter {
  const cfg = config ?? defaultWebConfig.audio!

  switch (cfg.type) {
    case 'mock':
      return new MockAudioAdapter(cfg)

    case 'webAudio':
    default:
      return new WebAudioAdapter(cfg)
  }
}

/**
 * Create a platform adapter based on configuration
 */
export function createPlatformAdapter(config?: PlatformConfig): IPlatformAdapter {
  const cfg = config ?? defaultWebConfig.platform!

  switch (cfg.type) {
    case 'mock':
      return new MockPlatformAdapter()

    case 'web':
    default:
      return new WebPlatformAdapter()
  }
}

/**
 * Create a complete adapter suite based on configuration
 */
export function createAdapterSuite(config?: Partial<AdapterConfig>): AdapterSuite {
  const mergedConfig = mergeConfig(config ?? {})

  return {
    storage: createStorageAdapter(mergedConfig.storage),
    network: createNetworkAdapter(mergedConfig.network),
    audio: createAudioAdapter(mergedConfig.audio),
    platform: createPlatformAdapter(mergedConfig.platform),
  }
}

/**
 * Adapter factory class for more complex scenarios
 */
export class AdapterFactory {
  private config: AdapterConfig

  constructor(config?: Partial<AdapterConfig>) {
    this.config = mergeConfig(config ?? {})
  }

  createStorage(): IStorageAdapter {
    return createStorageAdapter(this.config.storage)
  }

  createNetwork(): INetworkAdapter {
    return createNetworkAdapter(this.config.network)
  }

  createAudio(): IAudioAdapter {
    return createAudioAdapter(this.config.audio)
  }

  createPlatform(): IPlatformAdapter {
    return createPlatformAdapter(this.config.platform)
  }

  createSuite(): AdapterSuite {
    return {
      storage: this.createStorage(),
      network: this.createNetwork(),
      audio: this.createAudio(),
      platform: this.createPlatform(),
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): AdapterConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AdapterConfig>): void {
    this.config = mergeConfig(config, this.config)
  }
}
