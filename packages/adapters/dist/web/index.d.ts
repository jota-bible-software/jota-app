import { S as StorageAdapter } from '../storage-interface-qZlwxSJw.js';
import { IStorageAdapter, StorageAdapterConfig, StorageChangeEvent, INetworkAdapter, NetworkAdapterConfig, RequestOptions, HttpResponse as HttpResponse$1, DownloadProgress, IAudioAdapter, AudioAdapterConfig, AudioOptions, IAudioHandle, AudioMetadata, AudioEventCallback, IPlatformAdapter, Platform, PlatformInfo, PlatformCapabilities, FilePickerOptions, SelectedFile, NotificationOptions, NotificationClickEvent } from '../interfaces/index.js';
import { TranslationFile } from '@jota/core';

/**
 * localStorage adapter for web browsers
 */

/**
 * Check if an error is a QuotaExceededError
 */
declare function isQuotaExceededError(error: unknown): boolean;
/**
 * localStorage implementation of StorageAdapter
 */
declare class LocalStorageAdapter implements StorageAdapter {
    private prefix;
    constructor(prefix?: string);
    private getKey;
    get<T>(key: string): T | null;
    set<T>(key: string, value: T): void;
    remove(key: string): void;
    has(key: string): boolean;
    clear(): void;
    keys(): string[];
    /**
     * Get approximate localStorage usage in bytes
     */
    getSize(): number;
    /**
     * Get localStorage usage as a percentage (assumes 5MB limit)
     */
    getUsagePercent(): number;
}
/**
 * Create a new localStorage adapter
 * @param prefix - Optional prefix for all keys
 */
declare function createLocalStorage(prefix?: string): StorageAdapter;

/**
 * IndexedDB storage adapter
 * Supports large data storage with structured collections
 */

/**
 * IndexedDB-based storage adapter
 * Provides async storage for large datasets with structured collections
 */
declare class IndexedDBAdapter implements IStorageAdapter {
    private db;
    private dbName;
    private prefix;
    private listeners;
    private initPromise;
    constructor(config?: StorageAdapterConfig & {
        dbName?: string;
    });
    private init;
    private getKey;
    private notifyChange;
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    keys(): Promise<string[]>;
    getStructured<T>(collection: string, id: string): Promise<T | null>;
    setStructured<T>(collection: string, id: string, value: T): Promise<void>;
    deleteStructured(collection: string, id?: string): Promise<void>;
    listStructured(collection: string): Promise<string[]>;
    getBatch<T>(keys: string[]): Promise<Record<string, T | null>>;
    setBatch(data: Record<string, unknown>): Promise<void>;
    onChanged<T>(callback: (event: StorageChangeEvent<T>) => void): () => void;
    close(): Promise<void>;
    /**
     * Get storage usage estimate (if supported)
     */
    getStorageEstimate(): Promise<{
        usage: number;
        quota: number;
    } | null>;
}
/**
 * Create an IndexedDB storage adapter
 * @param config - Adapter configuration
 */
declare function createIndexedDBStorage(config?: StorageAdapterConfig & {
    dbName?: string;
}): IStorageAdapter;

/**
 * Web network adapter
 * Fetch-based HTTP client with caching support
 */

/**
 * Web-based network adapter using fetch API
 */
declare class WebNetworkAdapter implements INetworkAdapter {
    private config;
    private cache;
    private onlineListeners;
    private boundOnlineHandler;
    private boundOfflineHandler;
    constructor(config?: NetworkAdapterConfig);
    private notifyConnectionChange;
    private buildUrl;
    private buildHeaders;
    private parseResponseHeaders;
    private request;
    get<T>(url: string, options?: RequestOptions): Promise<HttpResponse$1<T>>;
    post<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse$1<T>>;
    put<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse$1<T>>;
    patch<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse$1<T>>;
    delete<T>(url: string, options?: RequestOptions): Promise<HttpResponse$1<T>>;
    downloadFile(url: string, onProgress?: (progress: DownloadProgress) => void): Promise<Blob>;
    downloadJson<T>(url: string, onProgress?: (progress: DownloadProgress) => void): Promise<T>;
    getCached<T>(url: string, maxAge?: number): Promise<T | null>;
    setCached<T>(url: string, data: T, ttl?: number): Promise<void>;
    invalidateCache(url: string): Promise<void>;
    clearCache(): Promise<void>;
    isOnline(): Promise<boolean>;
    onConnectionChange(callback: (online: boolean) => void): () => void;
    dispose(): void;
}
/**
 * Create a web network adapter
 * @param config - Adapter configuration
 */
declare function createWebNetwork(config?: NetworkAdapterConfig): INetworkAdapter;

/**
 * Web Audio adapter
 * HTML5 Audio-based playback with Web Audio API enhancements
 */

/**
 * Web Audio adapter using HTML5 Audio element
 */
declare class WebAudioAdapter implements IAudioAdapter {
    private instances;
    private preloadedAudio;
    private config;
    constructor(config?: AudioAdapterConfig);
    private createAudioElement;
    private getState;
    private notifyListeners;
    private setupEventListeners;
    play(url: string, options?: AudioOptions): Promise<IAudioHandle>;
    pause(handle: IAudioHandle): Promise<void>;
    resume(handle: IAudioHandle): Promise<void>;
    stop(handle: IAudioHandle): Promise<void>;
    getCurrentTime(handle: IAudioHandle): Promise<number>;
    setCurrentTime(handle: IAudioHandle, time: number): Promise<void>;
    getDuration(handle: IAudioHandle | string): Promise<number>;
    getVolume(handle: IAudioHandle): Promise<number>;
    setVolume(handle: IAudioHandle, volume: number): Promise<void>;
    mute(handle: IAudioHandle): Promise<void>;
    unmute(handle: IAudioHandle): Promise<void>;
    getPlaybackRate(handle: IAudioHandle): Promise<number>;
    setPlaybackRate(handle: IAudioHandle, rate: number): Promise<void>;
    getMetadata(url: string): Promise<AudioMetadata>;
    preload(url: string): Promise<void>;
    cancelPreload(url: string): Promise<void>;
    onPlaybackChange(handle: IAudioHandle, callback: AudioEventCallback): () => void;
    dispose(): Promise<void>;
}
/**
 * Create a web audio adapter
 * @param config - Adapter configuration
 */
declare function createWebAudio(config?: AudioAdapterConfig): IAudioAdapter;

/**
 * Web Platform adapter
 * Browser-specific platform features
 */

/**
 * Web platform adapter for browser environments
 */
declare class WebPlatformAdapter implements IPlatformAdapter {
    private colorSchemeMediaQuery;
    private colorSchemeListeners;
    private notificationClickListeners;
    constructor();
    getPlatform(): Platform;
    getPlatformInfo(): PlatformInfo;
    getVersion(): string;
    getCapabilities(): PlatformCapabilities;
    copyToClipboard(text: string): Promise<void>;
    private copyTextLegacy;
    readFromClipboard(): Promise<string | null>;
    selectFile(options?: FilePickerOptions): Promise<SelectedFile | null>;
    selectFiles(options?: FilePickerOptions): Promise<SelectedFile[]>;
    private selectFilesInternal;
    selectFolder(): Promise<string | null>;
    canShare(): boolean;
    share(data: {
        title?: string;
        text?: string;
        url?: string;
    }): Promise<void>;
    requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'>;
    showNotification(title: string, options?: NotificationOptions): Promise<void>;
    onNotificationClick(callback: (event: NotificationClickEvent) => void): () => void;
    setWindowTitle(title: string): Promise<void>;
    toggleFullscreen(): Promise<void>;
    isFullscreen(): Promise<boolean>;
    openExternalUrl(url: string): Promise<void>;
    getLocale(): string;
    getColorScheme(): 'light' | 'dark' | 'system';
    onColorSchemeChange(callback: (scheme: 'light' | 'dark') => void): () => void;
    registerDeepLinkHandler(callback: (url: string) => void): () => void;
}
/**
 * Create a web platform adapter
 */
declare function createWebPlatform(): IPlatformAdapter;

/**
 * Clipboard adapter for web browsers
 */
/**
 * Copy text to clipboard using modern API with fallback
 * @param text - Text to copy
 * @returns Promise that resolves when copy is complete
 */
declare function copyToClipboard(text: string): Promise<void>;
/**
 * Read text from clipboard
 * @returns Promise with clipboard text or null if not available
 */
declare function readFromClipboard(): Promise<string | null>;

/**
 * Keyboard event adapter for web browsers
 */
/**
 * Keyboard binding configuration
 */
interface KeyBinding {
    key: string;
    shift?: boolean;
    alt?: boolean;
    ctrl?: boolean;
    meta?: boolean;
}
/**
 * Parse a keyboard binding string like "Ctrl+Shift+K"
 * @param binding - Binding string
 * @returns KeyBinding configuration
 */
declare function parseKeyBinding(binding: string): KeyBinding;
/**
 * Create a keyboard event handler from a binding string
 * @param binding - Binding string like "Ctrl+K"
 * @param callback - Callback to execute on match
 * @returns Event handler function
 */
declare function bindKeyEvent(binding: string, callback: (event: KeyboardEvent) => void): (event: KeyboardEvent) => void;
/**
 * Focus an input element within a container
 * @param ref - Container element
 */
declare function focusInput(ref: HTMLElement | null): void;

/**
 * HTTP adapter for web browsers
 */

/**
 * HTTP request options
 */
interface HttpOptions {
    headers?: Record<string, string>;
    timeout?: number;
}
/**
 * HTTP response wrapper
 */
interface HttpResponse<T> {
    data: T;
    status: number;
    ok: boolean;
}
/**
 * Fetch JSON data from a URL
 * @param url - URL to fetch
 * @param options - Request options
 * @returns Response with parsed JSON
 */
declare function fetchJson<T>(url: string, options?: HttpOptions): Promise<HttpResponse<T>>;
/**
 * Load a Bible translation file
 * @param baseUrl - Base URL for translation files
 * @param locale - Locale code
 * @param symbol - Translation symbol
 * @returns Translation file data
 */
declare function loadTranslation(baseUrl: string, locale: string, symbol: string): Promise<TranslationFile>;
/**
 * Check if the browser is online
 */
declare function isOnline(): boolean;
/**
 * Add online/offline event listeners
 * @param onOnline - Callback when browser goes online
 * @param onOffline - Callback when browser goes offline
 * @returns Cleanup function
 */
declare function onConnectivityChange(onOnline: () => void, onOffline: () => void): () => void;

export { type HttpOptions, type HttpResponse, IndexedDBAdapter, type KeyBinding, LocalStorageAdapter, WebAudioAdapter, WebNetworkAdapter, WebPlatformAdapter, bindKeyEvent, copyToClipboard, createIndexedDBStorage, createLocalStorage, createWebAudio, createWebNetwork, createWebPlatform, fetchJson, focusInput, isOnline, isQuotaExceededError, loadTranslation, onConnectivityChange, parseKeyBinding, readFromClipboard };
