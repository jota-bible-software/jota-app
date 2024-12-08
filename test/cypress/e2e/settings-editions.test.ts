import {
  assertCount,
  assertText,
  click,
  navigate,
  tag,
  t,
  select,
  first,
  last,
  assertShowing,
  assertNotShowing,
  tooltip,
  containsText,
  nested,
  assertChecked,
  second,
  assertTextContains,
  assertNotChecked,
  visible
} from './CypressHelper'
import * as tags from 'src/tags'

const goHome = () => navigate('/')
const goSettings = () => navigate('/#/settings')

describe('Settings Editions', () => {
  const editionsPanel = tag(tags.settingsPageEditions)
  const generalPanel = tag(tags.settingsPageGeneral)
  const localeSelector = tag(tags.settingsLocaleSelector)
  const editionGroups = tag(tags.settingsEditionGroup)
  const editionGroupHeader = tag(tags.settingsEditionGroupHeader)
  const editionItems = tag(tags.settingsEditionItem)
  const editionItemToggle = tag(tags.settingsEditionItemToggle)
  const editionToggle = tag(tags.settingsEditionGroupToggle)
  const editionDefaultSelector = tag(tags.settingsEditionDefault)
  const editionLocale = tag(tags.settingsEditionsLocale)
  const allSelectedCount = tag(tags.settingsEditionsAllSelected)
  const groupSelectedCount = tag(tags.settingsEditionGroupSelected)
  const flagIcon = tag(tags.settingsEditionGroupFlag)
  const editionSelector = tag(tags.editionSelector)
  const editionSelectorItem = tag(tags.editionSelectorItem)
  const pageBackButton = tag(tags.pageBackButton)

  beforeEach(() => {
    goSettings()
    click(editionsPanel)
  })

  it('should display editions panel correctly', () => {
    assertShowing(editionsPanel)
    // Check for panel title
    assertText(containsText('Editions'), t('settingsEditions.title'))
  })

  describe('Edition Groups', () => {
    it('should display language groups correctly', () => {
      // Verify multiple language groups exist
      assertCount(editionGroups, 2) // Assuming we have at least English and Polish

      // Check first group (English)
      const enGroup = first(editionGroups)
      assertShowing(enGroup)
      assertText(first(editionLocale), 'en-US')

      // Verify flag icon is present
      assertShowing(first(flagIcon))
      assertShowing(last(flagIcon))

    })

    it('should expand groups', () => {
      assertShowing(first(editionItems))
      assertNotShowing(last(editionItems))

      click(last(editionGroupHeader))

      assertShowing(first(editionItems))
      assertNotShowing(last(editionItems))
    })

    it('should show selected editions count for each group', () => {
      assertText(first(groupSelectedCount), '1 / 3')
      assertText(last(groupSelectedCount), '3 / 4')
    })

    it('should toggle all editions in a group', () => {
      assertText(tooltip(first(editionToggle)), t('settingsEditions.selectAll') + ' en-US')
      click(first(editionToggle))

      assertText(first(groupSelectedCount), '3 / 3')
      click(first(editionToggle))
      assertText(first(groupSelectedCount), '0 / 3')
      assertText(first(editionDefaultSelector), '')

      // The second group should leave one selected because at least one should be selected globally
      assertText(second(groupSelectedCount), '3 / 4')
      click(second(editionToggle))
      assertText(second(groupSelectedCount), '4 / 4')
      click(second(editionToggle))
      assertText(second(groupSelectedCount), '1 / 4')
    })
  })

  describe('Individual Editions', () => {
    it('should list editions within each group', () => {
      assertCount(nested(first(editionGroups), editionItems), 3)
      assertCount(nested(last(editionGroups), editionItems), 4)
    })

    it('should display edition details correctly', () => {
      assertShowing(first(editionItems))
      assertText(first(editionItems), 'King James VersionKJV')
    })

    it('should allow selecting individual editions', () => {
      click(second(editionItemToggle))
      assertChecked(second(editionItemToggle))
      assertText(first(groupSelectedCount), '2 / 3')

      // The main bible selector should be affected by the selection
      goHome()
      click(visible(editionSelector))
      assertCount(editionSelectorItem, 5)
    })
  })

  describe('Default Edition Selection', () => {
    it('should include empty option in default edition selector', () => {
      assertShowing(first(editionDefaultSelector))
      click(first(editionDefaultSelector))
      assertText(first(editionSelectorItem), '')
    })

    it('should allow setting no default edition', () => {
      select(first(editionDefaultSelector), '')
      assertText(first(editionDefaultSelector), '')
    })

    it('should change the default edition when locale is changed', () => {
      click(generalPanel)
      select(localeSelector, 'Polski')
      click(pageBackButton)
      assertTextContains(editionSelector, 'UBG')
    })

    it('changing the default edition should affect the bible selector', () => {
      select(first(editionDefaultSelector), 'NIV')
      click(pageBackButton)
      assertTextContains(editionSelector, 'NIV')
      goHome()
      assertTextContains(editionSelector, 'NIV')
      goSettings()
      click(editionsPanel)
      select(first(editionDefaultSelector), 'KJV')
    })

  })

  describe('Total Selection Count', () => {
    it('should show correct total selected editions count', () => {
      // Verify format of total selected count
      assertText(allSelectedCount, '4 / 7')

      // Toggle one and verify total updates
      click(second(editionItemToggle))
      assertText(allSelectedCount, '5 / 7')
    })
  })

  describe('Persistence', () => {
    it('should persist selections after page reload', () => {
      assertChecked(first(editionItemToggle))
      click(first(editionItemToggle))
      // Reload page
      goSettings()
      click(editionsPanel)
      assertNotChecked(first(editionItemToggle))
    })

    it('should persist default edition selection', () => {
      select(first(editionDefaultSelector), 'NIV')
      // Reload page
      goSettings()
      click(editionsPanel)
      assertText(first(editionDefaultSelector), 'NIV')
    })

    it('should persist empty selection after page reload', () => {
      select(first(editionDefaultSelector), '')

      // Reload page
      goSettings()
      click(editionsPanel)

      assertText(first(editionDefaultSelector), '')
    })
  })
})
