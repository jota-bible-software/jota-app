describe('Home Page', () => {
  const goHome = () => navigate('/')
  const goSearchTerm = (term: string) => navigate(`/#/?q=${encodeURIComponent(term)}`)
  const goSettings = () => navigate('/#/settings')
  const goWrong = () => navigate('/#/wrong')

  const chapterContent = tag('chapter-content')
  const editionSelector = tag(tags.editionSelector) + ':visible'
  const searchInput = tag(tags.searchInput)
  const foundPassages = tag(tags.foundPassages)
  const chapterCaption = tag(tags.chapterCaption)
  const nextChapterButton = tag(tags.nextChapterButton)
  const previousChapterButton = tag(tags.previousChapterButton)
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

    it('should go to next and previous chapter', () => {
      type(searchInput, 'john 1{enter}')
      assertText(chapterCaption, 'John 1')
      click(nextChapterButton)
      assertText(chapterCaption, 'John 2')
      click(previousChapterButton)
      assertText(chapterCaption, 'John 1')
      click(previousChapterButton)
      assertText(chapterCaption, 'Luke 24')
    })

    it('should navigate with keyboard', () => { })
  })
})



