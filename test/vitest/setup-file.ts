import { vi } from 'vitest'

// Mock global functions and objects
vi.stubGlobal('localStorage', {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
})

// Mock console.error to avoid noise in tests
console.error = vi.fn()
