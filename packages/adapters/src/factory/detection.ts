/**
 * Platform and capability detection
 */

import type { AdapterConfig } from './config'
import { defaultWebConfig, defaultTestConfig } from './config'

/**
 * Detected environment
 */
export type Environment = 'browser' | 'node' | 'worker' | 'test' | 'unknown'

/**
 * Detected capabilities
 */
export interface DetectedCapabilities {
  /** localStorage available */
  localStorage: boolean
  /** IndexedDB available */
  indexedDB: boolean
  /** Fetch API available */
  fetch: boolean
  /** Web Audio API available */
  webAudio: boolean
  /** Notification API available */
  notifications: boolean
  /** Clipboard API available */
  clipboard: boolean
  /** Share API available */
  share: boolean
  /** Service Worker available */
  serviceWorker: boolean
  /** Is online */
  online: boolean
}

/**
 * Detect current environment
 */
export function detectEnvironment(): Environment {
  // Check for test environment
  if (
    typeof process !== 'undefined' &&
    (process.env.NODE_ENV === 'test' || process.env.VITEST)
  ) {
    return 'test'
  }

  // Check for browser
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return 'browser'
  }

  // Check for web worker
  if (
    typeof self !== 'undefined' &&
    typeof (globalThis as { WorkerGlobalScope?: unknown }).WorkerGlobalScope !== 'undefined'
  ) {
    return 'worker'
  }

  // Check for Node.js
  if (typeof process !== 'undefined' && process.versions?.node) {
    return 'node'
  }

  return 'unknown'
}

/**
 * Detect available capabilities
 */
export function detectCapabilities(): DetectedCapabilities {
  const env = detectEnvironment()

  if (env !== 'browser') {
    // Non-browser environments have limited capabilities
    return {
      localStorage: false,
      indexedDB: false,
      fetch: env === 'node', // Node has fetch in v18+
      webAudio: false,
      notifications: false,
      clipboard: false,
      share: false,
      serviceWorker: false,
      online: true,
    }
  }

  // Browser environment
  return {
    localStorage: typeof localStorage !== 'undefined',
    indexedDB: typeof indexedDB !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    webAudio: typeof AudioContext !== 'undefined' || typeof (window as { webkitAudioContext?: unknown }).webkitAudioContext !== 'undefined',
    notifications: 'Notification' in window,
    clipboard: 'clipboard' in navigator,
    share: 'share' in navigator,
    serviceWorker: 'serviceWorker' in navigator,
    online: navigator.onLine,
  }
}

/**
 * Get recommended configuration based on detected environment
 */
export function getRecommendedConfig(): AdapterConfig {
  const env = detectEnvironment()
  const caps = detectCapabilities()

  // Test environment
  if (env === 'test') {
    return defaultTestConfig
  }

  // Non-browser environment
  if (env !== 'browser') {
    return defaultTestConfig // Use memory/mock adapters
  }

  // Browser environment - customize based on capabilities
  const config: AdapterConfig = { ...defaultWebConfig }

  // Storage configuration
  if (caps.indexedDB && caps.localStorage) {
    config.storage = {
      type: 'hybrid',
      small: { type: 'localStorage' },
      large: { type: 'indexedDB' },
    }
  } else if (caps.localStorage) {
    config.storage = { type: 'localStorage' }
  } else if (caps.indexedDB) {
    config.storage = { type: 'indexedDB' }
  } else {
    config.storage = { type: 'memory' }
  }

  // Network configuration
  if (caps.fetch) {
    config.network = {
      type: 'fetch',
      cache: { enabled: true, maxAge: 3600000 },
    }
  } else {
    config.network = { type: 'mock' }
  }

  // Audio configuration
  if (caps.webAudio) {
    config.audio = { type: 'webAudio' }
  } else {
    config.audio = { type: 'mock' }
  }

  // Platform is always web in browser
  config.platform = { type: 'web' }

  return config
}

/**
 * Check if running in a secure context (HTTPS or localhost)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return false
  return window.isSecureContext ?? false
}

/**
 * Check if running as installed PWA
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as { standalone?: boolean }).standalone === true
  )
}

/**
 * Get device type based on user agent and screen
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  const ua = navigator.userAgent.toLowerCase()

  if (ua.includes('mobile')) return 'mobile'
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet'

  // Check screen size as fallback
  if (window.innerWidth < 768) return 'mobile'
  if (window.innerWidth < 1024) return 'tablet'

  return 'desktop'
}

/**
 * Get preferred color scheme
 */
export function getPreferredColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

/**
 * Get estimated storage quota
 */
export async function getStorageQuota(): Promise<{ usage: number; quota: number } | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) {
    return null
  }

  try {
    const estimate = await navigator.storage.estimate()
    return {
      usage: estimate.usage ?? 0,
      quota: estimate.quota ?? 0,
    }
  } catch {
    return null
  }
}

/**
 * Request persistent storage (prevents browser from evicting data)
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) {
    return false
  }

  try {
    return await navigator.storage.persist()
  } catch {
    return false
  }
}
