/**
 * Playwright runner for Settings Format Templates tests.
 *
 * This is a thin wrapper that runs the shared test specification
 * using the Playwright adapter. The adapter queues all operations
 * and this runner ensures they're drained after each test.
 */
import { test } from '@playwright/test'
import { setPage, setupFixtureRoutes } from './PlaywrightHelper'
import { createPlaywrightAPI } from '../adapter/PlaywrightAdapter'
import { settingsFormatTemplatesTests } from '../../shared/specs/settings-format-templates.spec'
import type { TestAPI, TestSpec } from '../../shared/api/types'

type PlaywrightAPI = TestAPI & { drain: () => Promise<void> }

let api: PlaywrightAPI

test.beforeEach(async ({ page }) => {
  setPage(page)
  api = createPlaywrightAPI(page)
  await setupFixtureRoutes(page)
})

/**
 * Register tests from a TestSpec for Playwright.
 * Handles draining the promise queue after each beforeEach and test.
 */
function registerPlaywrightTests(spec: TestSpec) {
  test.describe(spec.name, () => {
    // Register beforeEach if defined
    if (spec.beforeEach) {
      test.beforeEach(async () => {
        spec.beforeEach!(api)
        await api.drain()
      })
    }

    // Register individual tests
    for (const [testName, testFn] of Object.entries(spec.tests)) {
      test(testName, async () => {
        testFn(api)
        await api.drain()
      })
    }

    // Register nested suites
    if (spec.suites) {
      for (const [suiteName, suiteSpec] of Object.entries(spec.suites)) {
        registerPlaywrightNestedSuite({
          name: suiteName,
          ...suiteSpec,
        })
      }
    }
  })
}

function registerPlaywrightNestedSuite(spec: TestSpec) {
  test.describe(spec.name, () => {
    if (spec.beforeEach) {
      test.beforeEach(async () => {
        spec.beforeEach!(api)
        await api.drain()
      })
    }

    for (const [testName, testFn] of Object.entries(spec.tests)) {
      test(testName, async () => {
        testFn(api)
        await api.drain()
      })
    }

    if (spec.suites) {
      for (const [suiteName, suiteSpec] of Object.entries(spec.suites)) {
        registerPlaywrightNestedSuite({
          name: suiteName,
          ...suiteSpec,
        })
      }
    }
  })
}

registerPlaywrightTests(settingsFormatTemplatesTests)
