/**
 * Web adapters module - browser-specific implementations
 */

// Storage - localStorage
export {
  LocalStorageAdapter,
  createLocalStorage,
  isQuotaExceededError,
} from './local-storage-adapter'

// Storage - IndexedDB
export {
  IndexedDBAdapter,
  createIndexedDBStorage,
} from './indexed-db-adapter'

// Network
export {
  WebNetworkAdapter,
  createWebNetwork,
} from './web-network-adapter'

// Audio
export {
  WebAudioAdapter,
  createWebAudio,
} from './web-audio-adapter'

// Platform
export {
  WebPlatformAdapter,
  createWebPlatform,
} from './web-platform-adapter'

// Clipboard (legacy - now part of platform adapter)
export {
  copyToClipboard,
  readFromClipboard,
} from './clipboard-adapter'

// Keyboard
export {
  parseKeyBinding,
  bindKeyEvent,
  focusInput,
  type KeyBinding,
} from './keyboard-adapter'

// HTTP (legacy - now use WebNetworkAdapter)
export {
  fetchJson,
  loadTranslation,
  isOnline,
  onConnectivityChange,
  type HttpOptions,
  type HttpResponse,
} from './http-adapter'
