import { StorageAdapterConfig, NetworkAdapterConfig, AudioAdapterConfig, IStorageAdapter, INetworkAdapter, IAudioAdapter, IPlatformAdapter } from '../interfaces/index.cjs';

/**
 * Adapter configuration types and utilities
 */

/**
 * Storage adapter type
 */
type StorageAdapterType = 'memory' | 'localStorage' | 'indexedDB' | 'hybrid';
/**
 * Network adapter type
 */
type NetworkAdapterType = 'fetch' | 'mock';
/**
 * Audio adapter type
 */
type AudioAdapterType = 'webAudio' | 'mock';
/**
 * Platform adapter type
 */
type PlatformAdapterType = 'web' | 'mock';
/**
 * Storage configuration
 */
interface StorageConfig extends StorageAdapterConfig {
    /** Storage adapter type */
    type: StorageAdapterType;
    /** IndexedDB database name */
    dbName?: string;
    /** For hybrid mode: adapter for small data */
    small?: {
        type: 'localStorage' | 'memory';
        config?: StorageAdapterConfig;
    };
    /** For hybrid mode: adapter for large data */
    large?: {
        type: 'indexedDB' | 'memory';
        config?: StorageAdapterConfig & {
            dbName?: string;
        };
    };
}
/**
 * Network configuration
 */
interface NetworkConfig extends NetworkAdapterConfig {
    /** Network adapter type */
    type: NetworkAdapterType;
    /** Cache configuration */
    cache?: {
        /** Enable caching */
        enabled: boolean;
        /** Default TTL in milliseconds */
        maxAge?: number;
    };
}
/**
 * Audio configuration
 */
interface AudioConfig extends AudioAdapterConfig {
    /** Audio adapter type */
    type: AudioAdapterType;
    /** Fallback adapter type */
    fallback?: AudioAdapterType;
}
/**
 * Platform configuration
 */
interface PlatformConfig {
    /** Platform adapter type */
    type: PlatformAdapterType;
}
/**
 * Complete adapter configuration
 */
interface AdapterConfig {
    /** Storage adapter configuration */
    storage?: StorageConfig;
    /** Network adapter configuration */
    network?: NetworkConfig;
    /** Audio adapter configuration */
    audio?: AudioConfig;
    /** Platform adapter configuration */
    platform?: PlatformConfig;
}
/**
 * Default web app configuration
 */
declare const defaultWebConfig: AdapterConfig;
/**
 * Default test configuration
 */
declare const defaultTestConfig: AdapterConfig;
/**
 * Merge configuration with defaults
 */
declare function mergeConfig(config: Partial<AdapterConfig>, defaults?: AdapterConfig): AdapterConfig;

/**
 * Adapter factory
 * Creates platform-specific adapters based on configuration
 */

/**
 * Adapter suite containing all adapters
 */
interface AdapterSuite {
    storage: IStorageAdapter;
    network: INetworkAdapter;
    audio: IAudioAdapter;
    platform: IPlatformAdapter;
}
/**
 * Create a storage adapter based on configuration
 */
declare function createStorageAdapter(config?: StorageConfig): IStorageAdapter;
/**
 * Create a network adapter based on configuration
 */
declare function createNetworkAdapter(config?: NetworkConfig): INetworkAdapter;
/**
 * Create an audio adapter based on configuration
 */
declare function createAudioAdapter(config?: AudioConfig): IAudioAdapter;
/**
 * Create a platform adapter based on configuration
 */
declare function createPlatformAdapter(config?: PlatformConfig): IPlatformAdapter;
/**
 * Create a complete adapter suite based on configuration
 */
declare function createAdapterSuite(config?: Partial<AdapterConfig>): AdapterSuite;
/**
 * Adapter factory class for more complex scenarios
 */
declare class AdapterFactory {
    private config;
    constructor(config?: Partial<AdapterConfig>);
    createStorage(): IStorageAdapter;
    createNetwork(): INetworkAdapter;
    createAudio(): IAudioAdapter;
    createPlatform(): IPlatformAdapter;
    createSuite(): AdapterSuite;
    /**
     * Get current configuration
     */
    getConfig(): AdapterConfig;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<AdapterConfig>): void;
}

/**
 * Platform and capability detection
 */

/**
 * Detected environment
 */
type Environment = 'browser' | 'node' | 'worker' | 'test' | 'unknown';
/**
 * Detected capabilities
 */
interface DetectedCapabilities {
    /** localStorage available */
    localStorage: boolean;
    /** IndexedDB available */
    indexedDB: boolean;
    /** Fetch API available */
    fetch: boolean;
    /** Web Audio API available */
    webAudio: boolean;
    /** Notification API available */
    notifications: boolean;
    /** Clipboard API available */
    clipboard: boolean;
    /** Share API available */
    share: boolean;
    /** Service Worker available */
    serviceWorker: boolean;
    /** Is online */
    online: boolean;
}
/**
 * Detect current environment
 */
declare function detectEnvironment(): Environment;
/**
 * Detect available capabilities
 */
declare function detectCapabilities(): DetectedCapabilities;
/**
 * Get recommended configuration based on detected environment
 */
declare function getRecommendedConfig(): AdapterConfig;
/**
 * Check if running in a secure context (HTTPS or localhost)
 */
declare function isSecureContext(): boolean;
/**
 * Check if running as installed PWA
 */
declare function isPWA(): boolean;
/**
 * Get device type based on user agent and screen
 */
declare function getDeviceType(): 'mobile' | 'tablet' | 'desktop';
/**
 * Get preferred color scheme
 */
declare function getPreferredColorScheme(): 'light' | 'dark';
/**
 * Get estimated storage quota
 */
declare function getStorageQuota(): Promise<{
    usage: number;
    quota: number;
} | null>;
/**
 * Request persistent storage (prevents browser from evicting data)
 */
declare function requestPersistentStorage(): Promise<boolean>;

export { type AdapterConfig, AdapterFactory, type AdapterSuite, type AudioAdapterType, type AudioConfig, type DetectedCapabilities, type Environment, type NetworkAdapterType, type NetworkConfig, type PlatformAdapterType, type PlatformConfig, type StorageAdapterType, type StorageConfig, createAdapterSuite, createAudioAdapter, createNetworkAdapter, createPlatformAdapter, createStorageAdapter, defaultTestConfig, defaultWebConfig, detectCapabilities, detectEnvironment, getDeviceType, getPreferredColorScheme, getRecommendedConfig, getStorageQuota, isPWA, isSecureContext, mergeConfig, requestPersistentStorage };
