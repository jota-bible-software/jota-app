import { IStorageAdapter, StorageAdapterConfig, StorageChangeEvent, INetworkAdapter, RequestOptions, HttpResponse, DownloadProgress, IAudioAdapter, AudioAdapterConfig, AudioOptions, IAudioHandle, AudioMetadata, AudioEventCallback, IPlatformAdapter, NotificationClickEvent, NotificationOptions, Platform, PlatformInfo, PlatformCapabilities, FilePickerOptions, SelectedFile } from '../interfaces/index.js';

/**
 * In-memory storage adapter
 * Implements full IStorageAdapter for testing and SSR
 */

interface CollectionStore {
    [id: string]: unknown;
}
/**
 * In-memory implementation of IStorageAdapter
 * Useful for testing and server-side rendering
 */
declare class MemoryStorageAdapter implements IStorageAdapter {
    private storage;
    private collections;
    private listeners;
    private prefix;
    constructor(config?: StorageAdapterConfig);
    private getKey;
    private getCollectionKey;
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
    /**
     * Get approximate size of stored data in bytes
     */
    size(): number;
    /**
     * Dump all data for debugging
     */
    dump(): {
        storage: Record<string, unknown>;
        collections: Record<string, CollectionStore>;
    };
}
/**
 * Create an in-memory storage adapter
 * @param config - Adapter configuration
 */
declare function createMemoryStorage(config?: StorageAdapterConfig): IStorageAdapter;

/**
 * Mock network adapter
 * For testing and offline scenarios
 */

/**
 * Mock response handler
 */
type MockHandler<T = unknown> = (url: string, options?: RequestOptions & {
    body?: unknown;
}) => Promise<T> | T;
/**
 * Route definition
 */
interface MockRoute {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | '*';
    pattern: string | RegExp;
    handler: MockHandler;
    delay?: number;
}
/**
 * Mock network adapter for testing
 */
declare class MockNetworkAdapter implements INetworkAdapter {
    private routes;
    private cache;
    private isOnlineState;
    private connectionListeners;
    private defaultDelay;
    constructor(options?: {
        delay?: number;
    });
    /**
     * Register a mock route
     */
    mock<T>(method: MockRoute['method'], pattern: string | RegExp, handler: MockHandler<T>, delay?: number): this;
    /**
     * Shorthand for GET routes
     */
    onGet<T>(pattern: string | RegExp, handler: MockHandler<T>, delay?: number): this;
    /**
     * Shorthand for POST routes
     */
    onPost<T>(pattern: string | RegExp, handler: MockHandler<T>, delay?: number): this;
    /**
     * Shorthand for any method
     */
    onAny<T>(pattern: string | RegExp, handler: MockHandler<T>, delay?: number): this;
    /**
     * Clear all mock routes
     */
    clearMocks(): void;
    /**
     * Set online state
     */
    setOnline(online: boolean): void;
    private matchRoute;
    private executeRequest;
    get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    post<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
    put<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
    patch<T>(url: string, data: unknown, options?: RequestOptions): Promise<HttpResponse<T>>;
    delete<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>;
    downloadFile(url: string, onProgress?: (progress: DownloadProgress) => void): Promise<Blob>;
    downloadJson<T>(url: string, onProgress?: (progress: DownloadProgress) => void): Promise<T>;
    getCached<T>(url: string, maxAge?: number): Promise<T | null>;
    setCached<T>(url: string, data: T, ttl?: number): Promise<void>;
    invalidateCache(url: string): Promise<void>;
    clearCache(): Promise<void>;
    isOnline(): Promise<boolean>;
    onConnectionChange(callback: (online: boolean) => void): () => void;
}
/**
 * Create a mock network adapter
 */
declare function createMockNetwork(options?: {
    delay?: number;
}): MockNetworkAdapter;

/**
 * Mock audio adapter
 * For testing audio functionality
 */

/**
 * Mock audio adapter for testing
 */
declare class MockAudioAdapter implements IAudioAdapter {
    private instances;
    private preloadedUrls;
    private config;
    private mockDurations;
    constructor(config?: AudioAdapterConfig);
    /**
     * Set mock duration for a URL
     */
    setMockDuration(url: string, duration: number): void;
    private notifyListeners;
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
    /**
     * Check if a URL was preloaded (for testing)
     */
    isPreloaded(url: string): boolean;
    onPlaybackChange(handle: IAudioHandle, callback: AudioEventCallback): () => void;
    dispose(): Promise<void>;
    /**
     * Get all active instances (for testing)
     */
    getActiveInstances(): IAudioHandle[];
    /**
     * Simulate end of playback (for testing)
     */
    simulateEnd(handle: IAudioHandle): void;
    /**
     * Simulate error (for testing)
     */
    simulateError(handle: IAudioHandle, message: string): void;
}
/**
 * Create a mock audio adapter
 */
declare function createMockAudio(config?: AudioAdapterConfig): MockAudioAdapter;

/**
 * Mock platform adapter
 * For testing platform functionality
 */

/**
 * Mock platform adapter for testing
 */
declare class MockPlatformAdapter implements IPlatformAdapter {
    private clipboardContent;
    private colorScheme;
    private colorSchemeListeners;
    private notificationClickListeners;
    private deepLinkListeners;
    private windowTitle;
    private locale;
    private notifications;
    private mockFiles;
    /**
     * Set mock files for file picker
     */
    setMockFiles(files: Array<{
        name: string;
        content: string;
        type?: string;
    }>): void;
    /**
     * Set mock locale
     */
    setMockLocale(locale: string): void;
    /**
     * Set mock color scheme
     */
    setMockColorScheme(scheme: 'light' | 'dark'): void;
    /**
     * Simulate deep link
     */
    simulateDeepLink(url: string): void;
    /**
     * Simulate notification click
     */
    simulateNotificationClick(event: NotificationClickEvent): void;
    /**
     * Get shown notifications (for testing)
     */
    getNotifications(): Array<{
        title: string;
        options?: NotificationOptions;
    }>;
    /**
     * Get window title (for testing)
     */
    getWindowTitle(): string;
    getPlatform(): Platform;
    getPlatformInfo(): PlatformInfo;
    getVersion(): string;
    getCapabilities(): PlatformCapabilities;
    copyToClipboard(text: string): Promise<void>;
    readFromClipboard(): Promise<string | null>;
    selectFile(options?: FilePickerOptions): Promise<SelectedFile | null>;
    selectFiles(options?: FilePickerOptions): Promise<SelectedFile[]>;
    private filterFiles;
    selectFolder(): Promise<string | null>;
    canShare(): boolean;
    share(_data: {
        title?: string;
        text?: string;
        url?: string;
    }): Promise<void>;
    requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'>;
    showNotification(title: string, options?: NotificationOptions): Promise<void>;
    onNotificationClick(callback: (event: NotificationClickEvent) => void): () => void;
    setWindowTitle(title: string): Promise<void>;
    minimizeWindow(): Promise<void>;
    maximizeWindow(): Promise<void>;
    restoreWindow(): Promise<void>;
    closeWindow(): Promise<void>;
    toggleFullscreen(): Promise<void>;
    isMaximized(): Promise<boolean>;
    isFullscreen(): Promise<boolean>;
    registerDeepLinkHandler(callback: (url: string) => void): () => void;
    openExternalUrl(_url: string): Promise<void>;
    getLocale(): string;
    getColorScheme(): 'light' | 'dark' | 'system';
    onColorSchemeChange(callback: (scheme: 'light' | 'dark') => void): () => void;
    /**
     * Reset mock state
     */
    reset(): void;
}
/**
 * Create a mock platform adapter
 */
declare function createMockPlatform(): MockPlatformAdapter;

export { MemoryStorageAdapter, MockAudioAdapter, type MockHandler, MockNetworkAdapter, MockPlatformAdapter, createMemoryStorage, createMockAudio, createMockNetwork, createMockPlatform };
