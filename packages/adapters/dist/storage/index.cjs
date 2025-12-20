'use strict';

// src/storage/storage-interface.ts
var StorageError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "StorageError";
  }
};

// src/storage/memory-storage.ts
var MemoryStorageAdapter = class {
  constructor() {
    this.storage = /* @__PURE__ */ new Map();
  }
  get(key) {
    const value = this.storage.get(key);
    if (value === void 0) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  set(key, value) {
    this.storage.set(key, JSON.stringify(value));
  }
  remove(key) {
    this.storage.delete(key);
  }
  has(key) {
    return this.storage.has(key);
  }
  clear() {
    this.storage.clear();
  }
  keys() {
    return Array.from(this.storage.keys());
  }
  /**
   * Get the current size of storage in bytes (approximate)
   */
  size() {
    let total = 0;
    this.storage.forEach((value, key) => {
      total += key.length + value.length;
    });
    return total;
  }
};
function createMemoryStorage() {
  return new MemoryStorageAdapter();
}

exports.MemoryStorageAdapter = MemoryStorageAdapter;
exports.StorageError = StorageError;
exports.createMemoryStorage = createMemoryStorage;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map