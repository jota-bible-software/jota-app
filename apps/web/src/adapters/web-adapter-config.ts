/**
 * Web Adapter Configuration
 * Configures adapters for the web platform
 */

import { createAdapterSuite, type AdapterConfig } from '@jota/adapters'

export const webAdapterConfig: AdapterConfig = {
  storage: {
    type: 'hybrid',
    small: {
      type: 'localStorage',
      config: { prefix: 'jota.' }
    },
    large: {
      type: 'indexedDB',
      config: { dbName: 'jota-bible' }
    }
  },
  network: {
    type: 'fetch',
    baseUrl: process.env.VUE_ROUTER_BASE || (process.env.NODE_ENV === 'test' ? '/' : '/jota/'),
    timeout: 30000
  },
  audio: {
    type: 'webAudio'
  },
  platform: {
    type: 'web'
  }
}

// Create singleton adapter suite
let adapterSuite: ReturnType<typeof createAdapterSuite> | null = null

export function getAdapters() {
  if (!adapterSuite) {
    adapterSuite = createAdapterSuite(webAdapterConfig)
  }
  return adapterSuite
}

export function resetAdapters() {
  adapterSuite = null
}
