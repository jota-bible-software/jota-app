/**
 * Memory/mock adapters module
 * In-memory and mock implementations for testing and SSR
 */

// Storage
export {
  MemoryStorageAdapter,
  createMemoryStorage,
} from './memory-storage-adapter'

// Network
export {
  MockNetworkAdapter,
  createMockNetwork,
  type MockHandler,
} from './mock-network-adapter'

// Audio
export {
  MockAudioAdapter,
  createMockAudio,
} from './mock-audio-adapter'

// Platform
export {
  MockPlatformAdapter,
  createMockPlatform,
} from './mock-platform-adapter'
