/**
 * Cypress adapter that implements the TestAPI interface.
 *
 * Wraps existing CypressHelper functions to provide a unified interface.
 * All methods are synchronous (no async/await) because Cypress queues
 * commands internally.
 */
import type {
  TestAPI,
  Target,
  Locator,
  PositionType,
  NestedTarget,
  IterableElement,
} from '../../shared/api/types'
import * as helper from '../e2e/CypressHelper'

/**
 * Creates a Cypress-compatible TestAPI implementation.
 * All methods return void (not Promise<void>) because Cypress
 * commands are queued synchronously.
 */
export function createCypressAPI(): TestAPI {
  return {
    // Navigation
    navigate(url: string): void {
      helper.navigate(url)
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

    // Page info - returns Cypress chainable
    title(): Cypress.Chainable<string> {
      return helper.title() as Cypress.Chainable<string>
    },

    // Actions
    click(target: Target, position: PositionType = 'center'): void {
      helper.click(target as Parameters<typeof helper.click>[0], position)
    },

    forceClick(target: Target): void {
      // In Cypress, force click with { force: true }
      helper
        .find(target as Parameters<typeof helper.find>[0])
        .click({ force: true })
    },

    type(target: Target, text: string, replace: boolean = false): void {
      helper.type(target as Parameters<typeof helper.type>[0], text, replace)
    },

    select(target: Target, value: string): void {
      helper.select(target as Parameters<typeof helper.select>[0], value)
    },

    pressKey(key: string): void {
      helper.pressKey(key)
    },

    focusOn(target: Target): void {
      helper.focusOn(target as Parameters<typeof helper.focusOn>[0])
    },

    setCaret(target: Target): void {
      helper.setCaret(target as Parameters<typeof helper.setCaret>[0])
    },

    // Clipboard
    mockClipboard(): void {
      helper.mockClipboard()
    },

    assertClipboard(text: string): void {
      helper.assertClipboard(text)
    },

    // Dialog actions
    clickDialogYes(): void {
      helper.clickDialogYes()
    },

    clickDialogNo(): void {
      helper.clickDialogNo()
    },

    // Tooltip
    tooltip(target: Target): Locator {
      return helper.tooltip(target as Parameters<typeof helper.tooltip>[0])
    },

    // Assertions
    assertShowing(target: Target, options?: { timeout?: number }): void {
      helper.assertShowing(
        target as Parameters<typeof helper.assertShowing>[0],
        options
      )
    },

    assertNotShowing(target: Target, _options?: { timeout?: number }): void {
      helper.assertNotShowing(
        target as Parameters<typeof helper.assertNotShowing>[0]
      )
    },

    assertExists(target: Target): void {
      helper.assertExists(target as Parameters<typeof helper.assertExists>[0])
    },

    assertNotExists(target: Target): void {
      helper.assertNotExists(
        target as Parameters<typeof helper.assertNotExists>[0]
      )
    },

    assertText(target: Target, text: string): void {
      helper.assertText(target as Parameters<typeof helper.assertText>[0], text)
    },

    assertTextContains(target: Target, text: string): void {
      helper.assertTextContains(
        target as Parameters<typeof helper.assertTextContains>[0],
        text
      )
    },

    assertTextNotContains(target: Target, text: string): void {
      helper.assertTextNotContains(
        target as Parameters<typeof helper.assertTextNotContains>[0],
        text
      )
    },

    assertHtmlContains(target: Target, htmlFragment: string): void {
      helper.assertHtmlContains(
        target as Parameters<typeof helper.assertHtmlContains>[0],
        htmlFragment
      )
    },

    assertHtmlNotContains(target: Target, htmlFragment: string): void {
      helper.assertHtmlNotContains(
        target as Parameters<typeof helper.assertHtmlNotContains>[0],
        htmlFragment
      )
    },

    assertValue(target: Target, text: string): void {
      helper.assertValue(
        target as Parameters<typeof helper.assertValue>[0],
        text
      )
    },

    assertValueContains(target: Target, value: string): void {
      helper.assertValueContains(
        target as Parameters<typeof helper.assertValueContains>[0],
        value
      )
    },

    assertValueNotContains(target: Target, value: string): void {
      helper.assertValueNotContains(
        target as Parameters<typeof helper.assertValueNotContains>[0],
        value
      )
    },

    assertEqual(target: Target, text: string): void {
      helper.assertEqual(
        target as Parameters<typeof helper.assertEqual>[0],
        text
      )
    },

    assertCount(target: Target, count: number): void {
      helper.assertCount(
        target as Parameters<typeof helper.assertCount>[0],
        count
      )
    },

    assertChecked(target: Target): void {
      helper.assertChecked(target as Parameters<typeof helper.assertChecked>[0])
    },

    assertNotChecked(target: Target): void {
      helper.assertNotChecked(
        target as Parameters<typeof helper.assertNotChecked>[0]
      )
    },

    assertEnabled(target: Target): void {
      helper.assertEnabled(target as Parameters<typeof helper.assertEnabled>[0])
    },

    assertDisabled(target: Target): void {
      helper.assertDisabled(
        target as Parameters<typeof helper.assertDisabled>[0]
      )
    },

    assertLookEnabled(target: Target): void {
      helper.assertLookEnabled(
        target as Parameters<typeof helper.assertLookEnabled>[0]
      )
    },

    assertLookDisabled(target: Target): void {
      helper.assertLookDisabled(
        target as Parameters<typeof helper.assertLookDisabled>[0]
      )
    },

    assertHasClass(target: Target, className: string): void {
      helper.assertHasClass(
        target as Parameters<typeof helper.assertHasClass>[0],
        className
      )
    },

    assertNotHasClass(target: Target, className: string): void {
      helper.assertNotHasClass(
        target as Parameters<typeof helper.assertNotHasClass>[0],
        className
      )
    },

    assertErrorHint(target: Target, text: string): void {
      helper.assertErrorHint(
        target as Parameters<typeof helper.assertErrorHint>[0],
        text
      )
    },

    assertNoErrorHint(target: Target): void {
      helper.assertNoErrorHint(
        target as Parameters<typeof helper.assertNoErrorHint>[0]
      )
    },

    assertMatchesPattern(target: Target, pattern: RegExp): void {
      helper.assertMatchesPattern(
        target as Parameters<typeof helper.assertMatchesPattern>[0],
        pattern
      )
    },

    // Utilities
    wait(ms: number): void {
      helper.wait(ms)
    },

    getText(target: Target): Cypress.Chainable<string> {
      return helper.getText(
        target as Parameters<typeof helper.getText>[0]
      ) as Cypress.Chainable<string>
    },

    t(key: string, options?: Record<string, unknown>): string {
      return helper.t(key, options)
    },

    clearLocalStorage(): void {
      cy.clearLocalStorage()
    },

    ensureHighlightTranslation(symbol: string): void {
      helper.ensureHighlightTranslation(symbol)
    },

    // Split button handling (for Quasar q-btn-dropdown with split)
    clickSplitButtonMain(target: Target): void {
      // For Cypress, click with 'left' position works for split buttons
      helper.click(target as Parameters<typeof helper.click>[0], 'left')
    },

    clickSplitButtonArrow(target: Target): void {
      // For Cypress, click with 'right' position opens the dropdown
      helper.click(target as Parameters<typeof helper.click>[0], 'right')
    },

    // Iteration
    forEach<T>(
      target: Target,
      items: T[],
      assertFn: (element: Locator, expected: T) => void
    ): void {
      helper.forEach(
        target as Parameters<typeof helper.forEach>[0],
        items,
        (element, expected) => {
          assertFn(element, expected)
        }
      )
    },

    each(
      target: Target,
      fn: (element: IterableElement, index: number) => void
    ): void {
      helper.each(target as Parameters<typeof helper.each>[0], ($el, index) => {
        const wrapped: IterableElement = {
          find: (selector: string) => cy.wrap($el).find(selector),
          raw: $el,
        }
        fn(wrapped, index)
      })
    },

    // Scoping
    within(target: Target, fn: (locator: Locator) => void): void {
      helper.within(target as Parameters<typeof helper.within>[0], () => {
        fn(helper.find(target as Parameters<typeof helper.find>[0]))
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
      return cy
    },
  }
}
