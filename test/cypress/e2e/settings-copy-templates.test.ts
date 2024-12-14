import {
  assertText,
  click,
  navigate,
  tag,
  t,
  type,
  select,
  assertTextContains,
  assertShowing,
  containsText,
  first,
  assertCount,
  errorHint,
  assertEnabled,
  assertDisabled,
  nth,
  clickDialogYes,
  tooltip,
  assertValue,
  clickDialogNo
} from './CypressHelper'
import * as tags from 'src/tags'

const goSettings = () => navigate('/#/settings')

describe('Settings Copy Templates', () => {
  const copyTemplatesPanel = tag(tags.settingsPageCopyTemplates)
  const settingsPanelTitle = tag(tags.settingsPanelTitle)
  const copyTemplatesDefault = tag(tags.settingsCopyTemplatesDefault)
  const copyTemplatesItemName = tag(tags.settingsCopyTemplatesItemName)
  const copyTemplatesAdd = tag(tags.settingsCopyTemplatesAdd)
  const copyTemplatesName = tag(tags.settingsCopyTemplatesName)
  const copyTemplatesSave = tag(tags.settingsCopyTemplatesSave)
  const copyTemplatesCancel = tag(tags.settingsCopyTemplatesCancel)
  const copyTemplatesRemove = tag(tags.settingsCopyTemplatesRemove)
  const copyTemplatesFormat = tag(tags.settingsCopyTemplatesFormat)
  const copyTemplatesBookNaming = tag(tags.settingsCopyTemplatesBookNaming)

  const newTemplateName = 'aaa'

  function addNewItem() {
    click(copyTemplatesAdd)
    type(copyTemplatesName, newTemplateName)
    select(first(copyTemplatesFormat), 'App format')
    select(copyTemplatesBookNaming, 'Standard')
    click(copyTemplatesSave)
    assertCount(copyTemplatesItemName, 3)
  }

  beforeEach(() => {
    goSettings()
    click(copyTemplatesPanel)
  })

  it('should display copy templates panel correctly', () => {
    assertCount(copyTemplatesItemName, 2) // Assuming there are 2 default copy templates
    assertShowing(first(copyTemplatesItemName))
  })

  describe('Adding a New Copy Template', () => {
    it('should open add copy template form', () => {
      click(copyTemplatesAdd)
      assertText(settingsPanelTitle, t('settingsCopyTemplates.editTemplate'))
      assertShowing(copyTemplatesName)
    })

    it('should validate template name', () => {
      click(copyTemplatesAdd)

      // Try to save without a name
      type(copyTemplatesName, '')
      click(copyTemplatesSave)
      assertText(errorHint(copyTemplatesName), t('settingsCopyTemplates.nameRequired'))

      // Try to add a template with an existing name
      type(copyTemplatesName, 'Presentation')
      click(copyTemplatesSave)
      assertText(errorHint(copyTemplatesName), t('settingsCopyTemplates.nameExists'))
    })

    it('should create a new copy template', () => {
      addNewItem()
      assertCount(copyTemplatesItemName, 3)
      // Should be sorted and come first
      assertText(first(copyTemplatesItemName), newTemplateName)

      // Open the new template
      click(first(copyTemplatesItemName))
      assertValue(copyTemplatesName, newTemplateName)
      assertText(copyTemplatesFormat, 'App format')
      assertText(copyTemplatesBookNaming, 'Standard')
    })

    it('should cancel the adding', () => {
      click(copyTemplatesAdd)
      click(copyTemplatesCancel)
      assertCount(copyTemplatesItemName, 2)
    })

    it.skip('should prevent adding a copy template with the same values', () => {
    })
  })

  describe('Editing Existing Copy Template', () => {
    it('should open edit form for an existing template', () => {
      click(first(copyTemplatesItemName))
      // Verify edit form is populated
      assertShowing(copyTemplatesName)
      assertEnabled(copyTemplatesName)
    })

    it('should modify an existing template', () => {
      click(first(copyTemplatesItemName))

      // Change the name
      type(copyTemplatesName, 'Modified Template', true)

      // Save changes
      click(copyTemplatesSave)

      // Verify changes were saved
      click(first(copyTemplatesItemName))
      assertValue(copyTemplatesName, 'Modified Template')
    })

    it('should verify the values before saving', () => {
      click(first(copyTemplatesItemName))
      type(copyTemplatesName, '', true)
      click(copyTemplatesSave)
      assertText(errorHint(copyTemplatesName), t('settingsCopyTemplates.nameRequired'))
    })

    it('should cancel the edit', () => {
      click(first(copyTemplatesItemName))
      type(copyTemplatesName, 'Temporary Name', true)
      click(copyTemplatesCancel)

      // Reopen the template
      click(first(copyTemplatesItemName))
      assertValue(copyTemplatesName, 'Presentation')
    })

    it('should modify default template name when changing the name', () => {
      click(first(copyTemplatesItemName))
      type(copyTemplatesName, 'bbb', true)
      click(copyTemplatesSave)
      assertText(copyTemplatesDefault, 'bbb')
    })
  })

  describe('Removing a Copy Template', () => {
    it('should remove a copy template', () => {
      addNewItem()

      // Open the new template
      click(first(copyTemplatesItemName))
      // Click remove and confirm
      click(copyTemplatesRemove)
      clickDialogYes()

      // Verify template count decreased
      assertCount(copyTemplatesItemName, 2)
    })

    it('should not remove template when dialog is canceled', () => {
      addNewItem()

      // Open the new template
      click(first(copyTemplatesItemName))
      click(copyTemplatesRemove)
      clickDialogNo()
      assertShowing(copyTemplatesRemove)
    })

    it('should prevent removing the default template', () => {
      click(first(copyTemplatesItemName))
      assertDisabled(copyTemplatesRemove)
      assertText(tooltip(copyTemplatesRemove), t('settingsCopyTemplates.defaultTemplateTooltip'))
    })
  })

  describe('Persistence of Copy Templates', () => {
    it('should persist changes after page reload', () => {
      addNewItem()

      // Reload and verify
      goSettings()
      click(copyTemplatesPanel)
      click(containsText(newTemplateName))
      assertValue(copyTemplatesName, newTemplateName)
    })
  })
})
