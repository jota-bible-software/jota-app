/**
 * In-memory storage adapter
 * Useful for testing or server-side rendering
 */

import type { StorageAdapter } from './storage-interface'

/**
 * In-memory implementation of StorageAdapter
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private storage: Map<string, string> = new Map()

  get<T>(key: string): T | null {
    const value = this.storage.get(key)
    if (value === undefined) return null
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  set<T>(key: string, value: T): void {
    this.storage.set(key, JSON.stringify(value))
  }

  remove(key: string): void {
    this.storage.delete(key)
  }

  has(key: string): boolean {
    return this.storage.has(key)
  }

  clear(): void {
    this.storage.clear()
  }

  keys(): string[] {
    return Array.from(this.storage.keys())
  }

  /**
   * Get the current size of storage in bytes (approximate)
   */
  size(): number {
    let total = 0
    this.storage.forEach((value, key) => {
      total += key.length + value.length
    })
    return total
  }
}

/**
 * Create a new in-memory storage adapter
 */
export function createMemoryStorage(): StorageAdapter {
  return new MemoryStorageAdapter()
}
