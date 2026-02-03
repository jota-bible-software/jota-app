/**
 * Shared test specification for Highlights.
 *
 * This file contains the test logic that runs on both Cypress and Playwright.
 * Each test receives a TestAPI instance that provides a unified interface.
 *
 * IMPORTANT: Test functions should NOT be async. They should just call
 * the API methods directly. The framework adapters and runners handle
 * the sync/async nature appropriately for each framework.
 */
import type { TestAPI, TestSpec } from '../api/types'
import * as tags from '../../../src/tags'

// Helper functions for selectors
const settingsPageHighlights = (api: TestAPI) =>
  api.tag(tags.settingsPageHighlights)
const settingsPanelHighlights = () => '[data-tag="settingsPanel-highlights"]'
const settingsPanelTitle = (api: TestAPI) => api.tag(tags.settingsPanelTitle)
const translationSelector = (api: TestAPI) => api.tag(tags.translationSelector)
const highlightsAddButton = (api: TestAPI) =>
  api.tag(tags.settingsHighlightsAddButton)
const highlightsTranslationsList = (api: TestAPI) =>
  api.tag(tags.settingsHighlightsTranslationsList)
const highlightsTranslationItem = (api: TestAPI) =>
  api.tag(tags.settingsHighlightsTranslationItem)
const highlightsTranslationBadge = (api: TestAPI) =>
  api.tag(tags.settingsHighlightsTranslationBadge)
const highlightsTranslationDelete = (api: TestAPI) =>
  api.tag(tags.settingsHighlightsTranslationDelete)
const highlightsTranslationSymbol = (api: TestAPI) =>
  api.tag(tags.settingsHighlightsTranslationSymbol)
const highlightsTranslationTitle = (api: TestAPI) =>
  api.tag(tags.settingsHighlightsTranslationTitle)
const settingsPageTranslations = (api: TestAPI) =>
  api.tag(tags.settingsPageTranslations)
const settingsTranslationItem = (api: TestAPI) =>
  api.tag(tags.settingsTranslationItem)
const verseElement = (api: TestAPI) => api.tag(tags.chapterVerse)
const highlightButtonDropdown = (api: TestAPI) =>
  api.tag(tags.highlightButtonDropdown)
const highlightColorSwatch = (api: TestAPI) =>
  api.tag(tags.highlightColorSwatch)
const highlightColorItem = (api: TestAPI) => api.tag(tags.highlightColorItem)

export const highlightsTests: TestSpec = {
  name: 'Highlights',

  beforeEach: (api) => {
    api.navigate('/')
  },

  tests: {
    'should navigate to highlights settings': (api) => {
      api.navigate('/settings')
      api.click(settingsPageHighlights(api))
      api.assertShowing(settingsPanelHighlights())
      api.assertTextContains(settingsPanelTitle(api), 'Highlights')
    },

    'should add a translation for highlights': (api) => {
      api.navigate('/settings')
      api.click(settingsPageHighlights(api))
      api.assertTextContains(settingsPanelTitle(api), 'Highlights')

      api.assertShowing(translationSelector(api))
      api.assertShowing(highlightsAddButton(api))

      api.select(translationSelector(api), 'UBG')
      api.click(highlightsAddButton(api))

      api.assertShowing(api.notification())
      api.assertTextContains(api.notification(), 'added')
    },

    'should display translations with highlight counts': (api) => {
      api.navigate('/settings')
      api.click(settingsPageHighlights(api))
      api.assertText(settingsPanelTitle(api), 'Highlights')

      // Ensure at least one translation is added
      api.ensureHighlightTranslation('UBG')

      // Check if list of translations with highlights is displayed
      api.assertShowing(highlightsTranslationsList(api))

      // Verify first item has flag, symbol, title, and badge
      // Note: Don't reuse locators in Cypress - each call must be fresh
      const item = () => api.first(highlightsTranslationItem(api))
      api.assertExists(api.nested(item(), '.fi'))
      api.assertShowing(api.nested(item(), highlightsTranslationSymbol(api)))
      api.assertShowing(api.nested(item(), highlightsTranslationTitle(api)))
      api.assertShowing(api.nested(item(), highlightsTranslationBadge(api)))
    },

    'should remove a translation from highlights with confirmation': (api) => {
      api.navigate('/settings')
      api.click(settingsPageHighlights(api))
      api.assertTextContains(settingsPanelTitle(api), 'Highlights')

      // Ensure at least one translation is added
      api.ensureHighlightTranslation('UBG')

      // Find and click delete button for first translation
      const item = () => api.first(highlightsTranslationItem(api))
      api.click(api.nested(item(), highlightsTranslationDelete(api)))

      // Confirm deletion in dialog
      api.assertShowing(api.dialog())
      api.assertTextContains(api.dialog(), 'Remove translation highlights')
      api.clickDialogYes()

      // Verify success notification
      api.assertShowing(api.notification())
      api.assertTextContains(api.notification(), 'removed')
    },

    'should prevent adding already enabled translation': (api) => {
      api.navigate('/settings')
      api.click(settingsPageHighlights(api))
      api.assertTextContains(settingsPanelTitle(api), 'Highlights')

      // First, ensure UBG is added
      api.ensureHighlightTranslation('UBG')

      // Try to add UBG again
      api.select(translationSelector(api), 'UBG')
      api.click(highlightsAddButton(api))

      // Verify info notification about already enabled
      api.assertShowing(api.notification())
      api.assertTextContains(api.notification(), 'already enabled')
    },

    'should display highlight count badge for each translation': (api) => {
      api.navigate('/settings')
      api.click(settingsPageHighlights(api))
      api.assertTextContains(settingsPanelTitle(api), 'Highlights')

      // Ensure at least one translation is added
      api.ensureHighlightTranslation('UBG')

      // Verify each translation has a badge with a number
      api.each(highlightsTranslationItem(api), (item) => {
        api.assertExists(item.find(highlightsTranslationBadge(api)))
        api.assertMatchesPattern(
          item.find(highlightsTranslationBadge(api)),
          /^\d+$/
        )
      })
    },

    'should disable add button when no translation selected': (api) => {
      api.navigate('/settings')
      api.click(settingsPageHighlights(api))
      api.assertTextContains(settingsPanelTitle(api), 'Highlights')

      // Select empty option
      api.select(translationSelector(api), '')

      api.assertDisabled(highlightsAddButton(api))
    },

    'should show confirmation dialog before removal': (api) => {
      api.navigate('/settings')
      api.click(settingsPageHighlights(api))
      api.assertTextContains(settingsPanelTitle(api), 'Highlights')

      // Ensure at least one translation is added
      api.ensureHighlightTranslation('UBG')

      // Click delete on first translation
      const item = () => api.first(highlightsTranslationItem(api))
      api.click(api.nested(item(), highlightsTranslationDelete(api)))

      // Verify dialog shows
      api.assertShowing(api.dialog())
      api.assertTextContains(api.dialog(), 'Remove translation highlights')

      // Cancel the dialog
      api.clickDialogNo()
      api.assertNotExists(api.dialog())
    },

    'should integrate with settings translations page': (api) => {
      api.navigate('/settings')
      api.click(settingsPageTranslations(api))
      api.assertTextContains(settingsPanelTitle(api), 'Translations')

      // Verify highlight toggles are NOT present in translations settings
      const item = () => api.first(settingsTranslationItem(api))
      api.assertNotExists(api.nested(item(), 'q-toggle'))
      api.assertNotExists(api.nested(item(), '.highlight-toggle-section'))
    },
  },

  suites: {
    'Verse Highlighting': {
      beforeEach: (api) => {
        // Setup: ensure highlighting is enabled for KJV
        api.navigate('/settings')
        api.click(settingsPageHighlights(api))
        api.ensureHighlightTranslation('KJV')

        // Go to home
        api.navigate('/')

        // Search and select a verse
        api.type('input[type="text"]', 'Gen 1')
        api.pressKey('Enter')
        api.wait(500)
      },

      tests: {
        'should show highlight button when verse is selected': (api) => {
          api.setCaret(api.first(verseElement(api)))
          api.assertShowing(highlightColorSwatch(api))
        },

        'should toggle verse highlighting': (api) => {
          api.setCaret(api.first(verseElement(api)))

          // Click to apply highlight
          api.click(highlightButtonDropdown(api))
          api.wait(100)
          api.click(api.first(highlightColorItem(api)))
          api.wait(500)

          // Verify highlight is applied
          api.assertExists(
            verseElement(api) +
              '.verse-highlighted, ' +
              verseElement(api) +
              '[style*="--highlight-color"]'
          )

          // Click again to toggle off
          api.click(highlightButtonDropdown(api))
          api.wait(100)
          api.click(api.first(highlightColorItem(api)))
          api.wait(300)

          // Verify highlight is removed
          api.assertNotHasClass(
            api.first(verseElement(api)),
            'verse-highlighted'
          )
        },

        'should allow selecting different highlight colors': (api) => {
          api.setCaret(api.first(verseElement(api)))

          // Open color picker dropdown
          api.clickSplitButtonArrow(highlightButtonDropdown(api))

          // Verify color options are shown (at least 1)
          api.assertShowing(api.first(highlightColorItem(api)))

          // Select a color
          api.click(api.first(highlightColorItem(api)))

          // Verify highlight is applied
          api.wait(300)
          api.assertExists(
            verseElement(api) +
              '.verse-highlighted, ' +
              verseElement(api) +
              '[style*="--highlight-color"]'
          )
        },
      },
    },
  },
}
