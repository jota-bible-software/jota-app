describe('Home Page', () => {
  const goHome = () => navigate('/')
  const goSearchTerm = (term: string) => navigate(`/#/?q=${encodeURIComponent(term)}`)
  const goSettings = () => navigate('/#/settings')
  const goWrong = () => navigate('/#/wrong')

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
    const bookButtons = tag(tags.referencePickerBookButton)
    const chapterButtons = tag(tags.referencePickerChapterButtons)
    const backButton = tag(tags.referencePickerBackButton)
    const toggleButton = tag(tags.referencePickerToggle) + ':visible'
    const settingsReferencePickerOnStart = tag(tags.settingsReferencePickerOnStart)

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

      assertText(first(chapterButtons), '1')
      click(first(chapterButtons)) // Click on "1"
      assertNotShowing(backButton)
      assertShowing(chapterContent)

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

    it('should show search results', () => {
      type(searchInput, 'john{enter}')
      assertText(foundPassages, '130')
      assertNotShowing(passages)
      assertCount(formattedVerse, 130)
      assertText(first(formattedVerse), 'Matt 3:1 KJV"In those days came John the Baptist, preaching in the wilderness of Judaea,"')
    })

    it('should search from url', () => {
      goSearchTerm('john')
      assertText(foundPassages, '130')
      goSearchTerm('john 3:16')
      assertText(chapterCaption, 'John 3')
      assertNotShowing(passages)
    })
  })

  describe('Content', () => {
    it('should show html characters', () => {
      select(editionSelector, 'UBG')
      type(searchInput, 'ps 34{enter}')
      assertTextContains(chapterContent, '<Psalm Dawida, gdy zmienił swoje zachowanie przed Abimelekiem i wypędzony przez niego, odszedł.>')
    })

    it('should copy the highlighted verses', () => {
      type(searchInput, 'john 1 1{enter}')
      assertText(chapterCaption, 'John 1')
      mockClipboard()
      click(copySelectedButton, 'left')
      assertClipboard('In the beginning was the Word, and the Word was with God, and the Word was God.\nJohn 1:1 KJV')

      click(copySelectedButton, 'right')
      click(second(copySelectedOption))
      assertClipboard('– John 1:1 KJV\nIn the beginning was the Word, and the Word was with God, and the Word was God.')
    })

    it('should copy the found verses', () => {
      type(searchInput, 'demas{enter}')
      assertText(foundPassages, '3')
      mockClipboard()
      click(copyFoundButton, 'left')
      assertClipboard('Luke, the beloved physician, and Demas, greet you.\nColossians 4:14 KJV\n\nFor Demas hath forsaken me, having loved this present world, and is departed unto Thessalonica; Crescens to Galatia, Titus unto Dalmatia.\n2 Timothy 4:10 KJV\n\nMarcus, Aristarchus, Demas, Lucas, my fellowlabourers.\nPhilemon 1:24 KJV')
    })
  })

  describe('Navigation', () => {
    it('should go to next and previous chapter with click', () => {
      type(searchInput, 'john 1{enter}')
      assertText(chapterCaption, 'John 1')
      click(nextChapterButton)
      assertText(chapterCaption, 'John 2')
      click(previousChapterButton)
      assertText(chapterCaption, 'John 1')
      click(previousChapterButton)
      assertText(chapterCaption, 'Luke 24')
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
      type(searchInput, 'john{enter}')
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



