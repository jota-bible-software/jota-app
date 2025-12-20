/**
 * HTTP adapter for web browsers
 */

import type { TranslationFile } from '@jota/core'

/**
 * HTTP request options
 */
export interface HttpOptions {
  headers?: Record<string, string>
  timeout?: number
}

/**
 * HTTP response wrapper
 */
export interface HttpResponse<T> {
  data: T
  status: number
  ok: boolean
}

/**
 * Fetch JSON data from a URL
 * @param url - URL to fetch
 * @param options - Request options
 * @returns Response with parsed JSON
 */
export async function fetchJson<T>(
  url: string,
  options: HttpOptions = {}
): Promise<HttpResponse<T>> {
  const controller = new AbortController()
  const timeout = options.timeout ?? 30000

  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const data = await response.json()

    return {
      data: data as T,
      status: response.status,
      ok: response.ok,
    }
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

/**
 * Load a Bible translation file
 * @param baseUrl - Base URL for translation files
 * @param locale - Locale code
 * @param symbol - Translation symbol
 * @returns Translation file data
 */
export async function loadTranslation(
  baseUrl: string,
  locale: string,
  symbol: string
): Promise<TranslationFile> {
  const url = `${baseUrl}/${locale}/${symbol}.json`
  const response = await fetchJson<TranslationFile>(url)

  if (!response.ok) {
    throw new Error(`Failed to load translation: ${response.status}`)
  }

  return response.data
}

/**
 * Check if the browser is online
 */
export function isOnline(): boolean {
  return navigator.onLine
}

/**
 * Add online/offline event listeners
 * @param onOnline - Callback when browser goes online
 * @param onOffline - Callback when browser goes offline
 * @returns Cleanup function
 */
export function onConnectivityChange(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)

  return () => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }
}
