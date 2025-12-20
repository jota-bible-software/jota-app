/**
 * Keyboard event adapter for web browsers
 */

/**
 * Keyboard binding configuration
 */
export interface KeyBinding {
  key: string
  shift?: boolean
  alt?: boolean
  ctrl?: boolean
  meta?: boolean
}

/**
 * Parse a keyboard binding string like "Ctrl+Shift+K"
 * @param binding - Binding string
 * @returns KeyBinding configuration
 */
export function parseKeyBinding(binding: string): KeyBinding {
  const parts = binding.split('+')
  const key = parts[parts.length - 1]
  return {
    key,
    shift: parts.includes('Shift'),
    alt: parts.includes('Alt'),
    ctrl: parts.includes('Ctrl'),
    meta: parts.includes('Meta') || parts.includes('Cmd'),
  }
}

/**
 * Create a keyboard event handler from a binding string
 * @param binding - Binding string like "Ctrl+K"
 * @param callback - Callback to execute on match
 * @returns Event handler function
 */
export function bindKeyEvent(
  binding: string,
  callback: (event: KeyboardEvent) => void
): (event: KeyboardEvent) => void {
  const config = parseKeyBinding(binding)

  return (event: KeyboardEvent) => {
    const ctrlOrMeta = config.ctrl ? (event.ctrlKey || event.metaKey) : true

    if (
      event.key === config.key &&
      event.shiftKey === (config.shift ?? false) &&
      event.altKey === (config.alt ?? false) &&
      ctrlOrMeta
    ) {
      callback(event)
    }
  }
}

/**
 * Focus an input element within a container
 * @param ref - Container element
 */
export function focusInput(ref: HTMLElement | null): void {
  if (ref) {
    const inputElement = ref.querySelector('input') as HTMLInputElement
    inputElement?.focus()
  }
}
