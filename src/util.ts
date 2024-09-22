import { LanguageSymbol, LocaleSymbol } from './types'
import { languageData } from './logic/data'
import locales from './i18n'

export const LOCAL_STORAGE_KEY = 'pl.netanel.jota-app'

export enum Direction {
  Next = 1,
  Prev = -1
}

export function copyTextToClipboard(text: string): void {
  const textArea = document.createElement('textarea')

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakiness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed'
  textArea.style.top = '0'
  textArea.style.left = '0'

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em'
  textArea.style.height = '2em'

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = '0'

  // Clean up any borders.
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent'

  textArea.value = text

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  document.execCommand('copy')

  document.body.removeChild(textArea)
}

export function bindKeyEvent(binding: string, callback: (event: KeyboardEvent) => void) {
  const parts = binding.split('+')
  const key = parts[parts.length - 1]
  const shift = parts.includes('Shift')
  const alt = parts.includes('Alt')
  const ctrl = parts.includes('Ctrl')
  return (event: KeyboardEvent) => {
    if (event.key === key && event.shiftKey == shift && event.altKey === alt && (event.ctrlKey === ctrl || event.metaKey === ctrl)) {
      callback(event)
    }
  }
}

export function parseDate(dateString: string): Date {
  const tokens = dateString.split('-').map(it => parseInt(it))
  return new Date(tokens[0], tokens[1] - 1, tokens[2])
}

export function formatDate(date: Date): string {
  if (!date) date = new Date()
  if (date instanceof Date) {
    const d = date.getDate().toString().padStart(2, '0')
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const y = date.getFullYear()
    return `${y}-${m}-${d}`
  } else {
    return date
  }
}

export function focusElement(ref: HTMLElement | null) {
  if (ref) {
    const inputElement = ref.querySelector('input') as HTMLInputElement
    inputElement?.focus()
  }
}

export function errorMessage(prefix: string, ex: unknown): string {
  const message = ex instanceof Error ? ex.message : String(ex)
  return `${prefix} ${message}`
}

export function getDefaultLocale(): LocaleSymbol {
  return (Object.keys(locales).find(l => l.startsWith(navigator.language)) || 'en-US') as LocaleSymbol
}

export function convertObject<T extends object, M extends object>(
  obj: T,
  protoMethods: M
): T & M {
  const newObj = Object.create(protoMethods) as T & M
  Object.assign(newObj, obj)
  return newObj
}

export function nativeLanguageName(lang: LanguageSymbol): string {
  return languageData.find(it => it.symbol === lang)?.name || lang
}
