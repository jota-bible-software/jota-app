describe('Settings Format Templates', () => {
  const goSettings = () => navigate('/settings')
  // const appScreenTemplate = tag(tags.settingsFormatTemplateAppScreen)
  const formatTemplatesPanel = tag(tags.settingsPageFormatTemplates)
  const settingsPanelTitle = tag(tags.settingsPanelTitle)
  const itemName = tag(tags.settingsFormatTemplatesItemName)
  const addButton = tag(tags.settingsFormatTemplatesAdd)
  const nameField = tag(tags.settingsFormatTemplateName)
  const refPositionBefore = tag(tags.settingsFormatTemplateRefPositionBefore)
  const withNumbers = tag(tags.settingsFormatTemplateWithNumbers)
  const verseNewLine = tag(tags.settingsFormatTemplateVerseNewLine)
  const separatorChar = tag(tags.settingsFormatTemplateSeparatorChar)
  const rangeChar = tag(tags.settingsFormatTemplateRangeChar)
  const saveButton = tag(tags.settingsFormatTemplateSave)
  const cancelButton = tag(tags.settingsFormatTemplateCancel)
  const removeButton = tag(tags.settingsFormatTemplateRemove)

  // const searchInput = tag(tags.searchInput)
  // const formattedVerse = tag(tags.formattedVerse)

  const newFormatName = 'aaa'

  beforeEach(() => {
    goSettings()
    click(formatTemplatesPanel)
  })

  it('should display format templates panel correctly', () => {
    assertCount(itemName, 4)
    assertShowing(first(itemName))
  })

  // The app screen template was a premature feature, don't turn it on yet
  // it('should change the format of found passages when the app screen format template is changed', () => {
  //   select(appScreenTemplateSelector, 'English presentation')
  //   goHome()
  //   type(searchInput, 'earth{enter}')
  // })

  describe('Adding a New Format Template', () => {

    it('should open add format template form', () => {
      click(addButton)
      assertText(settingsPanelTitle, t('settingsFormatTemplates.editTitle'))
      assertShowing(nameField)
    })

    it('should validate template name', () => {
      click(addButton)

      // Try to save without a name
      type(nameField, '')
      click(saveButton)
      assertText(errorHint(nameField), t('settingsFormatTemplates.nameCannotBeEmpty'))

      // Try to add a template with an existing name
      type(nameField, 'App format')
      click(saveButton)
      assertText(errorHint(nameField), t('settingsFormatTemplates.nameAlreadyExists'))
    })

    it('should create a new format template', () => {
      click(addButton)

      // Add a unique template name
      type(nameField, newFormatName)

      // Configure template settings
      click(first(refPositionBefore))
      click(withNumbers)
      click(verseNewLine)
      type(separatorChar, '.', true)
      type(rangeChar, '—', true)

      // Save the template
      click(saveButton)

      // Verify the new template is in the list
      assertCount(itemName, 5)
      // Should be sorted and come first
      assertText(first(itemName), newFormatName)
    })

    it('should cancel the adding', () => {
      click(first(itemName))
      click(cancelButton)
      assertCount(itemName, 4)
      assertShowing(first(itemName))
    })
  })

  describe('Editing Existing Format Template', () => {
    it('should open edit form for an existing template', () => {
      click(first(itemName))
      // Verify edit form is populated
      assertShowing(nameField)
      assertEnabled(nameField)
      assertValue(nameField, 'App format')
    })

    it('should modify an existing template', () => {
      click(first(itemName))

      // Change some settings
      type(separatorChar, '!', true)
      type(rangeChar, '~', true)

      // Save changes
      click(saveButton)

      // Verify changes were saved
      click(first(itemName))
      assertValue(separatorChar, '!')
      assertValue(rangeChar, '~')
    })

    it('should cancel the edit', () => {
      click(first(itemName))
      type(separatorChar, '!', true)
      click(cancelButton)

      // Reopen the template
      click(first(itemName))
      assertValue(separatorChar, ':')
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
      click(addButton)
      type(nameField, newFormatName)
      click(saveButton)
      assertCount(itemName, 5)

      // Open the new template
      click(first(itemName))
      // Click remove and confirm
      click(removeButton)
      clickDialogYes()

      // Verify template count decreased
      assertCount(itemName, 4)

      // Should clear the form and reset the name
      click(addButton)
      assertValue(nameField, '')
    })

    it('should not remove template when dialog is canceled', () => {
      click(addButton)
      type(nameField, newFormatName)
      click(saveButton)
      assertCount(itemName, 5)

      click(first(itemName))
      click(removeButton)
      clickDialogNo()
      click(cancelButton)
      assertCount(itemName, 5)
    })

    it('should prevent removing the app screen template', () => {
      click(first(itemName))
      assertDisabled(removeButton)
      assertText(tooltip(removeButton), t('settingsFormatTemplates.removeTooltipAppScreen'))
    })

    it('should prevent removing a template used in a copy template', () => {
      click(containsText('English presentation'))
      assertDisabled(removeButton)
      assertText(tooltip(removeButton), `${t('settingsFormatTemplates.removeTooltipCopyTemplate')} "Presentation" ${t('settingsFormatTemplates.forLanguage')} en-US`)
    })
  })

  describe('Persistence of Format Templates', () => {
    it('should persist changes after page reload', () => {
      // Add new template
      click(addButton)
      type(nameField, newFormatName)
      type(separatorChar, '/', true)
      click(saveButton)

      // Reload and verify
      goSettings()
      click(formatTemplatesPanel)
      click(containsText(newFormatName))
      assertValue(separatorChar, '/')
    })
  })
})
