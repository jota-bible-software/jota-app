/**
 * Abstract storage interface
 * Platform-agnostic storage abstraction
 */

/**
 * Key-value storage interface
 */
export interface StorageAdapter {
  /**
   * Get a value from storage
   * @param key - Storage key
   * @returns Stored value or null if not found
   */
  get<T>(key: string): T | null

  /**
   * Set a value in storage
   * @param key - Storage key
   * @param value - Value to store
   */
  set<T>(key: string, value: T): void

  /**
   * Remove a value from storage
   * @param key - Storage key
   */
  remove(key: string): void

  /**
   * Check if a key exists
   * @param key - Storage key
   */
  has(key: string): boolean

  /**
   * Clear all stored values
   */
  clear(): void

  /**
   * Get all keys
   */
  keys(): string[]
}

/**
 * Async storage interface for larger data
 */
export interface AsyncStorageAdapter {
  /**
   * Get a value from storage
   * @param key - Storage key
   * @returns Stored value or null if not found
   */
  get<T>(key: string): Promise<T | null>

  /**
   * Set a value in storage
   * @param key - Storage key
   * @param value - Value to store
   */
  set<T>(key: string, value: T): Promise<void>

  /**
   * Remove a value from storage
   * @param key - Storage key
   */
  remove(key: string): Promise<void>

  /**
   * Check if a key exists
   * @param key - Storage key
   */
  has(key: string): Promise<boolean>

  /**
   * Clear all stored values
   */
  clear(): Promise<void>

  /**
   * Get all keys
   */
  keys(): Promise<string[]>
}

/**
 * Storage error types
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: 'QUOTA_EXCEEDED' | 'NOT_AVAILABLE' | 'UNKNOWN'
  ) {
    super(message)
    this.name = 'StorageError'
  }
}
