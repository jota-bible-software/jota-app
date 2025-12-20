/**
 * @jota/adapters - Platform adapters for Jota Bible App
 *
 * This package provides platform-specific implementations
 * for storage, network, audio, and platform APIs.
 *
 * @packageDocumentation
 */

// ============================================================================
// Adapter Interfaces
// ============================================================================

// Storage interfaces
export type {
  IStorageAdapter,
  ISyncStorageAdapter,
  StorageChangeEvent,
  StorageAdapterConfig,
  StorageErrorCode,
} from './interfaces/storage'
export { StorageError } from './interfaces/storage'

// Network interfaces
export type {
  INetworkAdapter,
  RequestOptions,
  HttpResponse,
  DownloadProgress,
  CacheEntry,
  NetworkAdapterConfig,
  NetworkErrorCode,
} from './interfaces/network'
export { NetworkError } from './interfaces/network'

// Audio interfaces
export type {
  IAudioAdapter,
  IAudioHandle,
  AudioOptions,
  AudioEvent,
  AudioEventCallback,
  AudioMetadata,
  AudioState,
  AudioAdapterConfig,
  AudioErrorCode,
} from './interfaces/audio'
export { AudioError } from './interfaces/audio'

// Platform interfaces
export type {
  IPlatformAdapter,
  Platform,
  PlatformInfo,
  PlatformCapabilities,
  FilePickerOptions,
  SelectedFile,
  NotificationOptions,
  NotificationClickEvent,
  PlatformErrorCode,
} from './interfaces/platform'
export { PlatformError } from './interfaces/platform'

// ============================================================================
// Web Adapters
// ============================================================================

// Storage - localStorage
export {
  LocalStorageAdapter,
  createLocalStorage,
  isQuotaExceededError,
} from './web/local-storage-adapter'

// Storage - IndexedDB
export {
  IndexedDBAdapter,
  createIndexedDBStorage,
} from './web/indexed-db-adapter'

// Network
export {
  WebNetworkAdapter,
  createWebNetwork,
} from './web/web-network-adapter'

// Audio
export {
  WebAudioAdapter,
  createWebAudio,
} from './web/web-audio-adapter'

// Platform
export {
  WebPlatformAdapter,
  createWebPlatform,
} from './web/web-platform-adapter'

// Legacy clipboard (now part of platform adapter)
export {
  copyToClipboard,
  readFromClipboard,
} from './web/clipboard-adapter'

// Keyboard utilities
export {
  parseKeyBinding,
  bindKeyEvent,
  focusInput,
  type KeyBinding,
} from './web/keyboard-adapter'

// Legacy HTTP utilities (use WebNetworkAdapter instead)
export {
  fetchJson,
  loadTranslation,
  isOnline,
  onConnectivityChange,
  type HttpOptions,
} from './web/http-adapter'

// ============================================================================
// Memory/Mock Adapters (for testing)
// ============================================================================

export {
  MemoryStorageAdapter,
  createMemoryStorage,
} from './memory/memory-storage-adapter'

export {
  MockNetworkAdapter,
  createMockNetwork,
  type MockHandler,
} from './memory/mock-network-adapter'

export {
  MockAudioAdapter,
  createMockAudio,
} from './memory/mock-audio-adapter'

export {
  MockPlatformAdapter,
  createMockPlatform,
} from './memory/mock-platform-adapter'

// ============================================================================
// Factory and Configuration
// ============================================================================

export {
  AdapterFactory,
  createStorageAdapter,
  createNetworkAdapter,
  createAudioAdapter,
  createPlatformAdapter,
  createAdapterSuite,
  type AdapterSuite,
} from './factory/adapter-factory'

export {
  defaultWebConfig,
  defaultTestConfig,
  mergeConfig,
  type AdapterConfig,
  type StorageConfig,
  type NetworkConfig,
  type AudioConfig,
  type PlatformConfig,
  type StorageAdapterType,
  type NetworkAdapterType,
  type AudioAdapterType,
  type PlatformAdapterType,
} from './factory/config'

export {
  detectEnvironment,
  detectCapabilities,
  getRecommendedConfig,
  isSecureContext,
  isPWA,
  getDeviceType,
  getPreferredColorScheme,
  getStorageQuota,
  requestPersistentStorage,
  type Environment,
  type DetectedCapabilities,
} from './factory/detection'
