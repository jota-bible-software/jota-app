import { vi } from 'vitest'

// Create an in-memory storage implementation
const memoryStorage: Record<string, string> = {}

// Mock global functions and objects
vi.stubGlobal('localStorage', {
  getItem: (key: string) => memoryStorage[key] ?? null,
  setItem: (key: string, value: string) => {
    memoryStorage[key] = value
  },
  clear: () => {
    Object.keys(memoryStorage).forEach(key => delete memoryStorage[key])
  },
  removeItem: (key: string) => {
    delete memoryStorage[key]
  },
})

// Mock console.error to avoid noise in tests
console.error = vi.fn()
