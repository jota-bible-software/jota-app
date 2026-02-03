import type { TestAPI, TestSpec } from './api/types'

/**
 * Type for the describe function - works for both Cypress and Playwright.
 * For Playwright: test.describe
 * For Cypress: describe
 */
export type DescribeFn = (name: string, fn: () => void) => void

/**
 * Type for the test/it function - works for both Cypress and Playwright.
 * For Playwright: test
 * For Cypress: it
 */
export type TestFn = (name: string, fn: () => void | Promise<void>) => void

/**
 * Type for the beforeEach function.
 */
export type BeforeEachFn = (fn: () => void | Promise<void>) => void

/**
 * Options for registerTests
 */
export interface RegisterTestsOptions {
  /**
   * Set to true for Cypress tests.
   * Cypress doesn't work well with async/await in test callbacks,
   * so we need to call test functions without awaiting them.
   */
  isSync?: boolean
}

/**
 * Registers tests from a shared TestSpec for either Cypress or Playwright.
 *
 * @param spec - The test specification containing tests and nested suites
 * @param getApi - Function that returns the TestAPI instance (called fresh for each test)
 * @param describeFn - The describe function from the test framework
 * @param testFn - The test/it function from the test framework
 * @param beforeEachFn - The beforeEach function from the test framework
 * @param options - Configuration options (e.g., isSync for Cypress)
 */
export function registerTests(
  spec: TestSpec,
  getApi: () => TestAPI,
  describeFn: DescribeFn,
  testFn: TestFn,
  beforeEachFn: BeforeEachFn,
  options: RegisterTestsOptions = {}
): void {
  const { isSync = false } = options

  describeFn(spec.name, () => {
    // Register beforeEach if we have any hooks
    if (spec.beforeEach) {
      if (isSync) {
        // For Cypress: don't use async/await
        beforeEachFn(() => {
          const api = getApi()
          spec.beforeEach!(api)
        })
      } else {
        // For Playwright: use async/await
        beforeEachFn(async () => {
          const api = getApi()
          await spec.beforeEach!(api)
        })
      }
    }

    // Register individual tests
    for (const [testName, testFn_] of Object.entries(spec.tests)) {
      if (isSync) {
        // For Cypress: don't use async/await
        testFn(testName, () => {
          const api = getApi()
          testFn_(api)
        })
      } else {
        // For Playwright: use async/await
        testFn(testName, async () => {
          const api = getApi()
          await testFn_(api)
        })
      }
    }

    // Register nested suites
    if (spec.suites) {
      for (const [suiteName, suiteSpec] of Object.entries(spec.suites)) {
        // Create a full TestSpec from the partial suite spec
        const fullSuiteSpec: TestSpec = {
          name: suiteName,
          ...suiteSpec,
        }

        registerNestedSuite(
          fullSuiteSpec,
          getApi,
          describeFn,
          testFn,
          beforeEachFn,
          isSync
        )
      }
    }
  })
}

/**
 * Registers a nested suite (internal helper).
 * Nested suites only run their own beforeEach, not accumulated parent hooks,
 * because the outer beforeEach already runs due to test framework behavior.
 */
function registerNestedSuite(
  spec: TestSpec,
  getApi: () => TestAPI,
  describeFn: DescribeFn,
  testFn: TestFn,
  beforeEachFn: BeforeEachFn,
  isSync: boolean
): void {
  describeFn(spec.name, () => {
    // Register suite's own beforeEach
    if (spec.beforeEach) {
      if (isSync) {
        beforeEachFn(() => {
          const api = getApi()
          spec.beforeEach!(api)
        })
      } else {
        beforeEachFn(async () => {
          const api = getApi()
          await spec.beforeEach!(api)
        })
      }
    }

    // Register individual tests
    for (const [testName, testFn_] of Object.entries(spec.tests)) {
      if (isSync) {
        testFn(testName, () => {
          const api = getApi()
          testFn_(api)
        })
      } else {
        testFn(testName, async () => {
          const api = getApi()
          await testFn_(api)
        })
      }
    }

    // Register nested suites recursively
    if (spec.suites) {
      for (const [suiteName, suiteSpec] of Object.entries(spec.suites)) {
        const fullSuiteSpec: TestSpec = {
          name: suiteName,
          ...suiteSpec,
        }
        registerNestedSuite(
          fullSuiteSpec,
          getApi,
          describeFn,
          testFn,
          beforeEachFn,
          isSync
        )
      }
    }
  })
}
