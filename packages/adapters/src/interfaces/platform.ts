/**
 * Platform adapter interface
 * Platform-agnostic abstraction for platform-specific features
 * like file system, clipboard, notifications, and window management
 */

/**
 * Platform types
 */
export type Platform = 'web' | 'electron' | 'server' | 'mobile' | 'unknown'

/**
 * Platform information
 */
export interface PlatformInfo {
  /** Platform type */
  platform: Platform
  /** Platform version (e.g., browser version, OS version) */
  version: string
  /** User agent string (if available) */
  userAgent?: string
  /** Operating system */
  os?: 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'unknown'
  /** Device type */
  deviceType?: 'desktop' | 'tablet' | 'mobile' | 'unknown'
  /** Is touch device */
  isTouch?: boolean
  /** Is in standalone mode (PWA) */
  isStandalone?: boolean
}

/**
 * File picker options
 */
export interface FilePickerOptions {
  /** Accepted file types (MIME types or extensions) */
  accept?: string[]
  /** Allow multiple file selection */
  multiple?: boolean
  /** Starting directory (if supported) */
  startIn?: string
}

/**
 * Selected file information
 */
export interface SelectedFile {
  /** File name */
  name: string
  /** File size in bytes */
  size: number
  /** MIME type */
  type: string
  /** File path (if available, e.g., in Electron) */
  path?: string
  /** Read file contents as text */
  text(): Promise<string>
  /** Read file contents as ArrayBuffer */
  arrayBuffer(): Promise<ArrayBuffer>
}

/**
 * Notification options
 */
export interface NotificationOptions {
  /** Notification body text */
  body?: string
  /** Icon URL */
  icon?: string
  /** Badge URL */
  badge?: string
  /** Tag for grouping notifications */
  tag?: string
  /** Auto-close after milliseconds */
  timeout?: number
  /** Require user interaction to dismiss */
  requireInteraction?: boolean
  /** Additional data */
  data?: unknown
}

/**
 * Notification click event
 */
export interface NotificationClickEvent {
  /** Notification tag */
  tag?: string
  /** Additional data */
  data?: unknown
}

/**
 * Platform capabilities
 */
export interface PlatformCapabilities {
  /** Can access file system */
  fileSystem: boolean
  /** Can show notifications */
  notifications: boolean
  /** Can access clipboard */
  clipboard: boolean
  /** Can share content */
  share: boolean
  /** Can use native file picker */
  filePicker: boolean
  /** Has window management */
  windowManagement: boolean
  /** Supports deep linking */
  deepLinking: boolean
  /** Has persistent storage */
  persistentStorage: boolean
}

/**
 * Platform adapter interface
 */
export interface IPlatformAdapter {
  // Platform detection
  /**
   * Get current platform type
   */
  getPlatform(): Platform

  /**
   * Get detailed platform information
   */
  getPlatformInfo(): PlatformInfo

  /**
   * Get platform version
   */
  getVersion(): string

  /**
   * Get platform capabilities
   */
  getCapabilities(): PlatformCapabilities

  // File system operations (if available)
  /**
   * Read file contents
   * @param path - File path
   * @returns File contents as Uint8Array
   */
  readFile?(path: string): Promise<Uint8Array>

  /**
   * Read file as text
   * @param path - File path
   * @returns File contents as string
   */
  readTextFile?(path: string): Promise<string>

  /**
   * Write file contents
   * @param path - File path
   * @param data - Data to write
   */
  writeFile?(path: string, data: Uint8Array): Promise<void>

  /**
   * Write text file
   * @param path - File path
   * @param text - Text to write
   */
  writeTextFile?(path: string, text: string): Promise<void>

  /**
   * Check if file exists
   * @param path - File path
   */
  fileExists?(path: string): Promise<boolean>

  /**
   * Delete file
   * @param path - File path
   */
  deleteFile?(path: string): Promise<void>

  // File picker
  /**
   * Show file picker dialog
   * @param options - Picker options
   * @returns Selected file or null
   */
  selectFile?(options?: FilePickerOptions): Promise<SelectedFile | null>

  /**
   * Show multiple file picker dialog
   * @param options - Picker options
   * @returns Selected files
   */
  selectFiles?(options?: FilePickerOptions): Promise<SelectedFile[]>

  /**
   * Show folder picker dialog
   * @returns Selected folder path or null
   */
  selectFolder?(): Promise<string | null>

  // Clipboard
  /**
   * Copy text to clipboard
   * @param text - Text to copy
   */
  copyToClipboard(text: string): Promise<void>

  /**
   * Read text from clipboard
   * @returns Clipboard text or null
   */
  readFromClipboard(): Promise<string | null>

  // Share
  /**
   * Share content using native share dialog
   * @param data - Share data
   */
  share?(data: { title?: string; text?: string; url?: string }): Promise<void>

  /**
   * Check if sharing is supported
   */
  canShare?(): boolean

  // Notifications
  /**
   * Request notification permission
   */
  requestNotificationPermission?(): Promise<'granted' | 'denied' | 'default'>

  /**
   * Show a notification
   * @param title - Notification title
   * @param options - Notification options
   */
  showNotification?(title: string, options?: NotificationOptions): Promise<void>

  /**
   * Subscribe to notification clicks
   * @param callback - Click handler
   * @returns Cleanup function
   */
  onNotificationClick?(callback: (event: NotificationClickEvent) => void): () => void

  // Window management (desktop apps)
  /**
   * Set window title
   * @param title - Window title
   */
  setWindowTitle?(title: string): Promise<void>

  /**
   * Minimize window
   */
  minimizeWindow?(): Promise<void>

  /**
   * Maximize window
   */
  maximizeWindow?(): Promise<void>

  /**
   * Restore window from minimized/maximized state
   */
  restoreWindow?(): Promise<void>

  /**
   * Close window
   */
  closeWindow?(): Promise<void>

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen?(): Promise<void>

  /**
   * Check if window is maximized
   */
  isMaximized?(): Promise<boolean>

  /**
   * Check if window is fullscreen
   */
  isFullscreen?(): Promise<boolean>

  // Deep linking
  /**
   * Register deep link handler
   * @param callback - Called when app is opened via deep link
   * @returns Cleanup function
   */
  registerDeepLinkHandler?(callback: (url: string) => void): () => void

  // Storage
  /**
   * Get app data directory path (desktop apps)
   */
  getAppDataPath?(): string

  /**
   * Get user documents directory path
   */
  getUserDocumentsPath?(): string

  // System
  /**
   * Open URL in default browser
   * @param url - URL to open
   */
  openExternalUrl?(url: string): Promise<void>

  /**
   * Get locale/language preference
   */
  getLocale(): string

  /**
   * Get preferred color scheme
   */
  getColorScheme(): 'light' | 'dark' | 'system'

  /**
   * Subscribe to color scheme changes
   * @param callback - Called when color scheme changes
   * @returns Cleanup function
   */
  onColorSchemeChange?(callback: (scheme: 'light' | 'dark') => void): () => void
}

/**
 * Platform error codes
 */
export type PlatformErrorCode =
  | 'NOT_SUPPORTED'
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'INVALID_PATH'
  | 'UNKNOWN'

/**
 * Platform error class
 */
export class PlatformError extends Error {
  constructor(
    message: string,
    public readonly code: PlatformErrorCode
  ) {
    super(message)
    this.name = 'PlatformError'
  }
}
