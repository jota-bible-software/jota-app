describe('Settings Copy Templates', () => {
  const goSettings = () => navigate('/settings')
  const locale = tag(tags.settingsLocaleFilter)
  const copyTemplatesPanel = tag(tags.settingsPageCopyTemplates)
  const defaultTemplate = tag(tags.settingsCopyTemplatesDefault)
  const itemName = tag(tags.settingsCopyTemplatesItemName)
  const addButton = tag(tags.settingsCopyTemplatesAdd)
  const nameField = tag(tags.settingsCopyTemplatesName)
  const formatField = tag(tags.settingsCopyTemplatesFormat)
  const bookNamingField = tag(tags.settingsCopyTemplatesBookNaming)
  const saveButton = tag(tags.settingsCopyTemplatesSave)
  const cancelButton = tag(tags.settingsCopyTemplatesCancel)
  const removeButton = tag(tags.settingsCopyTemplatesRemove)
  const addNameField = tag(tags.settingsCopyTemplatesAddName)
  const addFormatField = tag(tags.settingsCopyTemplatesAddFormat)
  const addBookNamingField = tag(tags.settingsCopyTemplatesAddBookNaming)

  const newTemplateName = 'aaa'

  const initialCount = 3

  function addNewItem() {
    type(addNameField, newTemplateName)
    select(first(addFormatField), 'App format')
    select(addBookNamingField, 'Standard')
    click(addButton)
    assertCount(itemName, initialCount + 1)
  }

  beforeEach(() => {
    goSettings()
    click(copyTemplatesPanel)
  })

  it('should display copy templates panel correctly', () => {
    assertCount(itemName, initialCount) // Assuming there are 2 default copy templates
    assertShowing(first(itemName))
  })

  it('should change the new template default book naming when locale is changed', () => {
    select(locale, 'Polski')
    assertText(addBookNamingField, 'BT5 pełne')
  })

  describe('Adding a New Copy Template', () => {

    it('should validate template name', () => {

      // Try to save without a name
      type(addNameField, '')
      click(addButton)
      assertText(errorHint(addNameField), t('settingsCopyTemplates.nameRequired'))

      // Try to add a template with an existing name
      type(addNameField, 'Presentation')
      click(addButton)
      assertText(errorHint(addNameField), t('settingsCopyTemplates.nameExists'))
    })

    it('should create a new copy template', () => {
      addNewItem()
      assertCount(itemName, initialCount + 1)
      // Should be sorted and come first
      assertText(first(itemName), newTemplateName)

      // Open the new template
      click(first(itemName))
      assertValue(nameField, newTemplateName)
      assertText(formatField, 'App format')
      assertText(bookNamingField, 'Standard')
    })

    it('should prevent adding a copy template with the same values', () => {
      type(addNameField, newTemplateName)
      select(addFormatField, 'English presentation')
      select(addBookNamingField, 'Standard')
      click(addButton)

      // Error dialog should be shown
      clickDialogYes()
      // Should not clear the new template name
      assertText(addNameField, newTemplateName)
    })
  })

  describe('Editing Existing Copy Template', () => {
    it('should open edit form for an existing template', () => {
      click(first(itemName))
      // Verify edit form is populated
      assertShowing(nameField)
      assertEnabled(nameField)
    })

    it('should modify an existing template', () => {
      click(first(itemName))

      // Change the name
      type(nameField, 'Modified Template', true)

      // Save changes
      click(saveButton)

      // Verify changes were saved
      click(first(itemName))
      assertValue(nameField, 'Modified Template')
    })

    it('should verify the values before saving', () => {
      click(first(itemName))
      type(nameField, '', true)
      click(saveButton)
      assertText(errorHint(nameField), t('settingsCopyTemplates.nameRequired'))
    })

    it('should cancel the edit', () => {
      click(first(itemName))
      type(nameField, 'Temporary Name', true)
      click(cancelButton)
      assertNotShowing(nameField)

      // Reopen the template
      click(first(itemName))
      assertValue(nameField, 'Presentation')
    })

    it('should modify default template name when changing the name', () => {
      click(first(itemName))
      type(nameField, 'bbb', true)
      click(saveButton)
      assertText(defaultTemplate, 'bbb')
    })
  })

  describe('Removing a Copy Template', () => {
    it('should remove a copy template', () => {
      addNewItem()

      // Open the new template
      click(first(itemName))
      // Click remove and confirm
      click(removeButton)
      clickDialogYes()

      // Verify template count decreased
      assertCount(itemName, initialCount)
    })

    it('should not remove template when dialog is canceled', () => {
      addNewItem()

      // Open the new template
      click(first(itemName))
      click(removeButton)
      clickDialogNo()
      assertShowing(removeButton)
    })

    it('should prevent removing the default template', () => {
      click(first(itemName))
      assertDisabled(removeButton)
      assertText(tooltip(removeButton), t('settingsCopyTemplates.defaultTemplateTooltip'))
    })
  })

  describe('Persistence of Copy Templates', () => {
    it('should persist changes after page reload', () => {
      addNewItem()

      // Reload and verify
      goSettings()
      click(copyTemplatesPanel)
      click(containsText(newTemplateName))
      assertValue(nameField, newTemplateName)
    })
  })
})
