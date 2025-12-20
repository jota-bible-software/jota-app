/**
 * Adapter factory module
 * Factory functions and configuration for creating adapters
 */

// Factory
export {
  AdapterFactory,
  createStorageAdapter,
  createNetworkAdapter,
  createAudioAdapter,
  createPlatformAdapter,
  createAdapterSuite,
  type AdapterSuite,
} from './adapter-factory'

// Configuration
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
} from './config'

// Detection
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
} from './detection'
