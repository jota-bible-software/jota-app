/**
 * Shared test specification for Settings Format Templates.
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

const formatTemplatesPanel = (api: TestAPI) =>
  api.tag(tags.settingsPageFormatTemplates)
const copyTemplatesPanel = (api: TestAPI) =>
  api.tag(tags.settingsPageCopyTemplates)
const settingsPanelTitle = (api: TestAPI) => api.tag(tags.settingsPanelTitle)
const itemName = (api: TestAPI) => api.tag(tags.settingsFormatTemplatesItemName)
const addButton = (api: TestAPI) => api.tag(tags.settingsFormatTemplatesAdd)
const nameField = (api: TestAPI) => api.tag(tags.settingsFormatTemplateName)
const refPositionBefore = (api: TestAPI) =>
  api.tag(tags.settingsFormatTemplateRefPositionBefore)
const withNumbers = (api: TestAPI) =>
  api.tag(tags.settingsFormatTemplateWithNumbers)
const verseNewLine = (api: TestAPI) =>
  api.tag(tags.settingsFormatTemplateVerseNewLine)
const separatorChar = (api: TestAPI) =>
  api.tag(tags.settingsFormatTemplateSeparatorChar)
const rangeChar = (api: TestAPI) =>
  api.tag(tags.settingsFormatTemplateRangeChar)
const saveButton = (api: TestAPI) => api.tag(tags.settingsFormatTemplateSave)
const cancelButton = (api: TestAPI) =>
  api.tag(tags.settingsFormatTemplateCancel)
const removeButton = (api: TestAPI) =>
  api.tag(tags.settingsFormatTemplateRemove)
const copyTemplateItemName = (api: TestAPI) =>
  api.tag(tags.settingsCopyTemplatesItemName)
const formatField = (api: TestAPI) => api.tag(tags.settingsCopyTemplatesFormat)

const newFormatName = 'aaa'
const initialCount = 7

export const settingsFormatTemplatesTests: TestSpec = {
  name: 'Settings Format Templates',

  beforeEach: (api) => {
    api.navigate('/settings')
    api.click(formatTemplatesPanel(api))
  },

  tests: {
    'should display format templates panel correctly': (api) => {
      api.assertCount(itemName(api), initialCount)
      api.assertShowing(api.first(itemName(api)))
    },
  },

  suites: {
    'Adding a New Format Template': {
      tests: {
        'should open add format template form': (api) => {
          api.click(addButton(api))
          api.assertText(
            settingsPanelTitle(api),
            api.t('settingsFormatTemplates.editTitle')
          )
          api.assertShowing(nameField(api))
        },

        'should validate template name': (api) => {
          api.click(addButton(api))

          // Try to save without a name
          api.type(nameField(api), '')
          api.click(saveButton(api))
          api.assertText(
            api.errorHint(nameField(api)),
            api.t('settingsFormatTemplates.nameCannotBeEmpty')
          )

          // Try to add a template with an existing name
          api.type(nameField(api), 'App format')
          api.click(saveButton(api))
          api.assertText(
            api.errorHint(nameField(api)),
            api.t('settingsFormatTemplates.nameAlreadyExists')
          )
        },

        'should create a new format template': (api) => {
          api.click(addButton(api))

          // Add a unique template name
          api.type(nameField(api), newFormatName)

          // Configure template settings
          api.click(api.first(refPositionBefore(api)))
          api.click(withNumbers(api))
          api.click(verseNewLine(api))
          api.type(separatorChar(api), '.', true)
          api.type(rangeChar(api), '—', true)

          // Save the template
          api.click(saveButton(api))

          // Verify the new template is in the list
          api.assertCount(itemName(api), initialCount + 1)
          // Should be sorted and come first
          api.assertText(api.first(itemName(api)), newFormatName)
        },

        'should cancel the adding': (api) => {
          api.click(api.first(itemName(api)))
          api.click(cancelButton(api))
          api.assertCount(itemName(api), initialCount)
          api.assertShowing(api.first(itemName(api)))
        },
      },
    },

    'Editing Existing Format Template': {
      tests: {
        'should open edit form for an existing template': (api) => {
          api.click(api.first(itemName(api)))
          // Verify edit form is populated
          api.assertShowing(nameField(api))
          api.assertEnabled(nameField(api))
          api.assertValue(nameField(api), 'App format')
        },

        'should modify an existing template': (api) => {
          api.click(api.first(itemName(api)))

          // Change some settings
          api.type(separatorChar(api), '!', true)
          api.type(rangeChar(api), '~', true)

          // Save changes
          api.click(saveButton(api))

          // Verify changes were saved
          api.click(api.first(itemName(api)))
          api.assertValue(separatorChar(api), '!')
          api.assertValue(rangeChar(api), '~')
        },

        'should cancel the edit': (api) => {
          api.click(api.first(itemName(api)))
          api.type(separatorChar(api), '!', true)
          api.click(cancelButton(api))

          // Reopen the template
          api.click(api.first(itemName(api)))
          api.assertValue(separatorChar(api), ':')
        },

        'should update the name of format template in copy template': (api) => {
          api.click(api.containsText('English presentation'))
          api.type(nameField(api), newFormatName, true)
          api.click(saveButton(api))

          api.click(copyTemplatesPanel(api))
          api.click(api.first(copyTemplateItemName(api)))
          api.assertText(formatField(api), newFormatName)
        },
      },
    },

    'Removing a Format Template': {
      tests: {
        'should remove a format template': (api) => {
          // Add new template
          api.click(addButton(api))
          api.type(nameField(api), newFormatName)
          api.click(saveButton(api))
          api.assertCount(itemName(api), initialCount + 1)

          // Open the new template
          api.click(api.first(itemName(api)))
          // Click remove and confirm
          api.click(removeButton(api))
          api.clickDialogYes()

          // Verify template count decreased
          api.assertCount(itemName(api), initialCount)

          // Should clear the form and reset the name
          api.click(addButton(api))
          api.assertValue(nameField(api), '')
        },

        'should not remove template when dialog is canceled': (api) => {
          api.click(addButton(api))
          api.type(nameField(api), newFormatName)
          api.click(saveButton(api))
          api.assertCount(itemName(api), initialCount + 1)

          api.click(api.first(itemName(api)))
          api.click(removeButton(api))
          api.clickDialogNo()
          api.click(cancelButton(api))
          api.assertCount(itemName(api), initialCount + 1)
        },

        'should prevent removing a template used in a copy template': (api) => {
          api.click(api.containsText('English presentation'))
          api.assertDisabled(removeButton(api))
          api.tooltip(removeButton(api))
          api.assertText(
            '.q-tooltip',
            `${api.t(
              'settingsFormatTemplates.removeTooltipCopyTemplate'
            )} "Presentation" ${api.t(
              'settingsFormatTemplates.forLanguage'
            )} en-US`
          )
        },
      },
    },

    'Persistence of Format Templates': {
      tests: {
        'should persist changes after page reload': (api) => {
          // Add new template
          api.click(addButton(api))
          api.type(nameField(api), newFormatName)
          api.type(separatorChar(api), '/', true)
          api.click(saveButton(api))

          // Reload and verify
          api.navigate('/settings')
          api.click(formatTemplatesPanel(api))
          api.click(api.containsText(newFormatName))
          api.assertValue(separatorChar(api), '/')
        },
      },
    },
  },
}
