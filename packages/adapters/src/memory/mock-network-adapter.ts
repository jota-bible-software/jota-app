/**
 * Mock network adapter
 * For testing and offline scenarios
 */

import type {
  INetworkAdapter,
  RequestOptions,
  HttpResponse,
  DownloadProgress,
} from '../interfaces/network'
import { NetworkError } from '../interfaces/network'

/**
 * Mock response handler
 */
export type MockHandler<T = unknown> = (
  url: string,
  options?: RequestOptions & { body?: unknown }
) => Promise<T> | T

/**
 * Route definition
 */
interface MockRoute {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | '*'
  pattern: string | RegExp
  handler: MockHandler
  delay?: number
}

/**
 * Mock network adapter for testing
 */
export class MockNetworkAdapter implements INetworkAdapter {
  private routes: MockRoute[] = []
  private cache: Map<string, { data: unknown; cachedAt: number; ttl: number }> = new Map()
  private isOnlineState: boolean = true
  private connectionListeners: Set<(online: boolean) => void> = new Set()
  private defaultDelay: number = 0

  constructor(options: { delay?: number } = {}) {
    this.defaultDelay = options.delay ?? 0
  }

  /**
   * Register a mock route
   */
  mock<T>(
    method: MockRoute['method'],
    pattern: string | RegExp,
    handler: MockHandler<T>,
    delay?: number
  ): this {
    this.routes.push({
      method,
      pattern,
      handler: handler as MockHandler,
      delay: delay ?? this.defaultDelay,
    })
    return this
  }

  /**
   * Shorthand for GET routes
   */
  onGet<T>(pattern: string | RegExp, handler: MockHandler<T>, delay?: number): this {
    return this.mock('GET', pattern, handler, delay)
  }

  /**
   * Shorthand for POST routes
   */
  onPost<T>(pattern: string | RegExp, handler: MockHandler<T>, delay?: number): this {
    return this.mock('POST', pattern, handler, delay)
  }

  /**
   * Shorthand for any method
   */
  onAny<T>(pattern: string | RegExp, handler: MockHandler<T>, delay?: number): this {
    return this.mock('*', pattern, handler, delay)
  }

  /**
   * Clear all mock routes
   */
  clearMocks(): void {
    this.routes = []
  }

  /**
   * Set online state
   */
  setOnline(online: boolean): void {
    if (this.isOnlineState !== online) {
      this.isOnlineState = online
      this.connectionListeners.forEach((cb) => cb(online))
    }
  }

  private matchRoute(method: string, url: string): MockRoute | undefined {
    return this.routes.find((route) => {
      if (route.method !== '*' && route.method !== method) return false
      if (typeof route.pattern === 'string') {
        return url.includes(route.pattern)
      }
      return route.pattern.test(url)
    })
  }

  private async executeRequest<T>(
    method: string,
    url: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    if (!this.isOnlineState) {
      throw new NetworkError('No internet connection', 'OFFLINE')
    }

    const route = this.matchRoute(method, url)
    if (!route) {
      throw new NetworkError(`No mock handler for ${method} ${url}`, 'NOT_FOUND', 404)
    }

    if (route.delay) {
      await new Promise((resolve) => setTimeout(resolve, route.delay))
    }

    try {
      const data = await route.handler(url, { ...options, body })
      return {
        data: data as T,
        status: 200,
        headers: {},
        ok: true,
      }
    } catch (error) {
      if (error instanceof NetworkError) throw error
      throw new NetworkError(
        error instanceof Error ? error.message : 'Mock handler error',
        'UNKNOWN'
      )
    }
  }

  // HTTP methods

  async get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('GET', url, undefined, options)
  }

  async post<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('POST', url, data, options)
  }

  async put<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('PUT', url, data, options)
  }

  async patch<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('PATCH', url, data, options)
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.executeRequest<T>('DELETE', url, undefined, options)
  }

  // File downloads

  async downloadFile(
    url: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<Blob> {
    const response = await this.get<ArrayBuffer>(url, { responseType: 'arraybuffer' as never })

    // Simulate progress
    if (onProgress) {
      onProgress({ loaded: 0, total: 100, percent: 0 })
      await new Promise((resolve) => setTimeout(resolve, 10))
      onProgress({ loaded: 50, total: 100, percent: 50 })
      await new Promise((resolve) => setTimeout(resolve, 10))
      onProgress({ loaded: 100, total: 100, percent: 100 })
    }

    return new Blob([response.data])
  }

  async downloadJson<T>(
    url: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<T> {
    if (onProgress) {
      onProgress({ loaded: 0, total: 100, percent: 0 })
    }

    const response = await this.get<T>(url)

    if (onProgress) {
      onProgress({ loaded: 100, total: 100, percent: 100 })
    }

    return response.data
  }

  // Caching

  async getCached<T>(url: string, maxAge?: number): Promise<T | null> {
    const cached = this.cache.get(url)
    if (!cached) return null

    const age = Date.now() - cached.cachedAt
    const effectiveMaxAge = maxAge ?? cached.ttl

    if (age > effectiveMaxAge) {
      this.cache.delete(url)
      return null
    }

    return cached.data as T
  }

  async setCached<T>(url: string, data: T, ttl: number = 3600000): Promise<void> {
    this.cache.set(url, {
      data,
      cachedAt: Date.now(),
      ttl,
    })
  }

  async invalidateCache(url: string): Promise<void> {
    this.cache.delete(url)
  }

  async clearCache(): Promise<void> {
    this.cache.clear()
  }

  // Connection status

  async isOnline(): Promise<boolean> {
    return this.isOnlineState
  }

  onConnectionChange(callback: (online: boolean) => void): () => void {
    this.connectionListeners.add(callback)
    return () => {
      this.connectionListeners.delete(callback)
    }
  }
}

/**
 * Create a mock network adapter
 */
export function createMockNetwork(options?: { delay?: number }): MockNetworkAdapter {
  return new MockNetworkAdapter(options)
}
