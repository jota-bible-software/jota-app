/**
 * Shared test specification for Settings Translations.
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
const translationsPanel = (api: TestAPI) =>
  api.tag(tags.settingsPageTranslations)
const generalPanel = (api: TestAPI) => api.tag(tags.settingsPageGeneral)
const localeSelector = (api: TestAPI) => api.tag(tags.settingsLocaleSelector)
const translationGroups = (api: TestAPI) =>
  api.tag(tags.settingsTranslationGroup)
const translationGroupHeader = (api: TestAPI) =>
  api.tag(tags.settingsTranslationGroupHeader)
const translationItems = (api: TestAPI) => api.tag(tags.settingsTranslationItem)
const translationItemToggle = (api: TestAPI) =>
  api.tag(tags.settingsTranslationItemToggle)
const translationToggle = (api: TestAPI) =>
  api.tag(tags.settingsTranslationGroupToggle)
const translationDefaultSelector = (api: TestAPI) =>
  api.tag(tags.settingsTranslationDefault)
const translationLocale = (api: TestAPI) =>
  api.tag(tags.settingsTranslationsLocale)
const allSelectedCount = (api: TestAPI) =>
  api.tag(tags.settingsTranslationsAllSelected)
const groupSelectedCount = (api: TestAPI) =>
  api.tag(tags.settingsTranslationGroupSelected)
const flagIcon = (api: TestAPI) => api.tag(tags.settingsTranslationGroupFlag)
const translationSelector = (api: TestAPI) => api.tag(tags.translationSelector)
const translationSelectorItem = (api: TestAPI) =>
  api.tag(tags.translationSelectorItem)
const pageBackButton = (api: TestAPI) => api.tag(tags.pageBackButton)

export const settingsTranslationsTests: TestSpec = {
  name: 'Settings Translations',

  beforeEach: (api) => {
    api.navigate('/settings')
    api.click(translationsPanel(api))
  },

  tests: {
    'should display translations panel correctly': (api) => {
      api.assertShowing(translationsPanel(api))
      // Check for panel title - use the specific panel title tag
      api.assertTextContains(
        api.tag(tags.settingsPanelTitle),
        api.t('settingsTranslations.title')
      )
    },
  },

  suites: {
    'Translation Groups': {
      tests: {
        'should display language groups correctly': (api) => {
          // Verify multiple language groups exist
          api.assertCount(translationGroups(api), 3) // English, Polish, and Portuguese

          // Check first group (English)
          const enGroup = api.first(translationGroups(api))
          api.assertShowing(enGroup)
          api.assertText(api.first(translationLocale(api)), 'en-US')

          // Verify flag icon is present
          api.assertShowing(api.first(flagIcon(api)))
          api.assertShowing(api.last(flagIcon(api)))
        },

        'should expand groups': (api) => {
          // Initially, only the first group (en-US) is expanded
          // Verify at least one item is visible from the expanded group
          api.assertShowing(api.first(translationItems(api)))

          // Click first group header to collapse it
          api.click(api.first(translationGroupHeader(api)))

          // Now the first group should be collapsed and its items hidden
          api.assertNotShowing(translationItems(api))

          // Click first group header again to expand it
          api.click(api.first(translationGroupHeader(api)))

          // Items should be visible again
          api.assertShowing(api.first(translationItems(api)))
        },

        'should show selected translations count for each group': (api) => {
          api.assertText(api.first(groupSelectedCount(api)), '2 / 3')
          api.assertText(api.second(groupSelectedCount(api)), '3 / 4')
          api.assertText(api.last(groupSelectedCount(api)), '1 / 1')
        },

        'should toggle all translations in a group': (api) => {
          api.tooltip(api.first(translationToggle(api)))
          api.assertText(
            '.q-tooltip',
            api.t('settingsTranslations.selectAll') + ' en-US'
          )
          api.click(api.first(translationToggle(api)))

          api.assertText(api.first(groupSelectedCount(api)), '3 / 3')
          api.click(api.first(translationToggle(api)))
          api.assertText(api.first(groupSelectedCount(api)), '0 / 3')
          api.assertText(api.first(translationDefaultSelector(api)), '')

          // The second group can be fully deselected because pt-BR has a selected translation
          api.assertText(api.second(groupSelectedCount(api)), '3 / 4')
          api.click(api.second(translationToggle(api)))
          api.assertText(api.second(groupSelectedCount(api)), '4 / 4')
          api.click(api.second(translationToggle(api)))
          api.assertText(api.second(groupSelectedCount(api)), '0 / 4')
        },
      },
    },

    'Individual Translations': {
      tests: {
        'should list translations within each group': (api) => {
          api.assertCount(
            api.nested(
              api.first(translationGroups(api)),
              translationItems(api)
            ),
            3
          )
          api.assertCount(
            api.nested(
              api.second(translationGroups(api)),
              translationItems(api)
            ),
            4
          )
          api.assertCount(
            api.nested(api.last(translationGroups(api)), translationItems(api)),
            1
          )
        },

        'should display translation details correctly': (api) => {
          api.assertShowing(api.first(translationItems(api)))
          api.assertTextContains(
            api.first(translationItems(api)),
            'King James Version'
          )
          api.assertTextContains(api.first(translationItems(api)), 'KJV')
        },

        'should allow selecting individual translations': (api) => {
          api.click(api.second(translationItemToggle(api)))
          api.assertChecked(api.second(translationItemToggle(api)))
          api.assertText(api.first(groupSelectedCount(api)), '3 / 3')

          // The main bible selector should be affected by the selection
          api.navigate('/')
          // Wait for the translation to load
          api.assertShowing(api.visible(translationSelector(api)), {
            timeout: 20000,
          })
          api.click(api.visible(translationSelector(api)))
          api.assertCount(translationSelectorItem(api), 7)
        },
      },
    },

    'Default Translation Selection': {
      tests: {
        'should include empty option in default translation selector': (
          api
        ) => {
          api.assertShowing(api.first(translationDefaultSelector(api)))
          api.click(api.first(translationDefaultSelector(api)))
          api.assertText(api.first(translationSelectorItem(api)), '')
        },

        'should allow setting no default translation': (api) => {
          api.select(api.first(translationDefaultSelector(api)), '')
          api.assertText(api.first(translationDefaultSelector(api)), '')
        },

        'should change the default translation when locale is changed': (
          api
        ) => {
          api.click(generalPanel(api))
          api.select(localeSelector(api), 'Polski')
          api.click(pageBackButton(api))
          api.assertTextContains(translationSelector(api), 'UBG')
        },

        'changing the default translation should affect the bible selector': (
          api
        ) => {
          api.select(api.first(translationDefaultSelector(api)), 'NIV')
          api.click(pageBackButton(api))
          api.assertTextContains(translationSelector(api), 'NIV')
          api.navigate('/')
          // Wait for the translation to load
          api.assertShowing(translationSelector(api), { timeout: 20000 })
          api.assertTextContains(translationSelector(api), 'NIV')
          api.navigate('/settings')
          api.click(translationsPanel(api))
          api.select(api.first(translationDefaultSelector(api)), 'KJV')
        },
      },
    },

    'Total Selection Count': {
      tests: {
        'should show correct total selected translations count': (api) => {
          // Verify format of total selected count
          api.assertText(allSelectedCount(api), '6 / 8')

          // Toggle one and verify total updates
          api.click(api.second(translationItemToggle(api)))
          api.assertText(allSelectedCount(api), '7 / 8')
        },
      },
    },

    Persistence: {
      tests: {
        'should persist selections after page reload': (api) => {
          api.assertChecked(api.first(translationItemToggle(api)))
          api.click(api.first(translationItemToggle(api)))
          // Reload page
          api.navigate('/settings')
          api.click(translationsPanel(api))
          api.assertNotChecked(api.first(translationItemToggle(api)))
        },

        'should persist default translation selection': (api) => {
          api.select(api.first(translationDefaultSelector(api)), 'NIV')
          // Reload page
          api.navigate('/settings')
          api.click(translationsPanel(api))
          api.assertText(api.first(translationDefaultSelector(api)), 'NIV')
        },

        'should persist empty selection after page reload': (api) => {
          api.select(api.first(translationDefaultSelector(api)), '')

          // Reload page
          api.navigate('/settings')
          api.click(translationsPanel(api))

          api.assertText(api.first(translationDefaultSelector(api)), '')
        },
      },
    },
  },
}
