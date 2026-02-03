/**
 * Playwright adapter that implements the TestAPI interface.
 *
 * This adapter wraps PlaywrightHelper functions and ensures all async
 * operations are properly chained. It tracks all promises and ensures
 * they execute in sequence when called from non-async spec functions.
 */
import type { Page, Locator as PWLocator } from '@playwright/test'
import type {
  TestAPI,
  Target,
  Locator,
  PositionType,
  NestedTarget,
  IterableElement,
} from '../../shared/api/types'
import * as helper from '../e2e/PlaywrightHelper'

/**
 * Creates a promise-chaining queue that ensures operations execute sequentially.
 * Supports a "direct mode" for callbacks inside forEach/each/within where
 * operations should execute immediately instead of being queued.
 */
function createPromiseQueue() {
  let queue: Promise<unknown> = Promise.resolve()
  let directMode = false
  let directPromise: Promise<void> = Promise.resolve()

  return {
    /**
     * Add an operation to the queue. Returns immediately but the operation
     * will execute after all previous operations complete.
     * In direct mode, operations execute immediately and are tracked separately.
     */
    enqueue<T>(operation: () => Promise<T>): void {
      if (directMode) {
        // In direct mode, chain to directPromise for immediate execution
        directPromise = directPromise.then(operation).then(() => {})
      } else {
        queue = queue.then(operation)
      }
    },

    /**
     * Get a promise that resolves when all queued operations complete.
     */
    drain(): Promise<void> {
      return queue.then(() => {})
    },

    /**
     * Run a callback with direct mode enabled. Operations enqueued during
     * the callback will execute immediately in sequence.
     */
    async runDirect<T>(callback: () => T): Promise<void> {
      directMode = true
      directPromise = Promise.resolve()
      callback()
      await directPromise
      directMode = false
    },
  }
}

/**
 * Creates a Playwright-compatible TestAPI implementation.
 * All operations are automatically chained to ensure sequential execution.
 *
 * @param page - The Playwright Page object
 */
export function createPlaywrightAPI(
  page: Page
): TestAPI & { drain: () => Promise<void> } {
  helper.setPage(page)
  const promiseQueue = createPromiseQueue()

  return {
    // Navigation
    navigate(url: string): void {
      promiseQueue.enqueue(() => helper.navigate(url))
    },

    // Selectors
    tag(name: string): string {
      return helper.tag(name)
    },

    find(target: Target): Locator {
      return helper.find(target as Parameters<typeof helper.find>[0])
    },

    nested(head: string | Locator, ...tail: string[]): NestedTarget {
      return helper.nested(head as Parameters<typeof helper.nested>[0], ...tail)
    },

    first(target: Target): Locator {
      return helper.first(target as Parameters<typeof helper.first>[0])
    },

    nth(target: Target, position: number): Locator {
      return helper.nth(target as Parameters<typeof helper.nth>[0], position)
    },

    second(target: Target): Locator {
      return helper.second(target as Parameters<typeof helper.second>[0])
    },

    third(target: Target): Locator {
      return helper.third(target as Parameters<typeof helper.third>[0])
    },

    last(target: Target): Locator {
      return helper.last(target as Parameters<typeof helper.last>[0])
    },

    visible(target: Target): Locator {
      return helper.visible(target as Parameters<typeof helper.visible>[0])
    },

    containsText(text: string): Locator {
      return helper.containsText(text)
    },

    errorHint(target: Target): Locator {
      return helper.errorHint(target as Parameters<typeof helper.errorHint>[0])
    },

    // Page info
    title(): Promise<string> {
      return helper.title()
    },

    // Actions
    click(target: Target, position: PositionType = 'center'): void {
      promiseQueue.enqueue(() =>
        helper.click(target as Parameters<typeof helper.click>[0], position)
      )
    },

    forceClick(target: Target): void {
      promiseQueue.enqueue(async () => {
        // Use dispatchEvent for clicks that don't work with regular click (e.g., Quasar buttons with validation errors)
        const locator = helper.find(target as Parameters<typeof helper.find>[0])
        await (locator as PWLocator).dispatchEvent('click')
      })
    },

    type(target: Target, text: string, replace: boolean = false): void {
      promiseQueue.enqueue(() =>
        helper.type(target as Parameters<typeof helper.type>[0], text, replace)
      )
    },

    select(target: Target, value: string): void {
      promiseQueue.enqueue(() =>
        helper.select(target as Parameters<typeof helper.select>[0], value)
      )
    },

    pressKey(key: string): void {
      promiseQueue.enqueue(() => helper.pressKey(key))
    },

    focusOn(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.focusOn(target as Parameters<typeof helper.focusOn>[0])
      )
    },

    setCaret(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.setCaret(target as Parameters<typeof helper.setCaret>[0])
      )
    },

    // Clipboard
    mockClipboard(): void {
      promiseQueue.enqueue(() => helper.mockClipboard())
    },

    assertClipboard(text: string): void {
      promiseQueue.enqueue(() => helper.assertClipboard(text))
    },

    // Dialog actions
    clickDialogYes(): void {
      promiseQueue.enqueue(() => helper.clickDialogYes())
    },

    clickDialogNo(): void {
      promiseQueue.enqueue(() => helper.clickDialogNo())
    },

    // Tooltip
    tooltip(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.tooltip(target as Parameters<typeof helper.tooltip>[0])
      )
    },

    // Assertions
    assertShowing(target: Target, options?: { timeout?: number }): void {
      promiseQueue.enqueue(() =>
        helper.assertShowing(
          target as Parameters<typeof helper.assertShowing>[0],
          options
        )
      )
    },

    assertNotShowing(target: Target, options?: { timeout?: number }): void {
      promiseQueue.enqueue(() =>
        helper.assertNotShowing(
          target as Parameters<typeof helper.assertNotShowing>[0],
          options
        )
      )
    },

    assertExists(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.assertExists(target as Parameters<typeof helper.assertExists>[0])
      )
    },

    assertNotExists(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.assertNotExists(
          target as Parameters<typeof helper.assertNotExists>[0]
        )
      )
    },

    assertText(target: Target, text: string): void {
      promiseQueue.enqueue(() =>
        helper.assertText(
          target as Parameters<typeof helper.assertText>[0],
          text
        )
      )
    },

    assertTextContains(target: Target, text: string): void {
      promiseQueue.enqueue(() =>
        helper.assertTextContains(
          target as Parameters<typeof helper.assertTextContains>[0],
          text
        )
      )
    },

    assertTextNotContains(target: Target, text: string): void {
      promiseQueue.enqueue(() =>
        helper.assertTextNotContains(
          target as Parameters<typeof helper.assertTextNotContains>[0],
          text
        )
      )
    },

    assertHtmlContains(target: Target, htmlFragment: string): void {
      promiseQueue.enqueue(() =>
        helper.assertHtmlContains(
          target as Parameters<typeof helper.assertHtmlContains>[0],
          htmlFragment
        )
      )
    },

    assertHtmlNotContains(target: Target, htmlFragment: string): void {
      promiseQueue.enqueue(() =>
        helper.assertHtmlNotContains(
          target as Parameters<typeof helper.assertHtmlNotContains>[0],
          htmlFragment
        )
      )
    },

    assertValue(target: Target, text: string): void {
      promiseQueue.enqueue(() =>
        helper.assertValue(
          target as Parameters<typeof helper.assertValue>[0],
          text
        )
      )
    },

    assertValueContains(target: Target, value: string): void {
      promiseQueue.enqueue(() =>
        helper.assertValueContains(
          target as Parameters<typeof helper.assertValueContains>[0],
          value
        )
      )
    },

    assertValueNotContains(target: Target, value: string): void {
      promiseQueue.enqueue(() =>
        helper.assertValueNotContains(
          target as Parameters<typeof helper.assertValueNotContains>[0],
          value
        )
      )
    },

    assertEqual(target: Target, text: string): void {
      promiseQueue.enqueue(() =>
        helper.assertEqual(
          target as Parameters<typeof helper.assertEqual>[0],
          text
        )
      )
    },

    assertCount(target: Target, count: number): void {
      promiseQueue.enqueue(() =>
        helper.assertCount(
          target as Parameters<typeof helper.assertCount>[0],
          count
        )
      )
    },

    assertChecked(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.assertChecked(
          target as Parameters<typeof helper.assertChecked>[0]
        )
      )
    },

    assertNotChecked(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.assertNotChecked(
          target as Parameters<typeof helper.assertNotChecked>[0]
        )
      )
    },

    assertEnabled(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.assertEnabled(
          target as Parameters<typeof helper.assertEnabled>[0]
        )
      )
    },

    assertDisabled(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.assertDisabled(
          target as Parameters<typeof helper.assertDisabled>[0]
        )
      )
    },

    assertLookEnabled(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.assertLookEnabled(
          target as Parameters<typeof helper.assertLookEnabled>[0]
        )
      )
    },

    assertLookDisabled(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.assertLookDisabled(
          target as Parameters<typeof helper.assertLookDisabled>[0]
        )
      )
    },

    assertHasClass(target: Target, className: string): void {
      promiseQueue.enqueue(() =>
        helper.assertHasClass(
          target as Parameters<typeof helper.assertHasClass>[0],
          className
        )
      )
    },

    assertNotHasClass(target: Target, className: string): void {
      promiseQueue.enqueue(() =>
        helper.assertNotHasClass(
          target as Parameters<typeof helper.assertNotHasClass>[0],
          className
        )
      )
    },

    assertErrorHint(target: Target, text: string): void {
      promiseQueue.enqueue(() =>
        helper.assertErrorHint(
          target as Parameters<typeof helper.assertErrorHint>[0],
          text
        )
      )
    },

    assertNoErrorHint(target: Target): void {
      promiseQueue.enqueue(() =>
        helper.assertNoErrorHint(
          target as Parameters<typeof helper.assertNoErrorHint>[0]
        )
      )
    },

    assertMatchesPattern(target: Target, pattern: RegExp): void {
      promiseQueue.enqueue(() =>
        helper.assertMatchesPattern(
          target as Parameters<typeof helper.assertMatchesPattern>[0],
          pattern
        )
      )
    },

    // Utilities
    wait(ms: number): void {
      promiseQueue.enqueue(() => helper.wait(ms))
    },

    getText(target: Target): Promise<string> {
      return helper.getText(target as Parameters<typeof helper.getText>[0])
    },

    t(key: string, options?: Record<string, unknown>): string {
      return helper.t(key, options)
    },

    clearLocalStorage(): void {
      promiseQueue.enqueue(() => helper.clearLocalStorage())
    },

    ensureHighlightTranslation(symbol: string): void {
      promiseQueue.enqueue(() => helper.ensureHighlightTranslation(symbol))
    },

    // Split button handling (for Quasar q-btn-dropdown with split)
    clickSplitButtonMain(target: Target): void {
      promiseQueue.enqueue(async () => {
        const locator = helper.find(target as Parameters<typeof helper.find>[0])
        // For Playwright, click the button content area of split dropdowns
        await (locator as PWLocator).locator('.q-btn__content').first().click()
      })
    },

    clickSplitButtonArrow(target: Target): void {
      promiseQueue.enqueue(async () => {
        const locator = helper.find(target as Parameters<typeof helper.find>[0])
        // For Playwright, click the dropdown arrow container
        await (locator as PWLocator)
          .locator('.q-btn-dropdown__arrow-container')
          .click()
      })
    },

    // Iteration
    // NOTE: forEach/each/within callbacks call api methods (like api.assertText) which
    // would normally enqueue operations. We use runDirect to execute them immediately.
    forEach<T>(
      target: Target,
      items: T[],
      assertFn: (element: Locator, expected: T) => void
    ): void {
      promiseQueue.enqueue(async () => {
        const locator = helper.find(target as Parameters<typeof helper.find>[0])
        const count = await (locator as PWLocator).count()

        for (let i = 0; i < count && i < items.length; i++) {
          // Run the callback in direct mode - api calls execute immediately
          await promiseQueue.runDirect(() => {
            assertFn((locator as PWLocator).nth(i), items[i])
          })
        }
      })
    },

    each(
      target: Target,
      fn: (element: IterableElement, index: number) => void
    ): void {
      promiseQueue.enqueue(async () => {
        const locator = helper.find(target as Parameters<typeof helper.find>[0])
        const count = await (locator as PWLocator).count()

        for (let i = 0; i < count; i++) {
          const nthLocator = (locator as PWLocator).nth(i)
          const wrapped: IterableElement = {
            find: (selector: string) => nthLocator.locator(selector),
            raw: nthLocator,
          }
          // Run the callback in direct mode - api calls execute immediately
          await promiseQueue.runDirect(() => {
            fn(wrapped, i)
          })
        }
      })
    },

    // Scoping
    within(target: Target, fn: (locator: Locator) => void): void {
      promiseQueue.enqueue(async () => {
        const locator = helper.find(target as Parameters<typeof helper.find>[0])
        // Run the callback in direct mode - api calls execute immediately
        await promiseQueue.runDirect(() => {
          fn(locator)
        })
      })
    },

    dialog(): Locator {
      return helper.dialog()
    },

    notification(): Locator {
      return helper.notification()
    },

    focused(): Locator {
      return helper.focused()
    },

    // Escape hatch
    getPage(): unknown {
      return page
    },

    // Drain all queued operations
    drain(): Promise<void> {
      return promiseQueue.drain()
    },
  }
}
