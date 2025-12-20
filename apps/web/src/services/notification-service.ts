/**
 * Notification Service
 * Abstract notification interface - Vue layer registers the actual handler
 */

export interface NotificationOptions {
  message: string
  type: 'positive' | 'negative' | 'warning' | 'info'
  caption?: string
  timeout?: number
}

export type NotificationHandler = (options: NotificationOptions) => void

export class NotificationService {
  private _handler: NotificationHandler | null = null

  setHandler(handler: NotificationHandler): void {
    this._handler = handler
  }

  show(options: NotificationOptions): void {
    if (this._handler) {
      this._handler(options)
    } else {
      // Fallback to console
      const prefix = `[${options.type.toUpperCase()}]`
      const msg = options.caption ? `${options.message} - ${options.caption}` : options.message
      if (options.type === 'negative') {
        console.error(prefix, msg)
      } else if (options.type === 'warning') {
        console.warn(prefix, msg)
      } else {
        console.log(prefix, msg)
      }
    }
  }

  error(message: string, caption?: string): void {
    this.show({ message, caption, type: 'negative', timeout: 5000 })
  }

  success(message: string): void {
    this.show({ message, type: 'positive', timeout: 3000 })
  }

  warning(message: string): void {
    this.show({ message, type: 'warning', timeout: 4000 })
  }

  info(message: string): void {
    this.show({ message, type: 'info', timeout: 3000 })
  }
}
