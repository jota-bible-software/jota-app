/**
 * Framework-agnostic test API interface.
 *
 * This interface provides a common API for writing E2E tests that can run
 * on both Cypress and Playwright. Each framework implements this interface
 * through an adapter.
 */

/** Represents a target element - can be a selector string or a framework-specific locator */
export type Target = string | NestedTarget | unknown

/** Represents a nested target with a head and tail selectors */
export interface NestedTarget {
  head: string | unknown
  tail: string[]
}

/** Click position types */
export type PositionType =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'left'
  | 'center'
  | 'right'
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight'

/** Framework-agnostic locator type - returned by find/first/last methods */
export type Locator = unknown

/** Wrapper for elements in iteration callbacks - provides consistent find() method */
export interface IterableElement {
  /** Find a child element within this element */
  find(selector: string): Locator
  /** The underlying framework-specific element */
  raw: unknown
}

/**
 * Return type for methods that can be sync (Cypress) or async (Playwright).
 * For Cypress: methods return void (commands are queued)
 * For Playwright: methods return Promise<void> (actual async operations)
 */
export type MaybePromise<T> = T | Promise<T>

export interface TestAPI {
  // Navigation
  navigate(url: string): MaybePromise<void>

  // Selectors
  tag(name: string): string
  find(target: Target): Locator
  nested(head: string | Locator, ...tail: string[]): NestedTarget
  first(target: Target): Locator
  nth(target: Target, position: number): Locator
  second(target: Target): Locator
  third(target: Target): Locator
  last(target: Target): Locator
  visible(target: Target): Locator
  containsText(text: string): Locator
  errorHint(target: Target): Locator

  // Page info
  title(): MaybePromise<string>

  // Actions
  click(target: Target, position?: PositionType): MaybePromise<void>
  forceClick(target: Target): MaybePromise<void>
  type(target: Target, text: string, replace?: boolean): MaybePromise<void>
  select(target: Target, value: string): MaybePromise<void>
  pressKey(key: string): MaybePromise<void>
  focusOn(target: Target): MaybePromise<void>
  setCaret(target: Target): MaybePromise<void>

  // Clipboard
  mockClipboard(): MaybePromise<void>
  assertClipboard(text: string): MaybePromise<void>

  // Dialog actions
  clickDialogYes(): MaybePromise<void>
  clickDialogNo(): MaybePromise<void>

  // Tooltip
  tooltip(target: Target): MaybePromise<Locator>

  // Assertions
  assertShowing(
    target: Target,
    options?: { timeout?: number }
  ): MaybePromise<void>
  assertNotShowing(
    target: Target,
    options?: { timeout?: number }
  ): MaybePromise<void>
  assertExists(target: Target): MaybePromise<void>
  assertNotExists(target: Target): MaybePromise<void>
  assertText(target: Target, text: string): MaybePromise<void>
  assertTextContains(target: Target, text: string): MaybePromise<void>
  assertTextNotContains(target: Target, text: string): MaybePromise<void>
  assertHtmlContains(target: Target, htmlFragment: string): MaybePromise<void>
  assertHtmlNotContains(
    target: Target,
    htmlFragment: string
  ): MaybePromise<void>
  assertValue(target: Target, text: string): MaybePromise<void>
  assertValueContains(target: Target, value: string): MaybePromise<void>
  assertValueNotContains(target: Target, value: string): MaybePromise<void>
  assertEqual(
    target: Target | MaybePromise<string>,
    text: string
  ): MaybePromise<void>
  assertCount(target: Target, count: number): MaybePromise<void>
  assertChecked(target: Target): MaybePromise<void>
  assertNotChecked(target: Target): MaybePromise<void>
  assertEnabled(target: Target): MaybePromise<void>
  assertDisabled(target: Target): MaybePromise<void>
  assertLookEnabled(target: Target): MaybePromise<void>
  assertLookDisabled(target: Target): MaybePromise<void>
  assertHasClass(target: Target, className: string): MaybePromise<void>
  assertNotHasClass(target: Target, className: string): MaybePromise<void>
  assertErrorHint(target: Target, text: string): MaybePromise<void>
  assertNoErrorHint(target: Target): MaybePromise<void>
  assertMatchesPattern(target: Target, pattern: RegExp): MaybePromise<void>

  // Tooltip - returns void for queueing, shows tooltip on hover
  tooltip(target: Target): MaybePromise<Locator>

  // Utilities
  wait(ms: number): MaybePromise<void>
  getText(target: Target): MaybePromise<string>
  t(key: string, options?: Record<string, unknown>): string
  clearLocalStorage(): MaybePromise<void>

  // Highlight-specific helpers
  ensureHighlightTranslation(symbol: string): MaybePromise<void>

  // Split button handling (for Quasar q-btn-dropdown with split)
  clickSplitButtonMain(target: Target): MaybePromise<void>
  clickSplitButtonArrow(target: Target): MaybePromise<void>

  // Iteration
  forEach<T>(
    target: Target,
    items: T[],
    assertFn: (element: Locator, expected: T) => MaybePromise<void>
  ): MaybePromise<void>
  each(
    target: Target,
    fn: (element: IterableElement, index: number) => MaybePromise<void>
  ): MaybePromise<void>

  // Scoping
  within(
    target: Target,
    fn: (locator: Locator) => MaybePromise<void>
  ): MaybePromise<void>
  dialog(): Locator
  notification(): Locator
  focused(): Locator

  // Escape hatch for framework-specific code
  getPage(): unknown
}

/**
 * Test specification structure for shared tests.
 * Supports nested suites and beforeEach hooks at each level.
 */
export interface TestSpec {
  name: string
  beforeEach?: (api: TestAPI) => MaybePromise<void>
  tests: Record<string, (api: TestAPI) => MaybePromise<void>>
  suites?: Record<string, Omit<TestSpec, 'name'>>
}
