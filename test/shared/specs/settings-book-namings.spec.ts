/**
 * Shared test specification for Settings Book Namings.
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
const bookNames = (api: TestAPI) => api.tag(tags.settingsPageBookNames)
const appNaming = (api: TestAPI) => api.tag(tags.settingsBookNamingInApp)
const items = (api: TestAPI) => api.tag(tags.settingsBookNamingItem)
const itemNames = (api: TestAPI) => api.tag(tags.settingsBookNamingItemName)
const itemBooks = (api: TestAPI) => api.tag(tags.settingsBookNamingItemBooks)
const editButton = (api: TestAPI) =>
  api.tag(tags.settingsBookNamingItemEditButton)
const editName = (api: TestAPI) => api.tag(tags.settingsBookNamingItemEditName)
const editBooks = (api: TestAPI) =>
  api.tag(tags.settingsBookNamingItemEditBooks)
const saveButton = (api: TestAPI) =>
  api.tag(tags.settingsBookNamingItemSaveButton)
const cancelButton = (api: TestAPI) =>
  api.tag(tags.settingsBookNamingItemCancelButton)
const removeButton = (api: TestAPI) =>
  api.tag(tags.settingsBookNamingItemRemoveButton)
const addItemName = (api: TestAPI) => api.tag(tags.settingsBookNamingAddName)
const addItemBooks = (api: TestAPI) =>
  api.tag(tags.settingsBookNamingAddBookNames)
const addItemButton = (api: TestAPI) =>
  api.tag(tags.settingsBookNamingAddButton)
const localeFilter = (api: TestAPI) => api.tag(tags.settingsLocaleFilter)

const itemNameValues = ['OSIS abbreviations', 'SBL abbreviations', 'Standard']

export const settingsBookNamingsTests: TestSpec = {
  name: 'Settings',

  beforeEach: (api) => {
    api.navigate('/settings')
  },

  tests: {},

  suites: {
    'Book names': {
      tests: {},

      suites: {
        'Settings Book Namings': {
          beforeEach: (api) => {
            api.click(bookNames(api))
          },

          tests: {
            'should show book names': (api) => {
              api.assertCount(items(api), 3)
              api.assertText(api.last(itemNames(api)), itemNameValues[2])
              api.forEach(
                itemNames(api),
                itemNameValues,
                (element, expected) => {
                  api.assertText(element, expected)
                  api.assertShowing(element)
                }
              )
            },

            'should edit book names': (api) => {
              const booksTestText = 'bbb'

              api.assertCount(editName(api), 0)
              api.assertShowing(api.last(editButton(api)))
              api.assertNotShowing(editName(api))

              api.click(api.last(editButton(api)))
              api.assertShowing(api.last(editName(api)))
              api.assertShowing(api.last(editBooks(api)))
              api.assertCount(editName(api), 1)

              api.type(api.last(editName(api)), 'a', true)
              api.assertValue(api.last(editName(api)), 'a')

              api.type(api.last(editBooks(api)), booksTestText)
              api.assertValueContains(editBooks(api), booksTestText)

              api.click(api.last(saveButton(api)))
              // The list should be sorted
              api.assertText(api.first(itemNames(api)), 'a')

              // Edit should be preserved after page reload
              api.navigate('/settings')
              api.click(bookNames(api))
              api.assertText(api.first(itemNames(api)), 'a')

              // Change it back
              api.click(api.first(editButton(api)))
              api.type(api.first(editName(api)), 'Standard', true)
              api.type(
                api.first(editBooks(api)),
                '{backspace}'.repeat(booksTestText.length)
              )
              api.click(api.first(saveButton(api)))
              api.assertText(api.last(itemNames(api)), 'Standard')
              api.assertTextNotContains(api.last(itemBooks(api)), booksTestText)
            },

            'should validate book names when editing': (api) => {
              api.click(api.last(editButton(api)))
              api.assertNoErrorHint(editName(api))
              api.assertNoErrorHint(editBooks(api))
              api.type(editName(api), '', true)
              api.type(editBooks(api), '', true)
              api.assertText(
                api.errorHint(editName(api)),
                api.t('settingsBookNames.nameCannotBeEmpty')
              )
              api.assertText(
                api.errorHint(editBooks(api)),
                api.t('settingsBookNames.bookListCannotBeEmpty')
              )

              // Asset the save did not submit and close the form
              api.click(api.last(saveButton(api)))
              api.assertShowing(api.last(saveButton(api)))

              // Should cancel the edit - use forceClick for Quasar buttons with validation errors
              api.forceClick(api.last(cancelButton(api)))
              api.assertNotShowing(saveButton(api), { timeout: 10000 })
            },

            'should validate book names when adding': (api) => {
              api.assertNoErrorHint(addItemName(api))
              api.assertNoErrorHint(addItemBooks(api))
              api.click(addItemName(api))
              api.click(addItemBooks(api))
              api.click(addItemName(api))
              api.assertText(
                api.errorHint(addItemName(api)),
                api.t('settingsBookNames.nameCannotBeEmpty')
              )
              api.assertText(
                api.errorHint(addItemBooks(api)),
                api.t('settingsBookNames.bookListCannotBeEmpty')
              )

              api.type(addItemBooks(api), 'a')
              // The error is not cleared from the previous check
              api.assertTextContains(
                api.errorHint(addItemBooks(api)),
                api.t('settingsBookNames.bookCountError', {
                  count: 1,
                  books: api.t('settingsBookNames.book'),
                })
              )

              // Should not add invalid data
              api.click(addItemName(api))
              api.assertCount(items(api), 3)

              // Fix the data and add
              api.type(addItemName(api), 'a')
              api.type(
                addItemBooks(api),
                '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73',
                true
              )

              // Without that blur on the edited input would not happen beforehand
              api.focusOn(addItemButton(api))
              api.click(addItemButton(api))

              api.assertCount(items(api), 4)
              api.assertText(api.first(itemNames(api)), 'a')

              api.assertNoErrorHint(addItemName(api))
              api.assertNoErrorHint(addItemBooks(api))

              // Remove the new item
              api.click(api.first(editButton(api)))
              api.click(removeButton(api))
              api.assertCount(items(api), 3)
            },

            'should not remove when selected as app naming': (api) => {
              api.assertText(appNaming(api), 'SBL abbreviations')
              api.click(api.nth(editButton(api), 2))
              api.assertDisabled(removeButton(api))
              api.tooltip(removeButton(api))
              api.assertText(
                '.q-tooltip',
                api.t('settingsBookNames.removeTooltipAppBookNaming')
              )
            },

            'should not remove when used in a copy template': (api) => {
              api.click(api.last(editButton(api)))
              api.assertDisabled(removeButton(api))

              api.tooltip(removeButton(api))
              api.assertText(
                '.q-tooltip',
                api.t('settingsBookNames.removeTooltipCopyTemplate', {
                  templateName: 'Presentation',
                  locale: 'en-US',
                })
              )
            },

            'should show items for the selected locale': (api) => {
              api.select(localeFilter(api), 'Polski')
              api.assertShowing(api.containsText('EIB skrócone'))
            },
          },
        },
      },
    },
  },
}
