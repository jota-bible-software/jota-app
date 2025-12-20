/**
 * Adapter configuration types and utilities
 */

import type { StorageAdapterConfig } from '../interfaces/storage'
import type { NetworkAdapterConfig } from '../interfaces/network'
import type { AudioAdapterConfig } from '../interfaces/audio'

/**
 * Storage adapter type
 */
export type StorageAdapterType =
  | 'memory'
  | 'localStorage'
  | 'indexedDB'
  | 'hybrid'

/**
 * Network adapter type
 */
export type NetworkAdapterType = 'fetch' | 'mock'

/**
 * Audio adapter type
 */
export type AudioAdapterType = 'webAudio' | 'mock'

/**
 * Platform adapter type
 */
export type PlatformAdapterType = 'web' | 'mock'

/**
 * Storage configuration
 */
export interface StorageConfig extends StorageAdapterConfig {
  /** Storage adapter type */
  type: StorageAdapterType
  /** IndexedDB database name */
  dbName?: string
  /** For hybrid mode: adapter for small data */
  small?: {
    type: 'localStorage' | 'memory'
    config?: StorageAdapterConfig
  }
  /** For hybrid mode: adapter for large data */
  large?: {
    type: 'indexedDB' | 'memory'
    config?: StorageAdapterConfig & { dbName?: string }
  }
}

/**
 * Network configuration
 */
export interface NetworkConfig extends NetworkAdapterConfig {
  /** Network adapter type */
  type: NetworkAdapterType
  /** Cache configuration */
  cache?: {
    /** Enable caching */
    enabled: boolean
    /** Default TTL in milliseconds */
    maxAge?: number
  }
}

/**
 * Audio configuration
 */
export interface AudioConfig extends AudioAdapterConfig {
  /** Audio adapter type */
  type: AudioAdapterType
  /** Fallback adapter type */
  fallback?: AudioAdapterType
}

/**
 * Platform configuration
 */
export interface PlatformConfig {
  /** Platform adapter type */
  type: PlatformAdapterType
}

/**
 * Complete adapter configuration
 */
export interface AdapterConfig {
  /** Storage adapter configuration */
  storage?: StorageConfig
  /** Network adapter configuration */
  network?: NetworkConfig
  /** Audio adapter configuration */
  audio?: AudioConfig
  /** Platform adapter configuration */
  platform?: PlatformConfig
}

/**
 * Default web app configuration
 */
export const defaultWebConfig: AdapterConfig = {
  storage: {
    type: 'hybrid',
    small: { type: 'localStorage' },
    large: { type: 'indexedDB' },
  },
  network: {
    type: 'fetch',
    cache: { enabled: true, maxAge: 3600000 },
  },
  audio: {
    type: 'webAudio',
  },
  platform: {
    type: 'web',
  },
}

/**
 * Default test configuration
 */
export const defaultTestConfig: AdapterConfig = {
  storage: {
    type: 'memory',
  },
  network: {
    type: 'mock',
  },
  audio: {
    type: 'mock',
  },
  platform: {
    type: 'mock',
  },
}

/**
 * Merge configuration with defaults
 */
export function mergeConfig(
  config: Partial<AdapterConfig>,
  defaults: AdapterConfig = defaultWebConfig
): AdapterConfig {
  return {
    storage: { ...defaults.storage, ...config.storage } as StorageConfig,
    network: { ...defaults.network, ...config.network } as NetworkConfig,
    audio: { ...defaults.audio, ...config.audio } as AudioConfig,
    platform: { ...defaults.platform, ...config.platform } as PlatformConfig,
  }
}
