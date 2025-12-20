/**
 * Network adapter interface
 * Platform-agnostic network abstraction for HTTP requests,
 * file downloads, caching, and connection status
 */

/**
 * HTTP request options
 */
export interface RequestOptions {
  /** Request headers */
  headers?: Record<string, string>
  /** Request timeout in milliseconds */
  timeout?: number
  /** Abort signal for request cancellation */
  signal?: AbortSignal
  /** Enable/disable credentials (cookies) */
  credentials?: 'include' | 'omit' | 'same-origin'
  /** Response type */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer'
}

/**
 * HTTP response wrapper
 */
export interface HttpResponse<T> {
  /** Response data */
  data: T
  /** HTTP status code */
  status: number
  /** Response headers */
  headers: Record<string, string>
  /** Whether the request was successful (2xx status) */
  ok: boolean
}

/**
 * Download progress information
 */
export interface DownloadProgress {
  /** Bytes loaded */
  loaded: number
  /** Total bytes (if known) */
  total: number | null
  /** Progress percentage (0-100) */
  percent: number
}

/**
 * Cache entry metadata
 */
export interface CacheEntry<T> {
  /** Cached data */
  data: T
  /** When the entry was cached (timestamp) */
  cachedAt: number
  /** Time-to-live in milliseconds */
  ttl: number
}

/**
 * Network adapter interface
 */
export interface INetworkAdapter {
  // HTTP requests
  /**
   * Perform a GET request
   * @param url - Request URL
   * @param options - Request options
   */
  get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>

  /**
   * Perform a POST request
   * @param url - Request URL
   * @param data - Request body
   * @param options - Request options
   */
  post<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>>

  /**
   * Perform a PUT request
   * @param url - Request URL
   * @param data - Request body
   * @param options - Request options
   */
  put<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>>

  /**
   * Perform a PATCH request
   * @param url - Request URL
   * @param data - Request body
   * @param options - Request options
   */
  patch<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>>

  /**
   * Perform a DELETE request
   * @param url - Request URL
   * @param options - Request options
   */
  delete<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>

  // File downloads
  /**
   * Download a file as Blob
   * @param url - File URL
   * @param onProgress - Progress callback
   */
  downloadFile(url: string, onProgress?: (progress: DownloadProgress) => void): Promise<Blob>

  /**
   * Download and parse JSON
   * @param url - JSON URL
   * @param onProgress - Progress callback
   */
  downloadJson<T>(url: string, onProgress?: (progress: DownloadProgress) => void): Promise<T>

  // Caching
  /**
   * Get cached data if still valid
   * @param url - Cache key (usually the URL)
   * @param maxAge - Maximum age in milliseconds
   */
  getCached<T>(url: string, maxAge?: number): Promise<T | null>

  /**
   * Store data in cache
   * @param url - Cache key
   * @param data - Data to cache
   * @param ttl - Time-to-live in milliseconds
   */
  setCached<T>(url: string, data: T, ttl?: number): Promise<void>

  /**
   * Invalidate cached data
   * @param url - Cache key to invalidate
   */
  invalidateCache(url: string): Promise<void>

  /**
   * Clear all cached data
   */
  clearCache(): Promise<void>

  // Connection status
  /**
   * Check if currently online
   */
  isOnline(): Promise<boolean>

  /**
   * Subscribe to connection status changes
   * @param callback - Called when connection status changes
   * @returns Cleanup function
   */
  onConnectionChange(callback: (online: boolean) => void): () => void
}

/**
 * Network error codes
 */
export type NetworkErrorCode =
  | 'TIMEOUT'
  | 'OFFLINE'
  | 'ABORTED'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'PARSE_ERROR'
  | 'UNKNOWN'

/**
 * Network error class
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    public readonly code: NetworkErrorCode,
    public readonly status?: number,
    public readonly response?: unknown
  ) {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * Network adapter configuration
 */
export interface NetworkAdapterConfig {
  /** Base URL for all requests */
  baseUrl?: string
  /** Default timeout in milliseconds */
  timeout?: number
  /** Default headers for all requests */
  headers?: Record<string, string>
  /** Enable request/response logging */
  debug?: boolean
  /** Retry configuration */
  retry?: {
    /** Maximum retry attempts */
    maxAttempts: number
    /** Delay between retries in milliseconds */
    delay: number
    /** Multiply delay by this factor for each retry */
    backoffFactor?: number
  }
}
