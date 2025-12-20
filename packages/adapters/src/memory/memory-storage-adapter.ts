/**
 * In-memory storage adapter
 * Implements full IStorageAdapter for testing and SSR
 */

import type {
  IStorageAdapter,
  StorageAdapterConfig,
  StorageChangeEvent,
} from '../interfaces/storage'

interface CollectionStore {
  [id: string]: unknown
}

/**
 * In-memory implementation of IStorageAdapter
 * Useful for testing and server-side rendering
 */
export class MemoryStorageAdapter implements IStorageAdapter {
  private storage: Map<string, unknown> = new Map()
  private collections: Map<string, CollectionStore> = new Map()
  private listeners: Set<(event: StorageChangeEvent) => void> = new Set()
  private prefix: string

  constructor(config: StorageAdapterConfig = {}) {
    this.prefix = config.prefix ?? ''
  }

  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}.${key}` : key
  }

  private getCollectionKey(collection: string): string {
    return this.prefix ? `${this.prefix}.${collection}` : collection
  }

  private notifyChange<T>(key: string, oldValue: T | null, newValue: T | null): void {
    const event: StorageChangeEvent<T> = { key, oldValue, newValue }
    this.listeners.forEach((listener) => listener(event))
  }

  // Key-value operations

  async get<T>(key: string): Promise<T | null> {
    const value = this.storage.get(this.getKey(key))
    return (value as T) ?? null
  }

  async set<T>(key: string, value: T): Promise<void> {
    const fullKey = this.getKey(key)
    const oldValue = (this.storage.get(fullKey) as T) ?? null
    this.storage.set(fullKey, value)
    this.notifyChange(key, oldValue, value)
  }

  async delete(key: string): Promise<void> {
    const fullKey = this.getKey(key)
    const oldValue = this.storage.get(fullKey) ?? null
    this.storage.delete(fullKey)
    this.notifyChange(key, oldValue, null)
  }

  async clear(): Promise<void> {
    if (this.prefix) {
      for (const key of this.storage.keys()) {
        if (key.startsWith(this.prefix)) {
          this.storage.delete(key)
        }
      }
      for (const key of this.collections.keys()) {
        if (key.startsWith(this.prefix)) {
          this.collections.delete(key)
        }
      }
    } else {
      this.storage.clear()
      this.collections.clear()
    }
  }

  async keys(): Promise<string[]> {
    const keys: string[] = []
    for (const key of this.storage.keys()) {
      if (this.prefix) {
        if (key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length + 1))
        }
      } else {
        keys.push(key)
      }
    }
    return keys
  }

  // Structured storage operations

  async getStructured<T>(collection: string, id: string): Promise<T | null> {
    const collKey = this.getCollectionKey(collection)
    const coll = this.collections.get(collKey)
    if (!coll) return null
    return (coll[id] as T) ?? null
  }

  async setStructured<T>(collection: string, id: string, value: T): Promise<void> {
    const collKey = this.getCollectionKey(collection)
    let coll = this.collections.get(collKey)
    if (!coll) {
      coll = {}
      this.collections.set(collKey, coll)
    }
    coll[id] = value
  }

  async deleteStructured(collection: string, id?: string): Promise<void> {
    const collKey = this.getCollectionKey(collection)
    if (id !== undefined) {
      const coll = this.collections.get(collKey)
      if (coll) {
        delete coll[id]
      }
    } else {
      this.collections.delete(collKey)
    }
  }

  async listStructured(collection: string): Promise<string[]> {
    const collKey = this.getCollectionKey(collection)
    const coll = this.collections.get(collKey)
    if (!coll) return []
    return Object.keys(coll)
  }

  // Batch operations

  async getBatch<T>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {}
    for (const key of keys) {
      result[key] = await this.get<T>(key)
    }
    return result
  }

  async setBatch(data: Record<string, unknown>): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      await this.set(key, value)
    }
  }

  // Events

  onChanged<T>(callback: (event: StorageChangeEvent<T>) => void): () => void {
    this.listeners.add(callback as (event: StorageChangeEvent) => void)
    return () => {
      this.listeners.delete(callback as (event: StorageChangeEvent) => void)
    }
  }

  // Utility methods

  /**
   * Get approximate size of stored data in bytes
   */
  size(): number {
    let total = 0
    for (const [key, value] of this.storage) {
      total += key.length + JSON.stringify(value).length
    }
    for (const [key, coll] of this.collections) {
      total += key.length + JSON.stringify(coll).length
    }
    return total
  }

  /**
   * Dump all data for debugging
   */
  dump(): { storage: Record<string, unknown>; collections: Record<string, CollectionStore> } {
    return {
      storage: Object.fromEntries(this.storage),
      collections: Object.fromEntries(this.collections),
    }
  }
}

/**
 * Create an in-memory storage adapter
 * @param config - Adapter configuration
 */
export function createMemoryStorage(config?: StorageAdapterConfig): IStorageAdapter {
  return new MemoryStorageAdapter(config)
}
