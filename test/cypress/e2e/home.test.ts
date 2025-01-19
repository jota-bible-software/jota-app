describe('Home Page', () => {
  const goHome = () => navigate('/')
  const goSearchTerm = (term: string) => navigate(`/?q=${encodeURIComponent(term)}`)
  const goSettings = () => navigate('/settings')
  const goWrong = () => navigate('/wrong')

  const chapterContent = tag(tags.chapterContent)
  const chapterVerse = tag(tags.chapterVerse)
  const editionSelector = tag(tags.editionSelector) + ':visible'
  const searchInput = tag(tags.searchInput)
  const clearSearchButton = tag(tags.clearSearchButton)
  const foundPassages = tag(tags.foundPassages)
  const foundPassage = tag(tags.foundPassage)
  const chapterCaption = tag(tags.chapterCaption)
  const nextChapterButton = tag(tags.nextChapterButton)
  const previousChapterButton = tag(tags.previousChapterButton)
  const copySelectedButton = tag(tags.copySelectedButton)
  const copySelectedOption = tag(tags.copySelectedOption)
  const copyFoundButton = tag(tags.copyFoundButton)
  const layoutToggle = tag(tags.layoutToggle)
  const passages = tag(tags.passages)
  const formattedVerse = tag(tags.formattedVerse)
  const nothingFound = tag(tags.nothingFound)

  const bookButtons = tag(tags.referencePickerBookButton)
  const chapterButtons = tag(tags.referencePickerChapterButtons)
  const backButton = tag(tags.referencePickerBackButton)
  const toggleButton = tag(tags.referencePickerToggle) + ':visible'
  const settingsReferencePickerOnStart = tag(tags.settingsReferencePickerOnStart)

  beforeEach(() => {
    goHome()
  })

  it('should have a correct page title', () => {
    assertEqual(title(), 'Jota Bible App')
  })

  it('should show error page when wrong url', () => {
    goWrong()
    assertShowing(containsText('404'))
  })

  describe('Reference picker', () => {

    it('should show buttons for book selection by default', () => {
      assertShowing(bookButtons)
      assertCount(bookButtons, 66)

      assertNotShowing(chapterContent)
      assertNotShowing(backButton)
      assertEnabled(toggleButton)
    })

    it('should select book and chapter', () => {
      click(first(bookButtons)) // Click on "Gen"
      assertShowing(backButton)

      // Wait for the edition to load
      assertShowing(chapterButtons, { timeout: 20000 })
      assertText(first(chapterButtons), '1')

      click(first(chapterButtons)) // Click on "1"
      assertNotShowing(backButton)

      assertShowing(containsText('In the beginning'))
    })

    it('should toggle reference picker', () => {
      click(first(bookButtons)) // Click on "Gen"
      click(first(chapterButtons)) // Click on "1"

      click(toggleButton) // Enable reference picker
      assertShowing(bookButtons)
      assertNotShowing(chapterContent)
      assertLookEnabled(toggleButton)

      click(toggleButton) // Disable reference picker
      assertNotShowing(bookButtons)
      assertShowing(chapterContent)
      assertLookDisabled(toggleButton)
    })

    it('should not show reference picker when settings disable it', () => {
      goSettings()
      click(settingsReferencePickerOnStart)
      goHome()
      assertNotShowing(bookButtons)
      assertShowing(chapterContent)
      assertLookDisabled(toggleButton)
    })
  })

  describe('Edition selector', () => {
    it('should change the edition', () => {
      type(searchInput, 'gen 1{enter}')
      assertShowing(containsText('In the beginning God created, the heaven and the earth.'))
      select(editionSelector, 'UBG')
      assertShowing(containsText('Na początku Bóg stworzył niebo i ziemię.'))
    })
  })

  describe('Search', () => {

    it('should show nothing was found', () => {
      type(searchInput, 'abcd{enter}')
      assertShowing(nothingFound)
      assertNotShowing(chapterContent)
    })

    it('should not clear the input after search', () => {
      type(searchInput, 'abcd{enter}')
      assertText(searchInput, 'abcd')
    })

    it('should clear the input with clear button', () => {
      type(searchInput, 'abcd{enter}')
      click(clearSearchButton)
      assertText(searchInput, '')
    })


    it('should show the book picker with enter on empty search', () => {
      type(searchInput, '{enter}')
      assertText(searchInput, '')
      assertShowing(bookButtons)
    })

    it('should show search results', () => {
      type(searchInput, 'abc{enter}')
      assertText(foundPassages, '2')
      assertNotShowing(passages)
      assertCount(formattedVerse, 2)
      assertText(first(formattedVerse), 'Exod 1:1 KJV"1 abc"')
    })

    it('should search from url', () => {
      goSearchTerm('abc')
      assertText(foundPassages, '2')
      goSearchTerm('john 1:1')
      assertText(chapterCaption, 'John 1')
      assertNotShowing(passages)
    })
  })

  describe('Content', () => {
    it('should show html characters', () => {
      type(searchInput, 'num 1:1{enter}')
      assertTextContains(chapterContent, '<words in brackets>') // Psalm 34:1 UBG has them
    })

    it('should copy the highlighted verses', () => {
      type(searchInput, 'gen 1 1{enter}')
      assertText(chapterCaption, 'Gen 1')
      mockClipboard()
      click(copySelectedButton, 'left')
      assertClipboard('In the beginning God created, the heaven and the earth.\nGenesis 1:1 KJV')

      click(copySelectedButton, 'right')
      click(second(copySelectedOption))
      assertClipboard('– Gen 1:1 KJV\nIn the beginning God created, the heaven and the earth.')
    })

    it('should copy the found verses', () => {
      type(searchInput, 'abc{enter}')
      assertText(foundPassages, '2')
      mockClipboard()
      click(copyFoundButton, 'left')
      assertClipboard('1 abc\nExodus 1:1 KJV\n\n2 abc\nLeviticus 1:1 KJV')
    })

    it('should copy after changing edition', () => {
      type(searchInput, 'gen 1 1{enter}')
      mockClipboard()
      click(copySelectedButton, 'left')
      assertClipboard('In the beginning God created, the heaven and the earth.\nGenesis 1:1 KJV')
      select(editionSelector, 'UBG')
      click(copySelectedButton, 'left')
      assertClipboard('Na początku Bóg stworzył niebo i ziemię.\nRodzaju 1,1 UBG')
    })
  })

  describe('Navigation', () => {
    it('should go to next and previous chapter with click', () => {
      type(searchInput, 'Exod 1{enter}')
      assertText(chapterCaption, 'Exod 1')
      click(nextChapterButton)
      assertText(chapterCaption, 'Exod 2')
      click(previousChapterButton)
      assertText(chapterCaption, 'Exod 1')
      click(previousChapterButton)
      assertText(chapterCaption, 'Gen 2')
    })

    it('should go to next and previous chapter with keyboard', () => {
      type(searchInput, 'gen 1{enter}')
      pressKey('{ctrl+rightArrow}')
      assertText(chapterCaption, 'Gen 2')
      pressKey('{ctrl+leftArrow}')
      assertText(chapterCaption, 'Gen 1')
    })

    it('should go to next and previous verse with keyboard', () => {
      type(searchInput, 'gen 1 1{enter}')
      assertHasClass(first(chapterVerse), 'selection-single')
      pressKey('{downArrow}')
      assertHasClass(second(chapterVerse), 'selection-single')
      pressKey('{upArrow}')
      assertHasClass(first(chapterVerse), 'selection-single')
    })

    it('should go to next and previous found passage with keyboard', () => {
      type(searchInput, 'abc{enter}')
      click(layoutToggle)
      assertHasClass(first(foundPassage), 'highlight')
      pressKey('{downArrow}')
      assertHasClass(second(foundPassage), 'highlight')

      // Click in cypress does not trigger selectionchange event, setCaret mocks it
      setCaret(first(chapterVerse))
      assertHasClass(first(chapterVerse), 'selection-single')
      pressKey('{downArrow}')
      assertHasClass(second(chapterVerse), 'selection-single')

      click(first(foundPassage))
      pressKey('{downArrow}')
      assertHasClass(second(foundPassage), 'highlight')
    })
  })
})



