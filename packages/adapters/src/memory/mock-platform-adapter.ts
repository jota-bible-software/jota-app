/**
 * Mock platform adapter
 * For testing platform functionality
 */

import type {
  IPlatformAdapter,
  Platform,
  PlatformInfo,
  PlatformCapabilities,
  FilePickerOptions,
  SelectedFile,
  NotificationOptions,
  NotificationClickEvent,
} from '../interfaces/platform'

/**
 * Mock file for testing
 */
function createMockFile(name: string, content: string, type: string = 'text/plain'): SelectedFile {
  return {
    name,
    size: content.length,
    type,
    text: async () => content,
    arrayBuffer: async () => new TextEncoder().encode(content).buffer,
  }
}

/**
 * Mock platform adapter for testing
 */
export class MockPlatformAdapter implements IPlatformAdapter {
  private clipboardContent: string = ''
  private colorScheme: 'light' | 'dark' = 'light'
  private colorSchemeListeners: Set<(scheme: 'light' | 'dark') => void> = new Set()
  private notificationClickListeners: Set<(event: NotificationClickEvent) => void> = new Set()
  private deepLinkListeners: Set<(url: string) => void> = new Set()
  private windowTitle: string = ''
  private locale: string = 'en-US'
  private notifications: Array<{ title: string; options?: NotificationOptions }> = []
  private mockFiles: SelectedFile[] = []

  // Configure mock behavior

  /**
   * Set mock files for file picker
   */
  setMockFiles(files: Array<{ name: string; content: string; type?: string }>): void {
    this.mockFiles = files.map((f) => createMockFile(f.name, f.content, f.type))
  }

  /**
   * Set mock locale
   */
  setMockLocale(locale: string): void {
    this.locale = locale
  }

  /**
   * Set mock color scheme
   */
  setMockColorScheme(scheme: 'light' | 'dark'): void {
    if (this.colorScheme !== scheme) {
      this.colorScheme = scheme
      this.colorSchemeListeners.forEach((cb) => cb(scheme))
    }
  }

  /**
   * Simulate deep link
   */
  simulateDeepLink(url: string): void {
    this.deepLinkListeners.forEach((cb) => cb(url))
  }

  /**
   * Simulate notification click
   */
  simulateNotificationClick(event: NotificationClickEvent): void {
    this.notificationClickListeners.forEach((cb) => cb(event))
  }

  /**
   * Get shown notifications (for testing)
   */
  getNotifications(): Array<{ title: string; options?: NotificationOptions }> {
    return [...this.notifications]
  }

  /**
   * Get window title (for testing)
   */
  getWindowTitle(): string {
    return this.windowTitle
  }

  // Platform detection

  getPlatform(): Platform {
    return 'web'
  }

  getPlatformInfo(): PlatformInfo {
    return {
      platform: 'web',
      version: 'mock-1.0.0',
      userAgent: 'MockPlatformAdapter/1.0',
      os: 'unknown',
      deviceType: 'desktop',
      isTouch: false,
      isStandalone: false,
    }
  }

  getVersion(): string {
    return 'mock-1.0.0'
  }

  getCapabilities(): PlatformCapabilities {
    return {
      fileSystem: false,
      notifications: true,
      clipboard: true,
      share: true,
      filePicker: true,
      windowManagement: true,
      deepLinking: true,
      persistentStorage: true,
    }
  }

  // Clipboard

  async copyToClipboard(text: string): Promise<void> {
    this.clipboardContent = text
  }

  async readFromClipboard(): Promise<string | null> {
    return this.clipboardContent || null
  }

  // File picker

  async selectFile(options?: FilePickerOptions): Promise<SelectedFile | null> {
    const filtered = this.filterFiles(options)
    return filtered.length > 0 ? filtered[0] : null
  }

  async selectFiles(options?: FilePickerOptions): Promise<SelectedFile[]> {
    return this.filterFiles(options)
  }

  private filterFiles(options?: FilePickerOptions): SelectedFile[] {
    if (!options?.accept) return this.mockFiles

    return this.mockFiles.filter((file) => {
      return options.accept!.some((accept) => {
        if (accept.startsWith('.')) {
          return file.name.endsWith(accept)
        }
        return file.type.includes(accept.replace('/*', ''))
      })
    })
  }

  async selectFolder(): Promise<string | null> {
    return '/mock/folder/path'
  }

  // Share

  canShare(): boolean {
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async share(_data: { title?: string; text?: string; url?: string }): Promise<void> {
    // Mock share - just succeed
  }

  // Notifications

  async requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
    return 'granted'
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    this.notifications.push({ title, options })
  }

  onNotificationClick(callback: (event: NotificationClickEvent) => void): () => void {
    this.notificationClickListeners.add(callback)
    return () => {
      this.notificationClickListeners.delete(callback)
    }
  }

  // Window management

  async setWindowTitle(title: string): Promise<void> {
    this.windowTitle = title
  }

  async minimizeWindow(): Promise<void> {
    // Mock minimize
  }

  async maximizeWindow(): Promise<void> {
    // Mock maximize
  }

  async restoreWindow(): Promise<void> {
    // Mock restore
  }

  async closeWindow(): Promise<void> {
    // Mock close
  }

  async toggleFullscreen(): Promise<void> {
    // Mock fullscreen toggle
  }

  async isMaximized(): Promise<boolean> {
    return false
  }

  async isFullscreen(): Promise<boolean> {
    return false
  }

  // Deep linking

  registerDeepLinkHandler(callback: (url: string) => void): () => void {
    this.deepLinkListeners.add(callback)
    return () => {
      this.deepLinkListeners.delete(callback)
    }
  }

  // System

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async openExternalUrl(_url: string): Promise<void> {
    // Mock open external
  }

  getLocale(): string {
    return this.locale
  }

  getColorScheme(): 'light' | 'dark' | 'system' {
    return this.colorScheme
  }

  onColorSchemeChange(callback: (scheme: 'light' | 'dark') => void): () => void {
    this.colorSchemeListeners.add(callback)
    return () => {
      this.colorSchemeListeners.delete(callback)
    }
  }

  /**
   * Reset mock state
   */
  reset(): void {
    this.clipboardContent = ''
    this.colorScheme = 'light'
    this.windowTitle = ''
    this.notifications = []
    this.mockFiles = []
  }
}

/**
 * Create a mock platform adapter
 */
export function createMockPlatform(): MockPlatformAdapter {
  return new MockPlatformAdapter()
}
