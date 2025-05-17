import { assertNoErrorHint } from './CypressHelper'

describe('Settings', () => {
  const goHome = () => navigate('/')
  const goSettings = () => navigate('/settings')

  beforeEach(() => {
    goSettings()
  })

  describe('Book names', () => {
    const bookNames = tag(tags.settingsPageBookNames)
    const appNaming = tag(tags.settingsBookNamingInApp)
    const items = tag(tags.settingsBookNamingItem)
    const itemNames = tag(tags.settingsBookNamingItemName)
    const itemBooks = tag(tags.settingsBookNamingItemBooks)
    const itemNameValues = ['OSIS abbreviations', 'SBL abbreviations', 'Standard']
    const editButton = tag(tags.settingsBookNamingItemEditButton)
    const editName = tag(tags.settingsBookNamingItemEditName)
    const editBooks = tag(tags.settingsBookNamingItemEditBooks)
    const saveButton = tag(tags.settingsBookNamingItemSaveButton)
    const cancelButton = tag(tags.settingsBookNamingItemCancelButton)
    const useButton = tag(tags.settingsBookNamingItemUseButton)
    const removeButton = tag(tags.settingsBookNamingItemRemoveButton)
    const addItemName = tag(tags.settingsBookNamingAddName)
    const addItemBooks = tag(tags.settingsBookNamingAddBookNames)
    const addItemButton = tag(tags.settingsBookNamingAddButton)
    const localeFilter = tag(tags.settingsLocaleFilter)

    describe('Settings Book Namings', () => {
      beforeEach(() => {
        click(bookNames)
      })

      it('should show book names', () => {
        assertCount(items, 3)
        assertText(last(itemNames), itemNameValues[2])
        forEach(itemNames, itemNameValues, (element, expected) => {
          assertText(element, expected)
          assertShowing(element)
        })
      })

      it('should edit book names', () => {
        const booksTestText = 'bbb'

        assertCount(editName, 0)
        assertShowing(last(editButton))
        assertNotShowing(editName)

        click(last(editButton))
        assertShowing(last(editName))
        assertShowing(last(editBooks))
        assertCount(editName, 1)

        type(last(editName), 'a', true)
        assertValue(last(editName), 'a')

        type(last(editBooks), booksTestText)
        assertValueContains(editBooks, booksTestText)

        click(last(saveButton))
        // The list should be sorted
        assertText(first(itemNames), 'a')

        // Edit should be preserved after page reload
        goSettings()
        click(bookNames)
        assertText(first(itemNames), 'a')

        // Change it back
        click(first(editButton))
        type(first(editName), 'Standard', true)
        type(first(editBooks), '{backspace}'.repeat(booksTestText.length))
        click(first(saveButton))
        assertText(last(itemNames), 'Standard')
        assertTextNotContains(last(itemBooks), booksTestText)
      })

      it('should validate book names when editing', () => {
        click(last(editButton))
        assertNoErrorHint(editName)
        assertNoErrorHint(editBooks)
        type(editName, '', true)
        type(editBooks, '', true)
        assertText(errorHint(editName), t('settingsBookNames.nameCannotBeEmpty'))
        assertText(errorHint(editBooks), t('settingsBookNames.bookListCannotBeEmpty'))

        // Asset the save did not submit and close the form
        click(last(saveButton))
        assertShowing(last(saveButton))

        // Should cancel the edit
        click(last(cancelButton))
        assertNotShowing(saveButton)
      })

      it('should validate book names when adding', () => {
        assertNoErrorHint(addItemName)
        assertNoErrorHint(addItemBooks)
        click(addItemName)
        click(addItemBooks)
        click(addItemName)
        assertText(errorHint(addItemName), t('settingsBookNames.nameCannotBeEmpty'))
        assertText(errorHint(addItemBooks), t('settingsBookNames.bookListCannotBeEmpty'))

        type(addItemBooks, 'a')
        // The error is not cleared from the previous check, hence using assertTextContains instead fo assertText. using
        assertTextContains(errorHint(addItemBooks), t('settingsBookNames.bookCountError', {
          count: 1,
          books: t('settingsBookNames.book')
        }))

        // Should not add invalid data
        click(addItemName)
        assertCount(items, 3)

        // Fix the data and add
        type(addItemName, 'a')
        type(addItemBooks, '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73', true)

        // Without that blur on the edited input would not happen beforehand
        focusOn(addItemButton)
        click(addItemButton)

        assertCount(items, 4)
        assertText(first(itemNames), 'a')

        assertNoErrorHint(addItemName)
        // This fails in the test, but works in the app
        assertNoErrorHint(addItemBooks)

        // Remove the new item
        click(first(editButton))
        click(removeButton)
        assertCount(items, 3)
      })

      it('should not remove when selected as app naming', () => {
        assertText(appNaming, 'SBL abbreviations')
        click(nth(editButton, 2))
        assertDisabled(removeButton)
        assertText(tooltip(removeButton), t('settingsBookNames.removeTooltipAppBookNaming'))
      })

      it('should not remove when used in a copy template', () => {
        click(last(editButton))
        assertDisabled(removeButton)

        assertText(tooltip(removeButton), t('settingsBookNames.removeTooltipCopyTemplate', { templateName: 'Presentation', locale: 'en-US' }))
      })

      // The app screen template was a premature feature, don't turn it on yet
      // it('should preserve the selected app screen naming when reopened', () => {
      //   select(appNaming, 'Standard')
      //   goHome()
      //   assertShowing(containsText('Genesis'))

      //   goSettings()
      //   click(bookNames)
      //   assertText(appNaming, 'Standard')

      //   click(nth(editButton, 2))
      //   click(useButton)
      //   assertText(appNaming, 'SBL abbreviations')
      // })

      it('should show items for the selected locale', () => {
        select(localeFilter, 'Polski')
        assertShowing(containsText('EIB skrócone'))
      })
    })
  })
})
