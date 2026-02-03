/**
 * Shared test specification for Home Page.
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
const chapterContent = (api: TestAPI) => api.tag(tags.chapterContent)
const chapterVerse = (api: TestAPI) => api.tag(tags.chapterVerse)
const translationSelector = (api: TestAPI) =>
  api.visible(api.tag(tags.translationSelector))
const searchInput = (api: TestAPI) => api.tag(tags.searchInput)
const clearSearchButton = (api: TestAPI) => api.tag(tags.clearSearchButton)
const foundPassages = (api: TestAPI) => api.tag(tags.foundPassages)
const foundPassage = (api: TestAPI) => api.tag(tags.foundPassage)
const chapterCaption = (api: TestAPI) => api.tag(tags.chapterCaption)
const nextChapterButton = (api: TestAPI) => api.tag(tags.nextChapterButton)
const previousChapterButton = (api: TestAPI) =>
  api.tag(tags.previousChapterButton)
const copySelectedButton = (api: TestAPI) => api.tag(tags.copySelectedButton)
const copySelectedOption = (api: TestAPI) => api.tag(tags.copySelectedOption)
const copyFoundButton = (api: TestAPI) => api.tag(tags.copyFoundButton)
const layoutToggle = (api: TestAPI) => api.tag(tags.layoutToggle)
const passages = (api: TestAPI) => api.tag(tags.passages)
const formattedVerse = (api: TestAPI) => api.tag(tags.formattedVerse)
const nothingFound = (api: TestAPI) => api.tag(tags.nothingFound)
const bookButtons = (api: TestAPI) => api.tag(tags.referencePickerBookButton)
const chapterButtons = (api: TestAPI) =>
  api.tag(tags.referencePickerChapterButtons)
const backButton = (api: TestAPI) => api.tag(tags.referencePickerBackButton)
const settingsReferencePickerOnStart = (api: TestAPI) =>
  api.tag(tags.settingsReferencePickerOnStart)

export const homePageTests: TestSpec = {
  name: 'Home Page',

  beforeEach: (api) => {
    api.navigate('/')
  },

  tests: {
    'should have a correct page title': (api) => {
      api.assertEqual(api.title(), 'Jota Bible App')
    },

    'should show error page when wrong url': (api) => {
      api.navigate('/wrong')
      api.assertShowing(api.containsText('404'))
    },
  },

  suites: {
    'Reference picker': {
      beforeEach: (api) => {
        api.clearLocalStorage()
        api.navigate('/')
      },

      tests: {
        'should select book and chapter': (api) => {
          api.click(api.first(bookButtons(api)))
          api.assertShowing(backButton(api))

          api.assertShowing(chapterButtons(api), { timeout: 20000 })
          api.assertText(api.first(chapterButtons(api)), '1')

          api.click(api.first(chapterButtons(api)))
          api.assertNotShowing(backButton(api))

          api.assertShowing(api.containsText('In the beginning'))
        },

        'should toggle reference picker': (api) => {
          api.click(api.first(bookButtons(api)))
          api.click(api.first(chapterButtons(api)))

          api.click(chapterCaption(api))
          api.assertShowing(bookButtons(api))
          api.assertNotShowing(chapterContent(api))
        },

        'should not show reference picker when settings disable it': (api) => {
          api.navigate('/settings')
          api.click(settingsReferencePickerOnStart(api))
          api.navigate('/')
          api.assertNotShowing(bookButtons(api))
          api.assertShowing(chapterContent(api))
        },
      },
    },

    'Translation selector': {
      tests: {
        'should change the translation': (api) => {
          api.type(searchInput(api), 'gen 1{enter}')
          api.assertShowing(
            api.containsText(
              'In the beginning God created, the heaven and the earth.'
            )
          )
          api.select(translationSelector(api), 'UBG')
          api.assertShowing(
            api.containsText('Na początku Bóg stworzył niebo i ziemię.')
          )
        },
      },
    },

    Search: {
      tests: {
        'should show nothing was found': (api) => {
          api.type(searchInput(api), 'abcd{enter}')
          api.assertShowing(nothingFound(api))
          api.assertNotShowing(chapterContent(api))
        },

        'should not clear the input after search': (api) => {
          api.type(searchInput(api), 'abcd{enter}')
          api.assertText(searchInput(api), 'abcd')
        },

        'should clear the input with clear button': (api) => {
          api.type(searchInput(api), 'abcd{enter}')
          api.click(clearSearchButton(api))
          api.assertText(searchInput(api), '')
        },

        'should highlight the search term': (api) => {
          api.type(searchInput(api), 'earth{enter}')
          api.assertText(foundPassages(api), '1')
          api.assertHtmlContains(
            chapterVerse(api),
            '<span class="bold">earth</span>'
          )
          api.type(searchInput(api), 'Gen 1{enter}', true)
          api.assertHtmlNotContains(
            chapterVerse(api),
            '<span class="bold">earth</span>'
          )
        },

        'should not show the found passages when there is only one passage found':
          (api) => {
            api.type(searchInput(api), 'Gen 1{enter}')
            api.assertShowing(
              api.containsText(
                'In the beginning God created, the heaven and the earth.'
              )
            )
            api.assertNotShowing(foundPassages(api))
            api.assertNotShowing(passages(api))
            api.assertShowing(
              api.containsText(
                'In the beginning God created, the heaven and the earth.'
              )
            )
          },

        'should show the book picker with enter on empty search': (api) => {
          api.type(searchInput(api), '{enter}')
          api.assertText(searchInput(api), '')
          api.assertShowing(bookButtons(api))
        },

        'should show search results': (api) => {
          api.type(searchInput(api), 'abc{enter}')
          api.assertText(foundPassages(api), '2')
          api.assertNotShowing(passages(api))
          api.assertCount(formattedVerse(api), 2)
          api.assertText(api.first(formattedVerse(api)), 'Exod 1:1 KJV"1 abc"')
        },

        'should search from url': (api) => {
          api.navigate('/?q=' + encodeURIComponent('abc'))
          api.assertText(foundPassages(api), '2')
          api.navigate('/?q=' + encodeURIComponent('john 1:1'))
          api.assertText(chapterCaption(api), 'John 1')
          api.assertNotShowing(passages(api))
        },
      },
    },

    Content: {
      tests: {
        'should show html characters': (api) => {
          api.type(searchInput(api), 'num 1:1{enter}')
          api.assertTextContains(chapterContent(api), '<words in brackets>')
        },

        'should copy the highlighted verses': (api) => {
          api.type(searchInput(api), 'gen 1 1{enter}')
          api.assertText(chapterCaption(api), 'Gen 1')
          api.mockClipboard()

          api.clickSplitButtonMain(copySelectedButton(api))
          api.assertClipboard(
            'In the beginning God created, the heaven and the earth.\nGenesis 1:1 KJV'
          )

          api.clickSplitButtonArrow(copySelectedButton(api))
          api.click(api.last(copySelectedOption(api)))
          api.assertClipboard(
            '– Gen 1:1 KJV\nIn the beginning God created, the heaven and the earth.'
          )
        },

        'should copy the found verses': (api) => {
          api.type(searchInput(api), 'abc{enter}')
          api.assertText(foundPassages(api), '2')
          api.mockClipboard()

          api.clickSplitButtonMain(copyFoundButton(api))
          api.assertClipboard(
            '1 abc\nExodus 1:1 KJV\n\n2 abc\nLeviticus 1:1 KJV'
          )
        },

        'should copy after changing translation': (api) => {
          api.type(searchInput(api), 'gen 1 1{enter}')
          api.mockClipboard()

          api.clickSplitButtonMain(copySelectedButton(api))
          api.assertClipboard(
            'In the beginning God created, the heaven and the earth.\nGenesis 1:1 KJV'
          )
          api.select(translationSelector(api), 'UBG')
          api.clickSplitButtonMain(copySelectedButton(api))
          api.assertClipboard(
            'Na początku Bóg stworzył niebo i ziemię.\nRodzaju 1,1 UBG'
          )
        },
      },
    },

    Navigation: {
      tests: {
        'should go to next and previous chapter with click': (api) => {
          api.type(searchInput(api), 'Exod 1{enter}')
          api.assertText(chapterCaption(api), 'Exod 1')
          api.click(nextChapterButton(api))
          api.assertText(chapterCaption(api), 'Exod 2')
          api.click(previousChapterButton(api))
          api.assertText(chapterCaption(api), 'Exod 1')
          api.click(previousChapterButton(api))
          api.assertText(chapterCaption(api), 'Gen 2')
        },

        'should go to next and previous chapter with keyboard': (api) => {
          api.type(searchInput(api), 'gen 1{enter}')
          api.pressKey('{ctrl+rightArrow}')
          api.assertText(chapterCaption(api), 'Gen 2')
          api.pressKey('{ctrl+leftArrow}')
          api.assertText(chapterCaption(api), 'Gen 1')
        },

        'should go to next and previous verse with keyboard': (api) => {
          api.type(searchInput(api), 'gen 1 1{enter}')
          api.assertHasClass(api.first(chapterVerse(api)), 'selection-single')
          api.pressKey('{downArrow}')
          api.assertHasClass(api.second(chapterVerse(api)), 'selection-single')
          api.pressKey('{upArrow}')
          api.assertHasClass(api.first(chapterVerse(api)), 'selection-single')
        },

        'should go to next and previous found passage with keyboard': (api) => {
          api.type(searchInput(api), 'abc{enter}')
          api.click(layoutToggle(api))
          api.assertHasClass(api.first(foundPassage(api)), 'highlight')
          api.pressKey('{downArrow}')
          api.assertHasClass(api.second(foundPassage(api)), 'highlight')

          api.setCaret(api.first(chapterVerse(api)))
          api.assertHasClass(api.first(chapterVerse(api)), 'selection-single')
          api.click(api.first(chapterVerse(api)))
          api.pressKey('{downArrow}')
          api.assertHasClass(api.second(chapterVerse(api)), 'selection-single')

          api.click(api.first(foundPassage(api)))
          api.pressKey('{downArrow}')
          api.assertHasClass(api.second(foundPassage(api)), 'highlight')
        },
      },
    },
  },
}
