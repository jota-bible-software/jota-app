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
  nested,
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

// const goHome = () => navigate('/')
const goSettings = () => navigate('/#/settings')

describe('Settings Format Templates', () => {
  // const appScreenTemplate = tag(tags.settingsFormatTemplateAppScreen)
  const formatTemplatesPanel = tag(tags.settingsPageFormatTemplates)
  const settingsPanelTitle = tag(tags.settingsPanelTitle)
  const formatTemplatesItemName = tag(tags.settingsFormatTemplatesItemName)
  const formatTemplatesAdd = tag(tags.settingsFormatTemplatesAdd)
  const formatTemplateName = tag(tags.settingsFormatTemplateName)
  const formatTemplateRefPositionBefore = tag(tags.settingsFormatTemplateRefPositionBefore)
  const formatTemplateWithNumbers = tag(tags.settingsFormatTemplateWithNumbers)
  const formatTemplateVerseNewLine = tag(tags.settingsFormatTemplateVerseNewLine)
  const formatTemplateSeparatorChar = tag(tags.settingsFormatTemplateSeparatorChar)
  const formatTemplateRangeChar = tag(tags.settingsFormatTemplateRangeChar)
  const formatTemplateSave = tag(tags.settingsFormatTemplateSave)
  const formatTemplateCancel = tag(tags.settingsFormatTemplateCancel)
  const formatTemplateRemove = tag(tags.settingsFormatTemplateRemove)

  // const searchInput = tag(tags.searchInput)
  // const formattedVerse = tag(tags.formattedVerse)

  const newFormatName = 'aaa'

  beforeEach(() => {
    goSettings()
    click(formatTemplatesPanel)
  })

  it('should display format templates panel correctly', () => {
    assertCount(formatTemplatesItemName, 4)
    assertShowing(first(formatTemplatesItemName))
  })

  // The app screen template was a premature feature, don't turn it on yet
  // it('should change the format of found passages when the app screen format template is changed', () => {
  //   select(appScreenTemplateSelector, 'English presentation')
  //   goHome()
  //   type(searchInput, 'earth{enter}')

  // })

  describe('Adding a New Format Template', () => {

    it('should open add format template form', () => {
      click(formatTemplatesAdd)
      assertText(settingsPanelTitle, t('settingsFormatTemplates.editTitle'))
      assertShowing(formatTemplateName)
    })

    it('should validate template name', () => {
      click(formatTemplatesAdd)

      // Try to save without a name
      type(formatTemplateName, '')
      click(formatTemplateSave)
      assertText(errorHint(formatTemplateName), t('settingsFormatTemplates.nameCannotBeEmpty'))

      // Try to add a template with an existing name
      type(formatTemplateName, 'App format')
      click(formatTemplateSave)
      assertText(errorHint(formatTemplateName), t('settingsFormatTemplates.nameAlreadyExists'))
    })

    it('should create a new format template', () => {
      click(formatTemplatesAdd)

      // Add a unique template name
      type(formatTemplateName, newFormatName)

      // Configure template settings
      click(first(formatTemplateRefPositionBefore))
      click(formatTemplateWithNumbers)
      click(formatTemplateVerseNewLine)
      type(formatTemplateSeparatorChar, '.', true)
      type(formatTemplateRangeChar, '—', true)

      // Save the template
      click(formatTemplateSave)

      // Verify the new template is in the list
      assertCount(formatTemplatesItemName, 5)
      // Should be sorted and come first
      assertText(first(formatTemplatesItemName), newFormatName)
    })

    it('should cancel the adding', () => {
      click(first(formatTemplatesItemName))
      click(formatTemplateCancel)
      assertCount(formatTemplatesItemName, 4)
      assertShowing(first(formatTemplatesItemName))
    })
  })

  describe('Editing Existing Format Template', () => {
    it('should open edit form for an existing template', () => {
      click(first(formatTemplatesItemName))
      // Verify edit form is populated
      assertShowing(formatTemplateName)
      assertEnabled(formatTemplateName)
      assertValue(formatTemplateName, 'App format')
    })

    it('should modify an existing template', () => {
      click(first(formatTemplatesItemName))

      // Change some settings
      type(formatTemplateSeparatorChar, '!', true)
      type(formatTemplateRangeChar, '~', true)

      // Save changes
      click(formatTemplateSave)

      // Verify changes were saved
      click(first(formatTemplatesItemName))
      assertValue(formatTemplateSeparatorChar, '!')
      assertValue(formatTemplateRangeChar, '~')
    })

    it('should cancel the edit', () => {
      click(first(formatTemplatesItemName))
      type(formatTemplateSeparatorChar, '!', true)
      click(formatTemplateCancel)

      // Reopen the template
      click(first(formatTemplatesItemName))
      assertValue(formatTemplateSeparatorChar, ':')
    })

    // The app screen template was a premature feature, don't turn it on yet
    // it('should change the app screen template when renamed', () => {
    //   click(first(formatTemplatesItemName))
    //   type(formatTemplateName, newFormatName, true)
    //   click(formatTemplateSave)

    //   click(formatTemplatesPanel)
    //   assertText(appScreenTemplate, newFormatName)
    // })
  })

  describe('Removing a Format Template', () => {
    it('should remove a format template', () => {
      // Add new template
      click(formatTemplatesAdd)
      type(formatTemplateName, newFormatName)
      click(formatTemplateSave)
      assertCount(formatTemplatesItemName, 5)

      // Open the new template
      click(first(formatTemplatesItemName))
      // Click remove and confirm
      click(formatTemplateRemove)
      clickDialogYes()

      // Verify template count decreased
      assertCount(formatTemplatesItemName, 4)

      // Should clear the form and reset the name
      click(formatTemplatesAdd)
      assertValue(formatTemplateName, '')
    })

    it('should not remove template when dialog is canceled', () => {
      click(formatTemplatesAdd)
      type(formatTemplateName, newFormatName)
      click(formatTemplateSave)
      assertCount(formatTemplatesItemName, 5)

      click(first(formatTemplatesItemName))
      click(formatTemplateRemove)
      clickDialogNo()
      click(formatTemplateCancel)
      assertCount(formatTemplatesItemName, 5)
    })

    it('should prevent removing the app screen template', () => {
      click(first(formatTemplatesItemName))
      assertDisabled(formatTemplateRemove)
      assertText(tooltip(formatTemplateRemove), t('settingsFormatTemplates.removeTooltipAppScreen'))
    })

    it('should prevent removing a template used in a copy template', () => {
      click(containsText('English presentation'))
      assertDisabled(formatTemplateRemove)
      assertText(tooltip(formatTemplateRemove), `${t('settingsFormatTemplates.removeTooltipCopyTemplate')} "Prezentacja" ${t('settingsFormatTemplates.forLanguage')} en-US`)
    })
  })

  describe('Persistence of Format Templates', () => {
    it('should persist changes after page reload', () => {
      // Add new template
      click(formatTemplatesAdd)
      type(formatTemplateName, newFormatName)
      type(formatTemplateSeparatorChar, '/', true)
      click(formatTemplateSave)

      // Reload and verify
      goSettings()
      click(formatTemplatesPanel)
      click(containsText(newFormatName))
      assertValue(formatTemplateSeparatorChar, '/')
    })
  })
})
