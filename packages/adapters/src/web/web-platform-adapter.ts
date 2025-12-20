/**
 * Web Platform adapter
 * Browser-specific platform features
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
import { PlatformError } from '../interfaces/platform'

/**
 * Detect operating system from user agent
 */
function detectOS(): PlatformInfo['os'] {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('win')) return 'windows'
  if (ua.includes('mac')) return 'macos'
  if (ua.includes('linux')) return 'linux'
  if (ua.includes('iphone') || ua.includes('ipad')) return 'ios'
  if (ua.includes('android')) return 'android'
  return 'unknown'
}

/**
 * Detect device type
 */
function detectDeviceType(): PlatformInfo['deviceType'] {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('mobile')) return 'mobile'
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet'
  return 'desktop'
}

/**
 * Wrap a File object to match SelectedFile interface
 */
function wrapFile(file: File): SelectedFile {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    text: () => file.text(),
    arrayBuffer: () => file.arrayBuffer(),
  }
}

/**
 * Web platform adapter for browser environments
 */
export class WebPlatformAdapter implements IPlatformAdapter {
  private colorSchemeMediaQuery: MediaQueryList | null = null
  private colorSchemeListeners: Set<(scheme: 'light' | 'dark') => void> = new Set()
  private notificationClickListeners: Set<(event: NotificationClickEvent) => void> = new Set()

  constructor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    }
  }

  // Platform detection

  getPlatform(): Platform {
    return 'web'
  }

  getPlatformInfo(): PlatformInfo {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // Check for PWA/standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as { standalone?: boolean }).standalone === true

    return {
      platform: 'web',
      version: navigator.userAgent,
      userAgent: navigator.userAgent,
      os: detectOS(),
      deviceType: detectDeviceType(),
      isTouch,
      isStandalone,
    }
  }

  getVersion(): string {
    return navigator.userAgent
  }

  getCapabilities(): PlatformCapabilities {
    return {
      fileSystem: false, // Web doesn't have direct file system access
      notifications: 'Notification' in window,
      clipboard: 'clipboard' in navigator,
      share: 'share' in navigator,
      filePicker: 'showOpenFilePicker' in window || true, // Fallback with input element
      windowManagement: false, // Web can't manage windows
      deepLinking: true, // URLs work as deep links
      persistentStorage: 'storage' in navigator && 'persist' in navigator.storage,
    }
  }

  // Clipboard

  async copyToClipboard(text: string): Promise<void> {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        return
      } catch {
        // Fall through to fallback
      }
    }

    // Fallback using textarea
    this.copyTextLegacy(text)
  }

  private copyTextLegacy(text: string): void {
    const textArea = document.createElement('textarea')

    textArea.style.position = 'fixed'
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = '0'
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    textArea.value = text

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  async readFromClipboard(): Promise<string | null> {
    if (navigator.clipboard && navigator.clipboard.readText) {
      try {
        return await navigator.clipboard.readText()
      } catch {
        return null
      }
    }
    return null
  }

  // File picker

  async selectFile(options?: FilePickerOptions): Promise<SelectedFile | null> {
    const files = await this.selectFilesInternal(options, false)
    return files.length > 0 ? files[0] : null
  }

  async selectFiles(options?: FilePickerOptions): Promise<SelectedFile[]> {
    return this.selectFilesInternal(options, true)
  }

  private async selectFilesInternal(
    options?: FilePickerOptions,
    multiple: boolean = false
  ): Promise<SelectedFile[]> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = multiple || (options?.multiple ?? false)

      if (options?.accept) {
        input.accept = options.accept.join(',')
      }

      input.onchange = () => {
        const files = Array.from(input.files ?? []).map(wrapFile)
        resolve(files)
      }

      // Handle cancel
      input.oncancel = () => resolve([])

      input.click()
    })
  }

  async selectFolder(): Promise<string | null> {
    // Web doesn't support folder selection in a way that returns a path
    throw new PlatformError(
      'Folder selection is not supported in web browsers',
      'NOT_SUPPORTED'
    )
  }

  // Share

  canShare(): boolean {
    return 'share' in navigator
  }

  async share(data: { title?: string; text?: string; url?: string }): Promise<void> {
    if (!navigator.share) {
      throw new PlatformError('Web Share API not supported', 'NOT_SUPPORTED')
    }

    try {
      await navigator.share(data)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled - not an error
        return
      }
      throw new PlatformError('Share failed', 'UNKNOWN')
    }
  }

  // Notifications

  async requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
    if (!('Notification' in window)) {
      throw new PlatformError('Notifications not supported', 'NOT_SUPPORTED')
    }

    const result = await Notification.requestPermission()
    return result
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window)) {
      throw new PlatformError('Notifications not supported', 'NOT_SUPPORTED')
    }

    if (Notification.permission !== 'granted') {
      throw new PlatformError('Notification permission denied', 'PERMISSION_DENIED')
    }

    const notification = new Notification(title, {
      body: options?.body,
      icon: options?.icon,
      badge: options?.badge,
      tag: options?.tag,
      requireInteraction: options?.requireInteraction,
      data: options?.data,
    })

    notification.onclick = () => {
      const event: NotificationClickEvent = {
        tag: options?.tag,
        data: options?.data,
      }
      this.notificationClickListeners.forEach((callback) => callback(event))
    }

    if (options?.timeout) {
      setTimeout(() => notification.close(), options.timeout)
    }
  }

  onNotificationClick(callback: (event: NotificationClickEvent) => void): () => void {
    this.notificationClickListeners.add(callback)
    return () => {
      this.notificationClickListeners.delete(callback)
    }
  }

  // Window management (limited in web)

  async setWindowTitle(title: string): Promise<void> {
    document.title = title
  }

  async toggleFullscreen(): Promise<void> {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }

  async isFullscreen(): Promise<boolean> {
    return document.fullscreenElement !== null
  }

  // System

  async openExternalUrl(url: string): Promise<void> {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  getLocale(): string {
    return navigator.language || 'en-US'
  }

  getColorScheme(): 'light' | 'dark' | 'system' {
    if (!this.colorSchemeMediaQuery) return 'system'
    return this.colorSchemeMediaQuery.matches ? 'dark' : 'light'
  }

  onColorSchemeChange(callback: (scheme: 'light' | 'dark') => void): () => void {
    if (!this.colorSchemeMediaQuery) {
      return () => {}
    }

    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches ? 'dark' : 'light')
    }

    this.colorSchemeMediaQuery.addEventListener('change', handler)
    this.colorSchemeListeners.add(callback)

    return () => {
      this.colorSchemeMediaQuery?.removeEventListener('change', handler)
      this.colorSchemeListeners.delete(callback)
    }
  }

  // Deep linking (handled by URL/router in web)
  registerDeepLinkHandler(callback: (url: string) => void): () => void {
    const handler = () => {
      callback(window.location.href)
    }

    window.addEventListener('popstate', handler)

    return () => {
      window.removeEventListener('popstate', handler)
    }
  }
}

/**
 * Create a web platform adapter
 */
export function createWebPlatform(): IPlatformAdapter {
  return new WebPlatformAdapter()
}
