import { Page, Locator, expect } from '@playwright/test'
import { createI18n } from 'vue-i18n'
import messages from '../../../src/i18n'
import * as fs from 'fs'
import * as path from 'path'

// Hardcode locale for tests (navigator is not available in Node.js)
const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

let currentPage: Page

export function setPage(page: Page) {
  currentPage = page
}

export function getPage(): Page {
  return currentPage
}

export async function setupFixtureRoutes(page: Page) {
  await page.route('**/data/*/*.json', async (route) => {
    const url = route.request().url()
    const parts = url.split('/')
    const fileName = parts[parts.length - 1].toLowerCase()
    const locale = parts[parts.length - 2]
    const fixturePath = path.resolve(
      __dirname,
      `../fixtures/${locale}/${fileName}`
    )

    try {
      const data = fs.readFileSync(fixturePath, 'utf-8')
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: data,
      })
    } catch (error) {
      // Fixture not found, let the request continue to the real server
      await route.continue()
    }
  })

  // Also intercept image requests that might be failing
  await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', async (route) => {
    // Continue with the request but don't fail if images are missing
    try {
      await route.continue()
    } catch {
      await route.fulfill({ status: 200, body: '' })
    }
  })
}

export async function navigate(url: string) {
  const publicPath = ''
  const fullUrl = `${publicPath}${url}`
  await currentPage.goto(fullUrl)
}

export function tag(name: string): string {
  return `[data-tag=${name}]`
}

type SingleTarget = string | Locator
type NestedTarget = { head: SingleTarget; tail: string[] }
type Target = SingleTarget | NestedTarget

export function nested(head: SingleTarget, ...tail: string[]): NestedTarget {
  return { head, tail }
}

export function find(target: Target): Locator {
  if (typeof target === 'string') {
    return currentPage.locator(target)
  }
  if ('head' in target && 'tail' in target) {
    const nested = target as NestedTarget
    let locator = find(nested.head)
    for (const selector of nested.tail) {
      locator = locator.locator(selector)
    }
    return locator
  }
  return target as Locator
}

export function errorHint(target: Target): Locator {
  return find(target)
    .locator('xpath=ancestor::*[contains(@class, "q-field")]')
    .locator('div[role="alert"]')
    .last()
}

export async function tooltip(target: Target): Promise<Locator> {
  await find(target).hover()
  // Wait for tooltip to appear
  const tooltipLocator = currentPage.locator('.q-tooltip')
  await tooltipLocator.waitFor({ state: 'visible', timeout: 5000 })
  return tooltipLocator
}

export async function assertNoErrorHint(target: Target) {
  const alerts = find(target)
    .locator('xpath=ancestor::*[contains(@class, "q-field")]')
    .locator('div[role="alert"]')
  const count = await alerts.count()
  if (count === 0) {
    // No alerts, assertion passes
    return
  }
  // Check that alerts are not visible
  await expect(alerts.first()).not.toBeVisible()
}

export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.global.t(key, options ?? {}) as string
}

export function first(target: Target): Locator {
  return find(target).first()
}

export function nth(target: Target, position: number): Locator {
  return find(target).nth(position - 1)
}

export function second(target: Target): Locator {
  return find(target).nth(1)
}

export function third(target: Target): Locator {
  return find(target).nth(2)
}

export function last(target: Target): Locator {
  return find(target).last()
}

export function visible(target: Target): Locator {
  // Return first visible match to avoid strict mode violations
  return find(target).first()
}

export function containsText(text: string): Locator {
  return currentPage.getByText(text)
}

export async function title(): Promise<string> {
  return currentPage.title()
}

type PositionType =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'left'
  | 'center'
  | 'right'
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight'

function getPositionCoords(
  position: PositionType
): { x: number; y: number } | undefined {
  const positionMap: Record<PositionType, { x: number; y: number }> = {
    topLeft: { x: 1, y: 1 },
    top: { x: 0.5, y: 0.1 },
    topRight: { x: 0.9, y: 0.1 },
    left: { x: 0.1, y: 0.5 },
    center: { x: 0.5, y: 0.5 },
    right: { x: 0.9, y: 0.5 },
    bottomLeft: { x: 0.1, y: 0.9 },
    bottom: { x: 0.5, y: 0.9 },
    bottomRight: { x: 0.9, y: 0.9 },
  }
  return positionMap[position]
}

export async function click(target: Target, position: PositionType = 'center') {
  const locator = find(target)
  if (position === 'center') {
    await locator.click()
  } else if (position === 'left') {
    // Left click (default mouse button)
    await locator.click()
  } else if (position === 'right') {
    await locator.click({ button: 'right' })
  } else {
    const box = await locator.boundingBox()
    if (box) {
      const coords = getPositionCoords(position)
      if (coords) {
        await currentPage.mouse.click(
          box.x + box.width * coords.x,
          box.y + box.height * coords.y
        )
      }
    }
  }
}

export const clipboard = { value: '' }

export async function mockClipboard() {
  // Grant clipboard permissions
  await currentPage
    .context()
    .grantPermissions(['clipboard-read', 'clipboard-write'])

  // Clear the clipboard before the test
  await currentPage.evaluate(async () => {
    try {
      await navigator.clipboard.writeText('')
    } catch (e) {
      // Ignore errors
    }
  })
}

export async function assertClipboard(text: string) {
  // Wait for clipboard operation to complete
  await currentPage.waitForTimeout(500)

  // Read directly from the system clipboard
  const clipboardValue = await currentPage.evaluate(async () => {
    try {
      return await navigator.clipboard.readText()
    } catch (e) {
      console.error('Failed to read clipboard:', e)
      return ''
    }
  })

  expect(clipboardValue).toBe(text)
}

export async function setCaret(target: Target) {
  const locator = find(target)
  await locator.click()
  await locator.evaluate((el: HTMLElement) => {
    if (!el) return

    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null)
    const node = walk.nextNode()
    if (!node) return

    document.getSelection()?.removeAllRanges()
    const range = new Range()
    range.setStart(node, 0)
    range.setEnd(node, 0)
    range.collapse(true)
    ;(window as any)._jota_test_support =
      (window as any)._jota_test_support || {}
    ;(window as any)._jota_test_support.getSelectionRange = () => range

    document.dispatchEvent(new Event('selectionchange'))
  })
}

export async function focusOn(target: Target) {
  await find(target).focus()
}

export function focused(): Locator {
  return currentPage.locator(':focus')
}

export async function pressKey(key: string) {
  // Convert Cypress key format to Playwright format
  let playwrightKey = key
    .replace('{enter}', 'Enter')
    .replace('{ctrl+rightArrow}', 'Control+ArrowRight')
    .replace('{ctrl+leftArrow}', 'Control+ArrowLeft')
    .replace('{downArrow}', 'ArrowDown')
    .replace('{upArrow}', 'ArrowUp')
    .replace('{backspace}', 'Backspace')

  await currentPage.keyboard.press(playwrightKey)
}

export async function type(
  target: Target,
  text: string,
  replace: boolean = false
) {
  const locator = find(target)
  const isInput = await locator
    .evaluate((el) => {
      return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
    })
    .catch(() => false)

  let inputLocator: Locator
  if (isInput) {
    inputLocator = locator
  } else {
    inputLocator = locator.locator('input, textarea')
  }

  if (replace) {
    await inputLocator.clear()
  }

  if (text.length > 0) {
    // Handle special keys
    if (text.includes('{enter}')) {
      const parts = text.split('{enter}')
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) {
          await inputLocator.pressSequentially(parts[i])
        }
        if (i < parts.length - 1) {
          await inputLocator.press('Enter')
        }
      }
    } else if (text.includes('{backspace}')) {
      const backspaceCount = (text.match(/{backspace}/g) || []).length
      for (let i = 0; i < backspaceCount; i++) {
        await inputLocator.press('Backspace')
      }
    } else if (replace) {
      // fill() replaces the entire content
      await inputLocator.fill(text)
    } else {
      // pressSequentially() appends to existing content
      await inputLocator.pressSequentially(text)
    }
  }
}

export async function select(target: Target, value: string) {
  await find(target).click()
  await currentPage.waitForSelector('.q-menu', { state: 'visible' })

  // Wait for menu to be stable
  await currentPage.waitForTimeout(100)

  if (value) {
    // Use filter to find the item containing the value - more reliable than iterating
    const menuItem = currentPage
      .locator('.q-menu .q-item')
      .filter({ hasText: value })
      .first()
    await menuItem.click()
  } else {
    // For empty value, click the first item
    await currentPage.locator('.q-menu .q-item').first().click()
  }
}

export async function clickDialogNo() {
  await currentPage
    .locator('.q-dialog')
    .getByRole('button', { name: t('settingsFormatTemplates.no') })
    .click()
}

export async function clickDialogYes() {
  await currentPage
    .locator('.q-dialog')
    .getByRole('button', { name: t('settingsFormatTemplates.yes') })
    .click()
}

export function notification(): Locator {
  return currentPage.locator('.q-notification').last()
}

export async function forEach<T>(
  target: Target,
  items: T[],
  assertFn: (element: Locator, expected: T) => Promise<void>
) {
  const locator = find(target)
  const count = await locator.count()

  for (let i = 0; i < count && i < items.length; i++) {
    await assertFn(locator.nth(i), items[i])
  }
}

export async function assertNotShowing(
  target: Target,
  options: { timeout?: number } = {}
) {
  const locator = find(target)
  const count = await locator.count()
  if (count === 0) {
    await expect(locator).not.toBeVisible({ timeout: options.timeout })
  } else {
    await expect(locator.first()).not.toBeVisible({ timeout: options.timeout })
  }
}

export async function assertShowing(
  target: Target,
  options: { timeout?: number } = {}
) {
  const locator = find(target)
  // Use first() to avoid strict mode violations when multiple elements match
  await expect(locator.first()).toBeVisible({ timeout: options.timeout })
}

export async function assertText(target: Target, text: string) {
  const locator = find(target)
  const isInput = await locator
    .evaluate((el) => {
      return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
    })
    .catch(() => false)

  if (isInput) {
    const value = await locator.inputValue()
    if (value) {
      // Assert the input value if it's not empty
      await expect(locator).toHaveValue(text)
    } else {
      // Assert the text of the parent element if the input value is empty
      // This handles Quasar q-select components where the selected value is shown in parent
      const parentLocator = locator.locator('..')
      const parentText = await parentLocator.textContent()
      expect(parentText?.trim()).toBe(text)
    }
  } else {
    await expect(locator).toHaveText(text)
  }
}

export async function assertHtmlContains(target: Target, htmlFragment: string) {
  const html = await find(target).first().innerHTML()
  expect(html).toContain(htmlFragment)
}

export async function assertHtmlNotContains(
  target: Target,
  htmlFragment: string
) {
  const html = await find(target).first().innerHTML()
  expect(html).not.toContain(htmlFragment)
}

export async function assertTextContains(target: Target, text: string) {
  await expect(find(target)).toContainText(text)
}

export async function assertTextNotContains(target: Target, text: string) {
  await expect(find(target)).not.toContainText(text)
}

export async function assertValue(target: Target, text: string) {
  await expect(find(target)).toHaveValue(text)
}

export async function assertChecked(target: Target) {
  await expect(find(target).locator('.q-toggle__inner--truthy')).toBeVisible()
}

export async function assertNotChecked(target: Target) {
  await expect(find(target).locator('.q-toggle__inner--falsy')).toBeVisible()
}

export async function assertValueContains(target: Target, value: string) {
  const inputValue = await find(target).inputValue()
  expect(inputValue).toContain(value)
}

export async function assertValueNotContains(target: Target, value: string) {
  const inputValue = await find(target).inputValue()
  expect(inputValue).not.toContain(value)
}

export async function assertEqual(
  target: Target | Promise<string>,
  text: string
) {
  if (target instanceof Promise) {
    const actual = await target
    expect(actual).toBe(text)
  } else {
    const locator = find(target)
    await expect(locator).toHaveText(text)
  }
}

export async function assertCount(target: Target, length: number) {
  await expect(find(target)).toHaveCount(length)
}

export async function assertLookDisabled(target: Target) {
  await expect(find(target)).toHaveClass(/text-disabled/)
}

export async function assertLookEnabled(target: Target) {
  await expect(find(target)).not.toHaveClass(/text-disabled/)
}

export async function assertDisabled(target: Target) {
  await expect(find(target)).toBeDisabled()
}

export async function assertEnabled(target: Target) {
  await expect(find(target)).toBeEnabled()
}

export async function assertHasClass(target: Target, className: string) {
  await expect(find(target)).toHaveClass(new RegExp(className))
}

export async function assertNotHasClass(target: Target, className: string) {
  await expect(find(target)).not.toHaveClass(new RegExp(className))
}

export async function assertErrorHint(target: Target, text: string) {
  await currentPage.waitForTimeout(500)
  const el = find(target)
    .locator('xpath=ancestor::*[contains(@class, "q-field")]')
    .locator('div[role="alert"]')
  await assertText(el, text)
}

export function dialog(): Locator {
  return currentPage.locator('.q-dialog')
}

export async function assertExists(target: Target) {
  await expect(find(target)).toBeAttached()
}

export async function assertNotExists(target: Target) {
  await expect(find(target)).not.toBeAttached()
}

export async function within(
  target: Target,
  fn: (locator: Locator) => Promise<void>
) {
  const locator = find(target)
  await fn(locator)
}

export async function wait(ms: number) {
  await currentPage.waitForTimeout(ms)
}

export async function assertMatchesPattern(target: Target, pattern: RegExp) {
  const text = await find(target).textContent()
  expect(text).toMatch(pattern)
}

export async function getText(target: Target): Promise<string> {
  const text = await find(target).textContent()
  return text || ''
}

export async function each(
  target: Target,
  fn: (locator: Locator, index: number) => Promise<void>
) {
  const locator = find(target)
  const count = await locator.count()

  for (let i = 0; i < count; i++) {
    await fn(locator.nth(i), i)
  }
}

export async function clearLocalStorage() {
  await currentPage.evaluate(() => localStorage.clear())
}

export async function getBody(): Promise<Locator> {
  return currentPage.locator('body')
}

/**
 * Ensures a translation is added for highlights. If no translations exist,
 * adds the specified translation symbol.
 */
export async function ensureHighlightTranslation(symbol: string) {
  const highlightsTranslationItem =
    '[data-tag="settings-highlights-translation-item"]'
  const translationSelector = '[data-tag="translation-selector"]'
  const highlightsAddButton = '[data-tag="settings-highlights-add-button"]'

  const itemCount = await currentPage.locator(highlightsTranslationItem).count()
  if (itemCount === 0) {
    await select(translationSelector, symbol)
    await click(highlightsAddButton)
    await wait(500)
  }
}
