/**
 * Shared test specification for Settings Copy Templates.
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
const locale = (api: TestAPI) => api.tag(tags.settingsLocaleFilter)
const copyTemplatesPanel = (api: TestAPI) =>
  api.tag(tags.settingsPageCopyTemplates)
const defaultTemplate = (api: TestAPI) =>
  api.tag(tags.settingsCopyTemplatesDefault)
const itemName = (api: TestAPI) => api.tag(tags.settingsCopyTemplatesItemName)
const addButton = (api: TestAPI) => api.tag(tags.settingsCopyTemplatesAdd)
const nameField = (api: TestAPI) => api.tag(tags.settingsCopyTemplatesName)
const formatField = (api: TestAPI) => api.tag(tags.settingsCopyTemplatesFormat)
const bookNamingField = (api: TestAPI) =>
  api.tag(tags.settingsCopyTemplatesBookNaming)
const saveButton = (api: TestAPI) => api.tag(tags.settingsCopyTemplatesSave)
const cancelButton = (api: TestAPI) => api.tag(tags.settingsCopyTemplatesCancel)
const removeButton = (api: TestAPI) => api.tag(tags.settingsCopyTemplatesRemove)
const addNameField = (api: TestAPI) =>
  api.tag(tags.settingsCopyTemplatesAddName)
const addFormatField = (api: TestAPI) =>
  api.tag(tags.settingsCopyTemplatesAddFormat)
const addBookNamingField = (api: TestAPI) =>
  api.tag(tags.settingsCopyTemplatesAddBookNaming)

const newTemplateName = 'aaa'
const initialCount = 4

// Helper to add a new item (inlined into tests that need it)
function addNewItem(api: TestAPI) {
  api.type(addNameField(api), newTemplateName)
  api.select(api.first(addFormatField(api)), 'App format')
  api.select(addBookNamingField(api), 'Standard')
  api.click(addButton(api))
  api.assertCount(itemName(api), initialCount + 1)
}

export const settingsCopyTemplatesTests: TestSpec = {
  name: 'Settings Copy Templates',

  beforeEach: (api) => {
    api.navigate('/settings')
    api.click(copyTemplatesPanel(api))
  },

  tests: {
    'should display copy templates panel correctly': (api) => {
      api.assertCount(itemName(api), initialCount)
      api.assertShowing(api.first(itemName(api)))
    },

    'should change the new template default book naming when locale is changed':
      (api) => {
        api.select(locale(api), 'Polski')
        api.assertText(addBookNamingField(api), 'BT skróty')
      },
  },

  suites: {
    'Adding a New Copy Template': {
      tests: {
        'should validate template name': (api) => {
          // Try to save without a name
          api.type(addNameField(api), '')
          api.click(addButton(api))
          api.assertText(
            api.errorHint(addNameField(api)),
            api.t('settingsCopyTemplates.nameRequired')
          )

          // Try to add a template with an existing name
          api.type(addNameField(api), 'Presentation')
          api.click(addButton(api))
          api.assertText(
            api.errorHint(addNameField(api)),
            api.t('settingsCopyTemplates.nameExists')
          )
        },

        'should create a new copy template': (api) => {
          addNewItem(api)
          api.assertCount(itemName(api), initialCount + 1)
          // Should be sorted and come first
          api.assertText(api.first(itemName(api)), newTemplateName)

          // Open the new template
          api.click(api.first(itemName(api)))
          api.assertValue(nameField(api), newTemplateName)
          api.assertText(formatField(api), 'App format')
          api.assertText(bookNamingField(api), 'Standard')
        },

        'should prevent adding a copy template with the same values': (api) => {
          api.type(addNameField(api), newTemplateName)
          api.select(addFormatField(api), 'English presentation')
          api.select(addBookNamingField(api), 'Standard')
          api.click(addButton(api))

          // Error dialog should be shown
          api.clickDialogYes()
          // Should not clear the new template name
          api.assertText(addNameField(api), newTemplateName)
        },
      },
    },

    'Editing Existing Copy Template': {
      tests: {
        'should open edit form for an existing template': (api) => {
          api.click(api.first(itemName(api)))
          // Verify edit form is populated
          api.assertShowing(nameField(api))
          api.assertEnabled(nameField(api))
        },

        'should modify an existing template': (api) => {
          api.click(api.first(itemName(api)))

          // Change the name
          api.type(nameField(api), 'Modified Template', true)

          // Save changes
          api.click(saveButton(api))

          // Verify changes were saved
          api.click(api.first(itemName(api)))
          api.assertValue(nameField(api), 'Modified Template')
        },

        'should verify the values before saving': (api) => {
          api.click(api.first(itemName(api)))
          api.type(nameField(api), '', true)
          api.click(saveButton(api))
          api.assertText(
            api.errorHint(nameField(api)),
            api.t('settingsCopyTemplates.nameRequired')
          )
        },

        'should cancel the edit': (api) => {
          api.click(api.first(itemName(api)))
          api.type(nameField(api), 'Temporary Name', true)
          api.click(cancelButton(api))
          api.assertNotShowing(nameField(api))

          // Reopen the template
          api.click(api.first(itemName(api)))
          api.assertValue(nameField(api), 'Presentation')
        },

        'should modify default template name when changing the name': (api) => {
          api.click(api.first(itemName(api)))
          api.type(nameField(api), 'bbb', true)
          api.click(saveButton(api))
          api.assertText(defaultTemplate(api), 'bbb')
        },
      },
    },

    'Removing a Copy Template': {
      tests: {
        'should remove a copy template': (api) => {
          addNewItem(api)

          // Open the new template
          api.click(api.first(itemName(api)))
          // Click remove and confirm
          api.click(removeButton(api))
          api.clickDialogYes()

          // Verify template count decreased
          api.assertCount(itemName(api), initialCount)
        },

        'should not remove template when dialog is canceled': (api) => {
          addNewItem(api)

          // Open the new template
          api.click(api.first(itemName(api)))
          api.click(removeButton(api))
          api.clickDialogNo()
          api.assertShowing(removeButton(api))
        },

        'should prevent removing the default template': (api) => {
          api.click(api.first(itemName(api)))
          api.assertDisabled(removeButton(api))
          api.tooltip(removeButton(api))
          api.assertText(
            '.q-tooltip',
            api.t('settingsCopyTemplates.defaultTemplateTooltip')
          )
        },
      },
    },

    'Persistence of Copy Templates': {
      tests: {
        'should persist changes after page reload': (api) => {
          addNewItem(api)

          // Reload and verify
          api.navigate('/settings')
          api.click(copyTemplatesPanel(api))
          api.click(api.containsText(newTemplateName))
          api.assertValue(nameField(api), newTemplateName)
        },
      },
    },
  },
}
