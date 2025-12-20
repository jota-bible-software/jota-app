/**
 * Storage adapter interface
 * Platform-agnostic storage abstraction with support for
 * key-value storage, structured data, and batch operations
 */

/**
 * Storage change event
 */
export interface StorageChangeEvent<T = unknown> {
  key: string
  oldValue: T | null
  newValue: T | null
}

/**
 * Comprehensive storage adapter interface
 * Supports both simple key-value and structured collection-based storage
 */
export interface IStorageAdapter {
  // Key-value storage
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
   * Delete a value from storage
   * @param key - Storage key
   */
  delete(key: string): Promise<void>

  /**
   * Clear all stored values
   */
  clear(): Promise<void>

  /**
   * Get all storage keys
   */
  keys(): Promise<string[]>

  // Structured storage for large/organized data
  /**
   * Get a structured item from a collection
   * @param collection - Collection name
   * @param id - Item identifier
   */
  getStructured<T>(collection: string, id: string): Promise<T | null>

  /**
   * Set a structured item in a collection
   * @param collection - Collection name
   * @param id - Item identifier
   * @param value - Value to store
   */
  setStructured<T>(collection: string, id: string, value: T): Promise<void>

  /**
   * Delete structured item(s) from a collection
   * @param collection - Collection name
   * @param id - Optional item identifier (deletes entire collection if omitted)
   */
  deleteStructured(collection: string, id?: string): Promise<void>

  /**
   * List all item IDs in a collection
   * @param collection - Collection name
   */
  listStructured(collection: string): Promise<string[]>

  // Bulk operations
  /**
   * Get multiple values at once
   * @param keys - Array of storage keys
   */
  getBatch<T>(keys: string[]): Promise<Record<string, T | null>>

  /**
   * Set multiple values at once
   * @param data - Key-value pairs to store
   */
  setBatch(data: Record<string, unknown>): Promise<void>

  // Events
  /**
   * Subscribe to storage changes
   * @param callback - Called when storage changes
   * @returns Cleanup function to unsubscribe
   */
  onChanged<T>(callback: (event: StorageChangeEvent<T>) => void): () => void
}

/**
 * Synchronous storage adapter for simple use cases
 * Useful when async is not needed (e.g., localStorage)
 */
export interface ISyncStorageAdapter {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  delete(key: string): void
  clear(): void
  keys(): string[]
  has(key: string): boolean
}

/**
 * Storage error codes
 */
export type StorageErrorCode =
  | 'QUOTA_EXCEEDED'
  | 'NOT_AVAILABLE'
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'INVALID_DATA'
  | 'UNKNOWN'

/**
 * Storage error class
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: StorageErrorCode
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

/**
 * Storage adapter configuration
 */
export interface StorageAdapterConfig {
  /** Prefix for all storage keys */
  prefix?: string
  /** Maximum storage quota in bytes (if supported) */
  maxQuota?: number
  /** Enable compression for large values */
  compression?: boolean
}
