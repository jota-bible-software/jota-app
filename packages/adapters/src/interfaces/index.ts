/**
 * Adapter interfaces module
 * Abstract interfaces for platform-specific implementations
 */

// Storage
export type {
  IStorageAdapter,
  ISyncStorageAdapter,
  StorageChangeEvent,
  StorageAdapterConfig,
  StorageErrorCode,
} from './storage'

export { StorageError } from './storage'

// Network
export type {
  INetworkAdapter,
  RequestOptions,
  HttpResponse,
  DownloadProgress,
  CacheEntry,
  NetworkAdapterConfig,
  NetworkErrorCode,
} from './network'

export { NetworkError } from './network'

// Audio
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
} from './audio'

export { AudioError } from './audio'

// Platform
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
} from './platform'

export { PlatformError } from './platform'
