import { S as StorageAdapter } from '../storage-interface-qZlwxSJw.js';
export { A as AsyncStorageAdapter, a as StorageError } from '../storage-interface-qZlwxSJw.js';

/**
 * In-memory storage adapter
 * Useful for testing or server-side rendering
 */

/**
 * In-memory implementation of StorageAdapter
 */
declare class MemoryStorageAdapter implements StorageAdapter {
    private storage;
    get<T>(key: string): T | null;
    set<T>(key: string, value: T): void;
    remove(key: string): void;
    has(key: string): boolean;
    clear(): void;
    keys(): string[];
    /**
     * Get the current size of storage in bytes (approximate)
     */
    size(): number;
}
/**
 * Create a new in-memory storage adapter
 */
declare function createMemoryStorage(): StorageAdapter;

export { MemoryStorageAdapter, StorageAdapter, createMemoryStorage };
