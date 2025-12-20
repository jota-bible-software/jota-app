/**
 * IndexedDB storage adapter
 * Supports large data storage with structured collections
 */

import type {
  IStorageAdapter,
  StorageAdapterConfig,
  StorageChangeEvent,
} from '../interfaces/storage'
import { StorageError } from '../interfaces/storage'

const DEFAULT_DB_NAME = 'jota-db'
const DEFAULT_VERSION = 1
const KV_STORE = 'keyvalue'
const COLLECTIONS_STORE = 'collections'

interface CollectionItem<T = unknown> {
  collection: string
  id: string
  value: T
}

/**
 * IndexedDB-based storage adapter
 * Provides async storage for large datasets with structured collections
 */
export class IndexedDBAdapter implements IStorageAdapter {
  private db: IDBDatabase | null = null
  private dbName: string
  private prefix: string
  private listeners: Set<(event: StorageChangeEvent) => void> = new Set()
  private initPromise: Promise<void> | null = null

  constructor(config: StorageAdapterConfig & { dbName?: string } = {}) {
    this.dbName = config.dbName ?? DEFAULT_DB_NAME
    this.prefix = config.prefix ?? ''
  }

  private async init(): Promise<void> {
    if (this.db) return

    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in globalThis)) {
        reject(new StorageError('IndexedDB is not available', 'NOT_AVAILABLE'))
        return
      }

      const request = indexedDB.open(this.dbName, DEFAULT_VERSION)

      request.onerror = () => {
        reject(new StorageError('Failed to open IndexedDB', 'UNKNOWN'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Key-value store
        if (!db.objectStoreNames.contains(KV_STORE)) {
          db.createObjectStore(KV_STORE)
        }

        // Collections store with compound index
        if (!db.objectStoreNames.contains(COLLECTIONS_STORE)) {
          const store = db.createObjectStore(COLLECTIONS_STORE, {
            keyPath: ['collection', 'id'],
          })
          store.createIndex('collection', 'collection', { unique: false })
        }
      }
    })

    return this.initPromise
  }

  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}.${key}` : key
  }

  private notifyChange<T>(key: string, oldValue: T | null, newValue: T | null): void {
    const event: StorageChangeEvent<T> = { key, oldValue, newValue }
    this.listeners.forEach((listener) => listener(event))
  }

  // Key-value operations

  async get<T>(key: string): Promise<T | null> {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(KV_STORE, 'readonly')
      const store = transaction.objectStore(KV_STORE)
      const request = store.get(this.getKey(key))

      request.onerror = () => reject(new StorageError('Failed to get value', 'UNKNOWN'))
      request.onsuccess = () => resolve(request.result ?? null)
    })
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.init()
    const oldValue = await this.get<T>(key)

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(KV_STORE, 'readwrite')
      const store = transaction.objectStore(KV_STORE)
      const request = store.put(value, this.getKey(key))

      request.onerror = () => {
        const error = request.error
        if (error?.name === 'QuotaExceededError') {
          reject(new StorageError('Storage quota exceeded', 'QUOTA_EXCEEDED'))
        } else {
          reject(new StorageError('Failed to set value', 'UNKNOWN'))
        }
      }
      request.onsuccess = () => {
        this.notifyChange(key, oldValue, value)
        resolve()
      }
    })
  }

  async delete(key: string): Promise<void> {
    await this.init()
    const oldValue = await this.get(key)

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(KV_STORE, 'readwrite')
      const store = transaction.objectStore(KV_STORE)
      const request = store.delete(this.getKey(key))

      request.onerror = () => reject(new StorageError('Failed to delete value', 'UNKNOWN'))
      request.onsuccess = () => {
        this.notifyChange(key, oldValue, null)
        resolve()
      }
    })
  }

  async clear(): Promise<void> {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KV_STORE, COLLECTIONS_STORE], 'readwrite')

      if (this.prefix) {
        // Clear only keys with our prefix
        const kvStore = transaction.objectStore(KV_STORE)
        const cursorRequest = kvStore.openCursor()

        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result
          if (cursor) {
            const key = cursor.key as string
            if (key.startsWith(this.prefix)) {
              cursor.delete()
            }
            cursor.continue()
          }
        }

        // Clear collections with prefix
        const collectionsStore = transaction.objectStore(COLLECTIONS_STORE)
        const collCursorRequest = collectionsStore.openCursor()

        collCursorRequest.onsuccess = () => {
          const cursor = collCursorRequest.result
          if (cursor) {
            const item = cursor.value as CollectionItem
            if (item.collection.startsWith(this.prefix)) {
              cursor.delete()
            }
            cursor.continue()
          }
        }
      } else {
        // Clear all
        transaction.objectStore(KV_STORE).clear()
        transaction.objectStore(COLLECTIONS_STORE).clear()
      }

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(new StorageError('Failed to clear storage', 'UNKNOWN'))
    })
  }

  async keys(): Promise<string[]> {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(KV_STORE, 'readonly')
      const store = transaction.objectStore(KV_STORE)
      const request = store.getAllKeys()

      request.onerror = () => reject(new StorageError('Failed to get keys', 'UNKNOWN'))
      request.onsuccess = () => {
        let keys = request.result as string[]
        if (this.prefix) {
          keys = keys
            .filter((k) => k.startsWith(this.prefix))
            .map((k) => k.substring(this.prefix.length + 1))
        }
        resolve(keys)
      }
    })
  }

  // Structured storage operations

  async getStructured<T>(collection: string, id: string): Promise<T | null> {
    await this.init()
    const collectionKey = this.prefix ? `${this.prefix}.${collection}` : collection

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(COLLECTIONS_STORE, 'readonly')
      const store = transaction.objectStore(COLLECTIONS_STORE)
      const request = store.get([collectionKey, id])

      request.onerror = () => reject(new StorageError('Failed to get structured value', 'UNKNOWN'))
      request.onsuccess = () => {
        const item = request.result as CollectionItem<T> | undefined
        resolve(item?.value ?? null)
      }
    })
  }

  async setStructured<T>(collection: string, id: string, value: T): Promise<void> {
    await this.init()
    const collectionKey = this.prefix ? `${this.prefix}.${collection}` : collection

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(COLLECTIONS_STORE, 'readwrite')
      const store = transaction.objectStore(COLLECTIONS_STORE)
      const item: CollectionItem<T> = { collection: collectionKey, id, value }
      const request = store.put(item)

      request.onerror = () => {
        const error = request.error
        if (error?.name === 'QuotaExceededError') {
          reject(new StorageError('Storage quota exceeded', 'QUOTA_EXCEEDED'))
        } else {
          reject(new StorageError('Failed to set structured value', 'UNKNOWN'))
        }
      }
      request.onsuccess = () => resolve()
    })
  }

  async deleteStructured(collection: string, id?: string): Promise<void> {
    await this.init()
    const collectionKey = this.prefix ? `${this.prefix}.${collection}` : collection

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(COLLECTIONS_STORE, 'readwrite')
      const store = transaction.objectStore(COLLECTIONS_STORE)

      if (id !== undefined) {
        // Delete single item
        const request = store.delete([collectionKey, id])
        request.onerror = () =>
          reject(new StorageError('Failed to delete structured value', 'UNKNOWN'))
        request.onsuccess = () => resolve()
      } else {
        // Delete entire collection
        const index = store.index('collection')
        const request = index.openCursor(IDBKeyRange.only(collectionKey))

        request.onsuccess = () => {
          const cursor = request.result
          if (cursor) {
            cursor.delete()
            cursor.continue()
          }
        }

        transaction.oncomplete = () => resolve()
        transaction.onerror = () =>
          reject(new StorageError('Failed to delete collection', 'UNKNOWN'))
      }
    })
  }

  async listStructured(collection: string): Promise<string[]> {
    await this.init()
    const collectionKey = this.prefix ? `${this.prefix}.${collection}` : collection

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(COLLECTIONS_STORE, 'readonly')
      const store = transaction.objectStore(COLLECTIONS_STORE)
      const index = store.index('collection')
      const request = index.getAllKeys(IDBKeyRange.only(collectionKey))

      request.onerror = () =>
        reject(new StorageError('Failed to list structured items', 'UNKNOWN'))
      request.onsuccess = () => {
        // Keys are [collection, id] arrays
        const ids = (request.result as [string, string][]).map(([, id]) => id)
        resolve(ids)
      }
    })
  }

  // Batch operations

  async getBatch<T>(keys: string[]): Promise<Record<string, T | null>> {
    await this.init()

    const results: Record<string, T | null> = {}

    await Promise.all(
      keys.map(async (key) => {
        results[key] = await this.get<T>(key)
      })
    )

    return results
  }

  async setBatch(data: Record<string, unknown>): Promise<void> {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(KV_STORE, 'readwrite')
      const store = transaction.objectStore(KV_STORE)

      for (const [key, value] of Object.entries(data)) {
        store.put(value, this.getKey(key))
      }

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => {
        const error = transaction.error
        if (error?.name === 'QuotaExceededError') {
          reject(new StorageError('Storage quota exceeded', 'QUOTA_EXCEEDED'))
        } else {
          reject(new StorageError('Failed to set batch values', 'UNKNOWN'))
        }
      }
    })
  }

  // Events

  onChanged<T>(callback: (event: StorageChangeEvent<T>) => void): () => void {
    this.listeners.add(callback as (event: StorageChangeEvent) => void)
    return () => {
      this.listeners.delete(callback as (event: StorageChangeEvent) => void)
    }
  }

  // Cleanup

  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
      this.initPromise = null
    }
  }

  /**
   * Get storage usage estimate (if supported)
   */
  async getStorageEstimate(): Promise<{ usage: number; quota: number } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        usage: estimate.usage ?? 0,
        quota: estimate.quota ?? 0,
      }
    }
    return null
  }
}

/**
 * Create an IndexedDB storage adapter
 * @param config - Adapter configuration
 */
export function createIndexedDBStorage(
  config?: StorageAdapterConfig & { dbName?: string }
): IStorageAdapter {
  return new IndexedDBAdapter(config)
}
