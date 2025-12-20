/**
 * localStorage adapter for web browsers
 */

import type { StorageAdapter } from '../storage/storage-interface'
import { StorageError } from '../storage/storage-interface'

/**
 * Check if an error is a QuotaExceededError
 */
export function isQuotaExceededError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.code === 22 ||
      error.code === 1014 ||
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  )
}

/**
 * localStorage implementation of StorageAdapter
 */
export class LocalStorageAdapter implements StorageAdapter {
  constructor(private prefix: string = '') {}

  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}.${key}` : key
  }

  get<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(this.getKey(key))
      if (value === null) return null
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value))
    } catch (error) {
      if (isQuotaExceededError(error)) {
        throw new StorageError('localStorage quota exceeded', 'QUOTA_EXCEEDED')
      }
      throw error
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key))
  }

  has(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null
  }

  clear(): void {
    if (this.prefix) {
      // Only clear keys with our prefix
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } else {
      localStorage.clear()
    }
  }

  keys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        if (this.prefix) {
          if (key.startsWith(this.prefix)) {
            keys.push(key.substring(this.prefix.length + 1))
          }
        } else {
          keys.push(key)
        }
      }
    }
    return keys
  }

  /**
   * Get approximate localStorage usage in bytes
   */
  getSize(): number {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        total += key.length + (localStorage.getItem(key)?.length || 0)
      }
    }
    return total
  }

  /**
   * Get localStorage usage as a percentage (assumes 5MB limit)
   */
  getUsagePercent(): number {
    const size = this.getSize()
    const estimatedLimit = 5 * 1024 * 1024 // 5MB in bytes
    return Math.min(100, (size / estimatedLimit) * 100)
  }
}

/**
 * Create a new localStorage adapter
 * @param prefix - Optional prefix for all keys
 */
export function createLocalStorage(prefix?: string): StorageAdapter {
  return new LocalStorageAdapter(prefix)
}
