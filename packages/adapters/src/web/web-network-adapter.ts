/**
 * Web network adapter
 * Fetch-based HTTP client with caching support
 */

import type {
  INetworkAdapter,
  RequestOptions,
  HttpResponse,
  DownloadProgress,
  NetworkAdapterConfig,
} from '../interfaces/network'
import { NetworkError } from '../interfaces/network'

const DEFAULT_TIMEOUT = 30000
const DEFAULT_CACHE_TTL = 3600000 // 1 hour

interface CacheItem<T> {
  data: T
  cachedAt: number
  ttl: number
}

/**
 * Web-based network adapter using fetch API
 */
export class WebNetworkAdapter implements INetworkAdapter {
  private config: NetworkAdapterConfig
  private cache: Map<string, CacheItem<unknown>> = new Map()
  private onlineListeners: Set<(online: boolean) => void> = new Set()
  private boundOnlineHandler: () => void
  private boundOfflineHandler: () => void

  constructor(config: NetworkAdapterConfig = {}) {
    this.config = {
      timeout: DEFAULT_TIMEOUT,
      ...config,
    }

    this.boundOnlineHandler = () => this.notifyConnectionChange(true)
    this.boundOfflineHandler = () => this.notifyConnectionChange(false)

    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.boundOnlineHandler)
      window.addEventListener('offline', this.boundOfflineHandler)
    }
  }

  private notifyConnectionChange(online: boolean): void {
    this.onlineListeners.forEach((listener) => listener(online))
  }

  private buildUrl(url: string): string {
    if (this.config.baseUrl && !url.startsWith('http')) {
      return `${this.config.baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
    }
    return url
  }

  private buildHeaders(options?: RequestOptions): Record<string, string> {
    return {
      ...this.config.headers,
      ...options?.headers,
    }
  }

  private parseResponseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    const fullUrl = this.buildUrl(url)
    const timeout = options?.timeout ?? this.config.timeout ?? DEFAULT_TIMEOUT

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: this.buildHeaders(options),
        signal: options?.signal ?? controller.signal,
        credentials: options?.credentials,
      }

      if (body !== undefined && method !== 'GET' && method !== 'HEAD') {
        fetchOptions.body = JSON.stringify(body)
        fetchOptions.headers = {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        }
      }

      const response = await fetch(fullUrl, fetchOptions)
      clearTimeout(timeoutId)

      let data: T

      const responseType = options?.responseType ?? 'json'
      switch (responseType) {
        case 'text':
          data = (await response.text()) as T
          break
        case 'blob':
          data = (await response.blob()) as T
          break
        case 'arraybuffer':
          data = (await response.arrayBuffer()) as T
          break
        case 'json':
        default:
          data = (await response.json()) as T
          break
      }

      return {
        data,
        status: response.status,
        headers: this.parseResponseHeaders(response.headers),
        ok: response.ok,
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          if (!navigator.onLine) {
            throw new NetworkError('No internet connection', 'OFFLINE')
          }
          throw new NetworkError('Request timeout', 'TIMEOUT')
        }
        throw new NetworkError(error.message, 'NETWORK_ERROR')
      }
      throw new NetworkError('Unknown network error', 'UNKNOWN')
    }
  }

  // HTTP methods

  async get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, undefined, options)
  }

  async post<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, data, options)
  }

  async put<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, data, options)
  }

  async patch<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', url, data, options)
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options)
  }

  // File downloads

  async downloadFile(
    url: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<Blob> {
    const fullUrl = this.buildUrl(url)
    const response = await fetch(fullUrl)

    if (!response.ok) {
      throw new NetworkError(`Download failed: ${response.status}`, 'SERVER_ERROR', response.status)
    }

    if (!response.body) {
      // Fallback for browsers without streaming support
      return response.blob()
    }

    const contentLength = response.headers.get('content-length')
    const total = contentLength ? parseInt(contentLength, 10) : null

    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let loaded = 0

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      chunks.push(value)
      loaded += value.length

      if (onProgress) {
        onProgress({
          loaded,
          total,
          percent: total ? Math.round((loaded / total) * 100) : 0,
        })
      }
    }

    const blob = new Blob(chunks)
    return blob
  }

  async downloadJson<T>(
    url: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<T> {
    const blob = await this.downloadFile(url, onProgress)
    const text = await blob.text()

    try {
      return JSON.parse(text) as T
    } catch {
      throw new NetworkError('Failed to parse JSON', 'PARSE_ERROR')
    }
  }

  // Caching

  async getCached<T>(url: string, maxAge?: number): Promise<T | null> {
    const cacheKey = this.buildUrl(url)
    const cached = this.cache.get(cacheKey) as CacheItem<T> | undefined

    if (!cached) return null

    const age = Date.now() - cached.cachedAt
    const effectiveMaxAge = maxAge ?? cached.ttl

    if (age > effectiveMaxAge) {
      this.cache.delete(cacheKey)
      return null
    }

    return cached.data
  }

  async setCached<T>(url: string, data: T, ttl?: number): Promise<void> {
    const cacheKey = this.buildUrl(url)
    this.cache.set(cacheKey, {
      data,
      cachedAt: Date.now(),
      ttl: ttl ?? DEFAULT_CACHE_TTL,
    })
  }

  async invalidateCache(url: string): Promise<void> {
    const cacheKey = this.buildUrl(url)
    this.cache.delete(cacheKey)
  }

  async clearCache(): Promise<void> {
    this.cache.clear()
  }

  // Connection status

  async isOnline(): Promise<boolean> {
    return navigator.onLine
  }

  onConnectionChange(callback: (online: boolean) => void): () => void {
    this.onlineListeners.add(callback)
    return () => {
      this.onlineListeners.delete(callback)
    }
  }

  // Cleanup

  dispose(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.boundOnlineHandler)
      window.removeEventListener('offline', this.boundOfflineHandler)
    }
    this.onlineListeners.clear()
    this.cache.clear()
  }
}

/**
 * Create a web network adapter
 * @param config - Adapter configuration
 */
export function createWebNetwork(config?: NetworkAdapterConfig): INetworkAdapter {
  return new WebNetworkAdapter(config)
}
