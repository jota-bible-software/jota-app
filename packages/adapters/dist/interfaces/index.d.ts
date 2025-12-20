/**
 * Storage adapter interface
 * Platform-agnostic storage abstraction with support for
 * key-value storage, structured data, and batch operations
 */
/**
 * Storage change event
 */
interface StorageChangeEvent<T = unknown> {
    key: string;
    oldValue: T | null;
    newValue: T | null;
}
/**
 * Comprehensive storage adapter interface
 * Supports both simple key-value and structured collection-based storage
 */
interface IStorageAdapter {
    /**
     * Get a value from storage
     * @param key - Storage key
     * @returns Stored value or null if not found
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set a value in storage
     * @param key - Storage key
     * @param value - Value to store
     */
    set<T>(key: string, value: T): Promise<void>;
    /**
     * Delete a value from storage
     * @param key - Storage key
     */
    delete(key: string): Promise<void>;
    /**
     * Clear all stored values
     */
    clear(): Promise<void>;
    /**
     * Get all storage keys
     */
    keys(): Promise<string[]>;
    /**
     * Get a structured item from a collection
     * @param collection - Collection name
     * @param id - Item identifier
     */
    getStructured<T>(collection: string, id: string): Promise<T | null>;
    /**
     * Set a structured item in a collection
     * @param collection - Collection name
     * @param id - Item identifier
     * @param value - Value to store
     */
    setStructured<T>(collection: string, id: string, value: T): Promise<void>;
    /**
     * Delete structured item(s) from a collection
     * @param collection - Collection name
     * @param id - Optional item identifier (deletes entire collection if omitted)
     */
    deleteStructured(collection: string, id?: string): Promise<void>;
    /**
     * List all item IDs in a collection
     * @param collection - Collection name
     */
    listStructured(collection: string): Promise<string[]>;
    /**
     * Get multiple values at once
     * @param keys - Array of storage keys
     */
    getBatch<T>(keys: string[]): Promise<Record<string, T | null>>;
    /**
     * Set multiple values at once
     * @param data - Key-value pairs to store
     */
    setBatch(data: Record<string, unknown>): Promise<void>;
    /**
     * Subscribe to storage changes
     * @param callback - Called when storage changes
     * @returns Cleanup function to unsubscribe
     */
    onChanged<T>(callback: (event: StorageChangeEvent<T>) => void): () => void;
}
/**
 * Synchronous storage adapter for simple use cases
 * Useful when async is not needed (e.g., localStorage)
 */
interface ISyncStorageAdapter {
    get<T>(key: string): T | null;
    set<T>(key: string, value: T): void;
    delete(key: string): void;
    clear(): void;
    keys(): string[];
    has(key: string): boolean;
}
/**
 * Storage error codes
 */
type StorageErrorCode = 'QUOTA_EXCEEDED' | 'NOT_AVAILABLE' | 'PERMISSION_DENIED' | 'NOT_FOUND' | 'INVALID_DATA' | 'UNKNOWN';
/**
 * Storage error class
 */
declare class StorageError extends Error {
    readonly code: StorageErrorCode;
    constructor(message: string, code: StorageErrorCode);
}
/**
 * Storage adapter configuration
 */
interface StorageAdapterConfig {
    /** Prefix for all storage keys */
    prefix?: string;
    /** Maximum storage quota in bytes (if supported) */
    maxQuota?: number;
    /** Enable compression for large values */
    compression?: boolean;
}

/**
 * Network adapter interface
 * Platform-agnostic network abstraction for HTTP requests,
 * file downloads, caching, and connection status
 */
/**
 * HTTP request options
 */
interface RequestOptions {
    /** Request headers */
    headers?: Record<string, string>;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Abort signal for request cancellation */
    signal?: AbortSignal;
    /** Enable/disable credentials (cookies) */
    credentials?: 'include' | 'omit' | 'same-origin';
    /** Response type */
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}
/**
 * HTTP response wrapper
 */
interface HttpResponse<T> {
    /** Response data */
    data: T;
    /** HTTP status code */
    status: number;
    /** Response headers */
    headers: Record<string, string>;
    /** Whether the request was successful (2xx status) */
    ok: boolean;
}
/**
 * Download progress information
 */
interface DownloadProgress {
    /** Bytes loaded */
    loaded: number;
    /** Total bytes (if known) */
    total: number | null;
    /** Progress percentage (0-100) */
    percent: number;
}
/**
 * Cache entry metadata
 */
interface CacheEntry<T> {
    /** Cached data */
    data: T;
    /** When the entry was cached (timestamp) */
    cachedAt: number;
    /** Time-to-live in milliseconds */
    ttl: number;
}
/**
 * Network adapter interface
 */
interface INetworkAdapter {
    /**
     * Perform a GET request
     * @param url - Request URL
     * @param options - Request options
     */
    get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Perform a POST request
     * @param url - Request URL
     * @param data - Request body
     * @param options - Request options
     */
    post<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Perform a PUT request
     * @param url - Request URL
     * @param data - Request body
     * @param options - Request options
     */
    put<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Perform a PATCH request
     * @param url - Request URL
     * @param data - Request body
     * @param options - Request options
     */
    patch<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Perform a DELETE request
     * @param url - Request URL
     * @param options - Request options
     */
    delete<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    /**
     * Download a file as Blob
     * @param url - File URL
     * @param onProgress - Progress callback
     */
    downloadFile(url: string, onProgress?: (progress: DownloadProgress) => void): Promise<Blob>;
    /**
     * Download and parse JSON
     * @param url - JSON URL
     * @param onProgress - Progress callback
     */
    downloadJson<T>(url: string, onProgress?: (progress: DownloadProgress) => void): Promise<T>;
    /**
     * Get cached data if still valid
     * @param url - Cache key (usually the URL)
     * @param maxAge - Maximum age in milliseconds
     */
    getCached<T>(url: string, maxAge?: number): Promise<T | null>;
    /**
     * Store data in cache
     * @param url - Cache key
     * @param data - Data to cache
     * @param ttl - Time-to-live in milliseconds
     */
    setCached<T>(url: string, data: T, ttl?: number): Promise<void>;
    /**
     * Invalidate cached data
     * @param url - Cache key to invalidate
     */
    invalidateCache(url: string): Promise<void>;
    /**
     * Clear all cached data
     */
    clearCache(): Promise<void>;
    /**
     * Check if currently online
     */
    isOnline(): Promise<boolean>;
    /**
     * Subscribe to connection status changes
     * @param callback - Called when connection status changes
     * @returns Cleanup function
     */
    onConnectionChange(callback: (online: boolean) => void): () => void;
}
/**
 * Network error codes
 */
type NetworkErrorCode = 'TIMEOUT' | 'OFFLINE' | 'ABORTED' | 'NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'PARSE_ERROR' | 'UNKNOWN';
/**
 * Network error class
 */
declare class NetworkError extends Error {
    readonly code: NetworkErrorCode;
    readonly status?: number | undefined;
    readonly response?: unknown;
    constructor(message: string, code: NetworkErrorCode, status?: number | undefined, response?: unknown);
}
/**
 * Network adapter configuration
 */
interface NetworkAdapterConfig {
    /** Base URL for all requests */
    baseUrl?: string;
    /** Default timeout in milliseconds */
    timeout?: number;
    /** Default headers for all requests */
    headers?: Record<string, string>;
    /** Enable request/response logging */
    debug?: boolean;
    /** Retry configuration */
    retry?: {
        /** Maximum retry attempts */
        maxAttempts: number;
        /** Delay between retries in milliseconds */
        delay: number;
        /** Multiply delay by this factor for each retry */
        backoffFactor?: number;
    };
}

/**
 * Audio adapter interface
 * Platform-agnostic audio playback abstraction
 */
/**
 * Audio playback state
 */
type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';
/**
 * Audio playback options
 */
interface AudioOptions {
    /** Initial volume (0-1) */
    volume?: number;
    /** Playback rate (0.5-2.0 typically) */
    playbackRate?: number;
    /** Start position in seconds */
    startTime?: number;
    /** Whether to loop playback */
    loop?: boolean;
    /** Preload strategy */
    preload?: 'none' | 'metadata' | 'auto';
}
/**
 * Audio handle returned by play()
 * Used to control an active audio instance
 */
interface IAudioHandle {
    /** Unique identifier for this playback instance */
    id: string;
    /** Source URL */
    url: string;
    /** Current playback state */
    state: AudioState;
}
/**
 * Audio playback event data
 */
interface AudioEvent {
    /** Event type */
    type: 'statechange' | 'timeupdate' | 'ended' | 'error' | 'loaded';
    /** Audio handle */
    handle: IAudioHandle;
    /** Current playback time in seconds */
    currentTime?: number;
    /** Total duration in seconds */
    duration?: number;
    /** Error message (if type is 'error') */
    error?: string;
}
/**
 * Audio event callback
 */
type AudioEventCallback = (event: AudioEvent) => void;
/**
 * Audio metadata
 */
interface AudioMetadata {
    /** Duration in seconds */
    duration: number;
    /** Sample rate in Hz */
    sampleRate?: number;
    /** Number of audio channels */
    channels?: number;
    /** File format */
    format?: string;
}
/**
 * Audio adapter interface
 */
interface IAudioAdapter {
    /**
     * Start playing audio from a URL
     * @param url - Audio source URL
     * @param options - Playback options
     * @returns Audio handle for controlling playback
     */
    play(url: string, options?: AudioOptions): Promise<IAudioHandle>;
    /**
     * Pause playback
     * @param handle - Audio handle from play()
     */
    pause(handle: IAudioHandle): Promise<void>;
    /**
     * Resume paused playback
     * @param handle - Audio handle from play()
     */
    resume(handle: IAudioHandle): Promise<void>;
    /**
     * Stop playback and release resources
     * @param handle - Audio handle from play()
     */
    stop(handle: IAudioHandle): Promise<void>;
    /**
     * Get current playback position
     * @param handle - Audio handle
     * @returns Current time in seconds
     */
    getCurrentTime(handle: IAudioHandle): Promise<number>;
    /**
     * Seek to a position
     * @param handle - Audio handle
     * @param time - Position in seconds
     */
    setCurrentTime(handle: IAudioHandle, time: number): Promise<void>;
    /**
     * Get audio duration
     * @param handle - Audio handle or URL
     * @returns Duration in seconds
     */
    getDuration(handle: IAudioHandle | string): Promise<number>;
    /**
     * Get current volume
     * @param handle - Audio handle
     * @returns Volume (0-1)
     */
    getVolume(handle: IAudioHandle): Promise<number>;
    /**
     * Set volume
     * @param handle - Audio handle
     * @param volume - Volume (0-1)
     */
    setVolume(handle: IAudioHandle, volume: number): Promise<void>;
    /**
     * Mute audio
     * @param handle - Audio handle
     */
    mute(handle: IAudioHandle): Promise<void>;
    /**
     * Unmute audio
     * @param handle - Audio handle
     */
    unmute(handle: IAudioHandle): Promise<void>;
    /**
     * Get current playback rate
     * @param handle - Audio handle
     * @returns Playback rate (1.0 = normal)
     */
    getPlaybackRate(handle: IAudioHandle): Promise<number>;
    /**
     * Set playback rate
     * @param handle - Audio handle
     * @param rate - Playback rate (0.5-2.0 typically)
     */
    setPlaybackRate(handle: IAudioHandle, rate: number): Promise<void>;
    /**
     * Get audio metadata
     * @param url - Audio URL
     */
    getMetadata(url: string): Promise<AudioMetadata>;
    /**
     * Preload audio for faster playback
     * @param url - Audio URL
     */
    preload(url: string): Promise<void>;
    /**
     * Cancel preloading
     * @param url - Audio URL
     */
    cancelPreload(url: string): Promise<void>;
    /**
     * Subscribe to playback events
     * @param handle - Audio handle
     * @param callback - Event callback
     * @returns Cleanup function
     */
    onPlaybackChange(handle: IAudioHandle, callback: AudioEventCallback): () => void;
    /**
     * Stop all playback and release all resources
     */
    dispose(): Promise<void>;
}
/**
 * Audio error codes
 */
type AudioErrorCode = 'NOT_SUPPORTED' | 'NETWORK_ERROR' | 'DECODE_ERROR' | 'PERMISSION_DENIED' | 'NOT_FOUND' | 'ABORTED' | 'UNKNOWN';
/**
 * Audio error class
 */
declare class AudioError extends Error {
    readonly code: AudioErrorCode;
    constructor(message: string, code: AudioErrorCode);
}
/**
 * Audio adapter configuration
 */
interface AudioAdapterConfig {
    /** Default volume (0-1) */
    defaultVolume?: number;
    /** Default playback rate */
    defaultPlaybackRate?: number;
    /** Enable audio buffering */
    buffering?: boolean;
    /** Buffer size in seconds */
    bufferSize?: number;
}

/**
 * Platform adapter interface
 * Platform-agnostic abstraction for platform-specific features
 * like file system, clipboard, notifications, and window management
 */
/**
 * Platform types
 */
type Platform = 'web' | 'electron' | 'server' | 'mobile' | 'unknown';
/**
 * Platform information
 */
interface PlatformInfo {
    /** Platform type */
    platform: Platform;
    /** Platform version (e.g., browser version, OS version) */
    version: string;
    /** User agent string (if available) */
    userAgent?: string;
    /** Operating system */
    os?: 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'unknown';
    /** Device type */
    deviceType?: 'desktop' | 'tablet' | 'mobile' | 'unknown';
    /** Is touch device */
    isTouch?: boolean;
    /** Is in standalone mode (PWA) */
    isStandalone?: boolean;
}
/**
 * File picker options
 */
interface FilePickerOptions {
    /** Accepted file types (MIME types or extensions) */
    accept?: string[];
    /** Allow multiple file selection */
    multiple?: boolean;
    /** Starting directory (if supported) */
    startIn?: string;
}
/**
 * Selected file information
 */
interface SelectedFile {
    /** File name */
    name: string;
    /** File size in bytes */
    size: number;
    /** MIME type */
    type: string;
    /** File path (if available, e.g., in Electron) */
    path?: string;
    /** Read file contents as text */
    text(): Promise<string>;
    /** Read file contents as ArrayBuffer */
    arrayBuffer(): Promise<ArrayBuffer>;
}
/**
 * Notification options
 */
interface NotificationOptions {
    /** Notification body text */
    body?: string;
    /** Icon URL */
    icon?: string;
    /** Badge URL */
    badge?: string;
    /** Tag for grouping notifications */
    tag?: string;
    /** Auto-close after milliseconds */
    timeout?: number;
    /** Require user interaction to dismiss */
    requireInteraction?: boolean;
    /** Additional data */
    data?: unknown;
}
/**
 * Notification click event
 */
interface NotificationClickEvent {
    /** Notification tag */
    tag?: string;
    /** Additional data */
    data?: unknown;
}
/**
 * Platform capabilities
 */
interface PlatformCapabilities {
    /** Can access file system */
    fileSystem: boolean;
    /** Can show notifications */
    notifications: boolean;
    /** Can access clipboard */
    clipboard: boolean;
    /** Can share content */
    share: boolean;
    /** Can use native file picker */
    filePicker: boolean;
    /** Has window management */
    windowManagement: boolean;
    /** Supports deep linking */
    deepLinking: boolean;
    /** Has persistent storage */
    persistentStorage: boolean;
}
/**
 * Platform adapter interface
 */
interface IPlatformAdapter {
    /**
     * Get current platform type
     */
    getPlatform(): Platform;
    /**
     * Get detailed platform information
     */
    getPlatformInfo(): PlatformInfo;
    /**
     * Get platform version
     */
    getVersion(): string;
    /**
     * Get platform capabilities
     */
    getCapabilities(): PlatformCapabilities;
    /**
     * Read file contents
     * @param path - File path
     * @returns File contents as Uint8Array
     */
    readFile?(path: string): Promise<Uint8Array>;
    /**
     * Read file as text
     * @param path - File path
     * @returns File contents as string
     */
    readTextFile?(path: string): Promise<string>;
    /**
     * Write file contents
     * @param path - File path
     * @param data - Data to write
     */
    writeFile?(path: string, data: Uint8Array): Promise<void>;
    /**
     * Write text file
     * @param path - File path
     * @param text - Text to write
     */
    writeTextFile?(path: string, text: string): Promise<void>;
    /**
     * Check if file exists
     * @param path - File path
     */
    fileExists?(path: string): Promise<boolean>;
    /**
     * Delete file
     * @param path - File path
     */
    deleteFile?(path: string): Promise<void>;
    /**
     * Show file picker dialog
     * @param options - Picker options
     * @returns Selected file or null
     */
    selectFile?(options?: FilePickerOptions): Promise<SelectedFile | null>;
    /**
     * Show multiple file picker dialog
     * @param options - Picker options
     * @returns Selected files
     */
    selectFiles?(options?: FilePickerOptions): Promise<SelectedFile[]>;
    /**
     * Show folder picker dialog
     * @returns Selected folder path or null
     */
    selectFolder?(): Promise<string | null>;
    /**
     * Copy text to clipboard
     * @param text - Text to copy
     */
    copyToClipboard(text: string): Promise<void>;
    /**
     * Read text from clipboard
     * @returns Clipboard text or null
     */
    readFromClipboard(): Promise<string | null>;
    /**
     * Share content using native share dialog
     * @param data - Share data
     */
    share?(data: {
        title?: string;
        text?: string;
        url?: string;
    }): Promise<void>;
    /**
     * Check if sharing is supported
     */
    canShare?(): boolean;
    /**
     * Request notification permission
     */
    requestNotificationPermission?(): Promise<'granted' | 'denied' | 'default'>;
    /**
     * Show a notification
     * @param title - Notification title
     * @param options - Notification options
     */
    showNotification?(title: string, options?: NotificationOptions): Promise<void>;
    /**
     * Subscribe to notification clicks
     * @param callback - Click handler
     * @returns Cleanup function
     */
    onNotificationClick?(callback: (event: NotificationClickEvent) => void): () => void;
    /**
     * Set window title
     * @param title - Window title
     */
    setWindowTitle?(title: string): Promise<void>;
    /**
     * Minimize window
     */
    minimizeWindow?(): Promise<void>;
    /**
     * Maximize window
     */
    maximizeWindow?(): Promise<void>;
    /**
     * Restore window from minimized/maximized state
     */
    restoreWindow?(): Promise<void>;
    /**
     * Close window
     */
    closeWindow?(): Promise<void>;
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen?(): Promise<void>;
    /**
     * Check if window is maximized
     */
    isMaximized?(): Promise<boolean>;
    /**
     * Check if window is fullscreen
     */
    isFullscreen?(): Promise<boolean>;
    /**
     * Register deep link handler
     * @param callback - Called when app is opened via deep link
     * @returns Cleanup function
     */
    registerDeepLinkHandler?(callback: (url: string) => void): () => void;
    /**
     * Get app data directory path (desktop apps)
     */
    getAppDataPath?(): string;
    /**
     * Get user documents directory path
     */
    getUserDocumentsPath?(): string;
    /**
     * Open URL in default browser
     * @param url - URL to open
     */
    openExternalUrl?(url: string): Promise<void>;
    /**
     * Get locale/language preference
     */
    getLocale(): string;
    /**
     * Get preferred color scheme
     */
    getColorScheme(): 'light' | 'dark' | 'system';
    /**
     * Subscribe to color scheme changes
     * @param callback - Called when color scheme changes
     * @returns Cleanup function
     */
    onColorSchemeChange?(callback: (scheme: 'light' | 'dark') => void): () => void;
}
/**
 * Platform error codes
 */
type PlatformErrorCode = 'NOT_SUPPORTED' | 'PERMISSION_DENIED' | 'NOT_FOUND' | 'INVALID_PATH' | 'UNKNOWN';
/**
 * Platform error class
 */
declare class PlatformError extends Error {
    readonly code: PlatformErrorCode;
    constructor(message: string, code: PlatformErrorCode);
}

export { type AudioAdapterConfig, AudioError, type AudioErrorCode, type AudioEvent, type AudioEventCallback, type AudioMetadata, type AudioOptions, type AudioState, type CacheEntry, type DownloadProgress, type FilePickerOptions, type HttpResponse, type IAudioAdapter, type IAudioHandle, type INetworkAdapter, type IPlatformAdapter, type IStorageAdapter, type ISyncStorageAdapter, type NetworkAdapterConfig, NetworkError, type NetworkErrorCode, type NotificationClickEvent, type NotificationOptions, type Platform, type PlatformCapabilities, PlatformError, type PlatformErrorCode, type PlatformInfo, type RequestOptions, type SelectedFile, type StorageAdapterConfig, type StorageChangeEvent, StorageError, type StorageErrorCode };
