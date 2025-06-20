
describe('Settings Translations', () => {
  const goHome = () => navigate('/')
  const goSettings = () => navigate('/settings')
  const translationsPanel = tag(tags.settingsPageTranslations)
  const generalPanel = tag(tags.settingsPageGeneral)
  const localeSelector = tag(tags.settingsLocaleSelector)
  const translationGroups = tag(tags.settingsTranslationGroup)
  const translationGroupHeader = tag(tags.settingsTranslationGroupHeader)
  const translationItems = tag(tags.settingsTranslationItem)
  const translationItemToggle = tag(tags.settingsTranslationItemToggle)
  const translationToggle = tag(tags.settingsTranslationGroupToggle)
  const translationDefaultSelector = tag(tags.settingsTranslationDefault)
  const translationLocale = tag(tags.settingsTranslationsLocale)
  const allSelectedCount = tag(tags.settingsTranslationsAllSelected)
  const groupSelectedCount = tag(tags.settingsTranslationGroupSelected)
  const flagIcon = tag(tags.settingsTranslationGroupFlag)
  const translationSelector = tag(tags.translationSelector)
  const translationSelectorItem = tag(tags.translationSelectorItem)
  const pageBackButton = tag(tags.pageBackButton)

  beforeEach(() => {
    goSettings()
    click(translationsPanel)
  })

  it('should display translations panel correctly', () => {
    assertShowing(translationsPanel)
    // Check for panel title
    assertText(containsText('Translations'), t('settingsTranslations.title'))
  })

  describe('Translation Groups', () => {
    it('should display language groups correctly', () => {
      // Verify multiple language groups exist
      assertCount(translationGroups, 2) // Assuming we have at least English and Polish

      // Check first group (English)
      const enGroup = first(translationGroups)
      assertShowing(enGroup)
      assertText(first(translationLocale), 'en-US')

      // Verify flag icon is present
      assertShowing(first(flagIcon))
      assertShowing(last(flagIcon))

    })

    it('should expand groups', () => {
      assertShowing(first(translationItems))
      assertNotShowing(last(translationItems))

      click(last(translationGroupHeader))

      assertShowing(first(translationItems))
      assertNotShowing(last(translationItems))
    })

    it('should show selected translations count for each group', () => {
      assertText(first(groupSelectedCount), '2 / 3')
      assertText(last(groupSelectedCount), '3 / 4')
    })

    it('should toggle all translations in a group', () => {
      assertText(tooltip(first(translationToggle)), t('settingsTranslations.selectAll') + ' en-US')
      click(first(translationToggle))

      assertText(first(groupSelectedCount), '3 / 3')
      click(first(translationToggle))
      assertText(first(groupSelectedCount), '0 / 3')
      assertText(first(translationDefaultSelector), '')

      // The second group should leave one selected because at least one should be selected globally
      assertText(second(groupSelectedCount), '3 / 4')
      click(second(translationToggle))
      assertText(second(groupSelectedCount), '4 / 4')
      click(second(translationToggle))
      assertText(second(groupSelectedCount), '1 / 4')
    })
  })

  describe('Individual Translations', () => {
    it('should list translations within each group', () => {
      assertCount(nested(first(translationGroups), translationItems), 3)
      assertCount(nested(last(translationGroups), translationItems), 4)
    })

    it('should display translation details correctly', () => {
      assertShowing(first(translationItems))
      assertText(first(translationItems), 'King James VersionKJV')
    })

    it('should allow selecting individual translations', () => {
      click(second(translationItemToggle))
      assertChecked(second(translationItemToggle))
      assertText(first(groupSelectedCount), '3 / 3')

      // The main bible selector should be affected by the selection
      goHome()
      // Wait for the translation to load
      assertShowing(visible(translationSelector), { timeout: 20_000 })
      click(visible(translationSelector))
      assertCount(translationSelectorItem, 6)
    })
  })

  describe('Default Translation Selection', () => {
    it('should include empty option in default translation selector', () => {
      assertShowing(first(translationDefaultSelector))
      click(first(translationDefaultSelector))
      assertText(first(translationSelectorItem), '')
    })

    it('should allow setting no default translation', () => {
      select(first(translationDefaultSelector), '')
      assertText(first(translationDefaultSelector), '')
    })

    it('should change the default translation when locale is changed', () => {
      click(generalPanel)
      select(localeSelector, 'Polski')
      click(pageBackButton)
      assertTextContains(translationSelector, 'UBG')
    })

    it('changing the default translation should affect the bible selector', () => {
      select(first(translationDefaultSelector), 'NIV')
      click(pageBackButton)
      assertTextContains(translationSelector, 'NIV')
      goHome()
      // Wait for the translation to load
      assertShowing(translationSelector, { timeout: 20_000 })
      assertTextContains(translationSelector, 'NIV')
      goSettings()
      click(translationsPanel)
      select(first(translationDefaultSelector), 'KJV')
    })

  })

  describe('Total Selection Count', () => {
    it('should show correct total selected translations count', () => {
      // Verify format of total selected count
      assertText(allSelectedCount, '5 / 7')

      // Toggle one and verify total updates
      click(second(translationItemToggle))
      assertText(allSelectedCount, '6 / 7')
    })
  })

  describe('Persistence', () => {
    it('should persist selections after page reload', () => {
      assertChecked(first(translationItemToggle))
      click(first(translationItemToggle))
      // Reload page
      goSettings()
      click(translationsPanel)
      assertNotChecked(first(translationItemToggle))
    })

    it('should persist default translation selection', () => {
      select(first(translationDefaultSelector), 'NIV')
      // Reload page
      goSettings()
      click(translationsPanel)
      assertText(first(translationDefaultSelector), 'NIV')
    })

    it('should persist empty selection after page reload', () => {
      select(first(translationDefaultSelector), '')

      // Reload page
      goSettings()
      click(translationsPanel)

      assertText(first(translationDefaultSelector), '')
    })
  })
})
