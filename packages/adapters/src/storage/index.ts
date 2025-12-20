/**
 * Storage module - abstract storage interfaces
 *
 * @deprecated Use imports from '@jota/adapters/interfaces' for types
 * and '@jota/adapters/memory' for MemoryStorageAdapter
 */

// Legacy sync storage interfaces (for backwards compatibility)
export type {
  StorageAdapter,
  AsyncStorageAdapter,
} from './storage-interface'

export { StorageError } from './storage-interface'

// Legacy memory storage (now in memory module)
export {
  MemoryStorageAdapter,
  createMemoryStorage,
} from './memory-storage'
