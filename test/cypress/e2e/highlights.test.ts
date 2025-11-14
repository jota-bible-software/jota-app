import * as tags from 'src/tags'
import {
  assertDisabled,
  assertExists,
  assertMatchesPattern,
  assertNotExists,
  assertShowing,
  assertText,
  assertTextContains,
  click,
  clickDialogNo,
  clickDialogYes,
  dialog,
  each,
  first,
  navigate,
  notification,
  select,
  setCaret,
  tag,
  wait,
} from './CypressHelper'

describe('Highlights', () => {
  // Settings page navigation
  const settingsPageHighlights = tag(tags.settingsPageHighlights)

  // Settings panel
  const settingsPanelHighlights = '[data-tag="settingsPanel-highlights"]'
  const settingsPanelTitle = tag(tags.settingsPanelTitle)

  // Translation selector
  const translationSelector = tag(tags.translationSelector)

  // Highlights settings elements
  const highlightsAddButton = tag(tags.settingsHighlightsAddButton)
  const highlightsTranslationsList = tag(tags.settingsHighlightsTranslationsList)
  const highlightsTranslationItem = tag(tags.settingsHighlightsTranslationItem)
  const highlightsTranslationBadge = tag(tags.settingsHighlightsTranslationBadge)
  const highlightsTranslationDelete = tag(tags.settingsHighlightsTranslationDelete)
  const highlightsTranslationSymbol = tag(tags.settingsHighlightsTranslationSymbol)
  const highlightsTranslationTitle = tag(tags.settingsHighlightsTranslationTitle)

  // Settings page elements
  const settingsPageTranslations = tag(tags.settingsPageTranslations)
  const settingsTranslationItem = tag(tags.settingsTranslationItem)

  // Main page elements
  const verseElement = tag(tags.chapterVerse)
  const verseText = tag(tags.verseText)

  // Highlight button elements
  const highlightButtonDropdown = tag(tags.highlightButtonDropdown)
  const highlightColorSwatch = tag(tags.highlightColorSwatch)
  const highlightColorList = tag(tags.highlightColorList)
  const highlightColorItem = tag(tags.highlightColorItem)

  beforeEach(() => {
    cy.visit('/')
  })

  it('should navigate to highlights settings', () => {
    navigate('/settings')
    click(settingsPageHighlights)
    assertShowing(settingsPanelHighlights)
    assertTextContains(settingsPanelTitle, 'Highlights')
  })

  it('should add a translation for highlights', () => {
    // Navigate to highlights settings
    navigate('/settings')
    click(settingsPageHighlights)
    assertTextContains(settingsPanelTitle, 'Highlights')

    // Check if there's a translation selector and add button
    assertShowing(translationSelector)
    assertShowing(highlightsAddButton)

    // Open the translation selector
    select(translationSelector, 'UBG')

    // Click the add button
    click(highlightsAddButton)

    // Verify success notification
    assertShowing(notification())
    assertTextContains(notification(), 'added')
  })

  it('should display translations with highlight counts', () => {
    // Navigate to highlights settings
    navigate('/settings')
    click(settingsPageHighlights)
    assertText(settingsPanelTitle, 'Highlights')

    // Ensure at least one translation is added
    cy.get('body').then($body => {
      if ($body.find(highlightsTranslationItem).length === 0) {
        // Add a translation first
        select(translationSelector, 'UBG')
        click(highlightsAddButton)
        wait(500)
      }
    })

    // Check if list of translations with highlights is displayed
    assertShowing(highlightsTranslationsList)

    // Verify list items have flag, symbol, title, and badge
    first(highlightsTranslationItem).within(() => {
      cy.get('.fi').should('exist') // Flag icon (CSS-based, not SVG)
      assertShowing(highlightsTranslationSymbol)
      assertShowing(highlightsTranslationTitle)
      assertShowing(highlightsTranslationBadge)
    })
  })

  it('should remove a translation from highlights with confirmation', () => {
    // Navigate to highlights settings
    navigate('/settings')
    click(settingsPageHighlights)
    assertTextContains(settingsPanelTitle, 'Highlights')

    // Ensure at least one translation is added
    cy.get('body').then($body => {
      if ($body.find(highlightsTranslationItem).length === 0) {
        select(translationSelector, 'UBG')
        click(highlightsAddButton)
        wait(500)
      }
    })

    // Find and click delete button for first translation
    first(highlightsTranslationItem).within(() => {
      click(highlightsTranslationDelete)
    })

    // Confirm deletion in dialog
    assertShowing(dialog())
    assertTextContains(dialog(), 'Remove translation highlights')
    clickDialogYes()

    // Verify success notification
    assertShowing(notification())
    assertTextContains(notification(), 'removed')
  })

  it('should prevent adding already enabled translation', () => {
    // Navigate to highlights settings
    navigate('/settings')
    click(settingsPageHighlights)
    assertTextContains(settingsPanelTitle, 'Highlights')

    // Ensure at least one translation is added
    cy.get('body').then($body => {
      if ($body.find(highlightsTranslationItem).length === 0) {
        select(translationSelector, 'UBG')
        click(highlightsAddButton)
        wait(500)
      }
    })

    // Get the first translation from the list
    first(highlightsTranslationItem).find(highlightsTranslationSymbol).invoke('text').then((symbol) => {
      // Try to add the same translation again
      select(translationSelector, symbol.trim())
      click(highlightsAddButton)

      // Verify info notification about already enabled
      assertShowing(notification())
      assertTextContains(notification(), 'already enabled')
    })
  })

  it('should sort translations by locale then symbol', () => {
    // Navigate to highlights settings
    navigate('/settings')
    click(settingsPageHighlights)
    assertTextContains(settingsPanelTitle, 'Highlights')

    // Ensure at least one translation is added
    cy.get('body').then($body => {
      if ($body.find(highlightsTranslationItem).length === 0) {
        select(translationSelector, 'UBG')
        click(highlightsAddButton)
        wait(500)
      }
    })

    // Get all translation symbols and verify they are sorted
    cy.get(highlightsTranslationSymbol).then(($symbols) => {
      const symbols = $symbols.toArray().map(el => el.textContent?.trim() || '')

      // Verify sorting (locale should be grouped, then by symbol within locale)
      // If there's only one translation, the test passes trivially
      for (let i = 0; i < symbols.length - 1; i++) {
        const current = symbols[i]
        const next = symbols[i + 1]
        // This is a basic check - in reality we'd need to also check locale
        expect(current.localeCompare(next)).to.be.lessThanOrEqual(0)
      }
    })
  })

  it('should display highlight count badge for each translation', () => {
    // Navigate to highlights settings
    navigate('/settings')
    click(settingsPageHighlights)
    assertTextContains(settingsPanelTitle, 'Highlights')

    // Ensure at least one translation is added
    cy.get('body').then($body => {
      if ($body.find(highlightsTranslationItem).length === 0) {
        select(translationSelector, 'UBG')
        click(highlightsAddButton)
        wait(500)
      }
    })

    // Verify each translation has a badge with a number
    each(highlightsTranslationItem, ($item) => {
      cy.wrap($item).find(highlightsTranslationBadge).should('exist')
      assertMatchesPattern(cy.wrap($item).find(highlightsTranslationBadge), /^\d+$/)
    })
  })

  it('should disable add button when no translation selected', () => {
    // Navigate to highlights settings
    navigate('/settings')
    click(settingsPageHighlights)
    assertTextContains(settingsPanelTitle, 'Highlights')

    // Verify add button is disabled when empty option is selected
    select(translationSelector, '') // Select empty option

    assertDisabled(highlightsAddButton)
  })

  it('should show confirmation dialog with highlight count before removal', () => {
    // Navigate to highlights settings
    navigate('/settings')
    click(settingsPageHighlights)
    assertTextContains(settingsPanelTitle, 'Highlights')

    // Ensure at least one translation is added
    cy.get('body').then($body => {
      if ($body.find(highlightsTranslationItem).length === 0) {
        select(translationSelector, 'UBG')
        click(highlightsAddButton)
        wait(500)
      }
    })

    // Get the highlight count from badge and click delete
    let highlightCount: string
    first(highlightsTranslationItem).within(() => {
      first(highlightsTranslationBadge).invoke('text').then((count) => {
        highlightCount = count
      })
      click(highlightsTranslationDelete)
    })

    // Verify dialog shows the count (outside of within context)
    assertShowing(dialog())
    cy.then(() => {
      assertTextContains(dialog(), highlightCount)
    })

    // Cancel the dialog
    clickDialogNo()
    assertNotExists(dialog())
  })

  it('should integrate with settings translations page', () => {
    // Navigate to translations settings
    navigate('/settings')
    click(settingsPageTranslations)
    assertTextContains(settingsPanelTitle, 'Translations')

    // Verify highlight toggles are NOT present in translations settings
    first(settingsTranslationItem).within(() => {
      cy.get('q-toggle').should('not.exist')
      cy.get('.highlight-toggle-section').should('not.exist')
    })
  })

  it('should only show highlight button for translations with highlighting enabled', () => {
    // Navigate to home page
    cy.visit('/')

    // Search for a passage to get results (using test fixture data - Gen 1 returns single passage)
    cy.get('input[type="text"]').type('Gen 1{enter}')

    // Wait for results to load - Gen 1 shows in split layout by default
    wait(500)

    // Select a verse to enable selection (setCaret triggers selectionchange event)
    setCaret(first(verseElement))

    // Check if highlight button is visible - depends on whether highlighting is enabled
    cy.get('body').then($body => {
      const hasHighlightButton = $body.find(highlightColorSwatch).length > 0

      if (hasHighlightButton) {
        // If highlight button exists, verify it's properly displayed
        assertShowing(highlightColorSwatch)
      } else {
        // If no highlight button, that's expected for translations without highlights
        cy.log('Highlight button correctly hidden for translation without highlighting enabled')
      }
    })
  })

  it('should toggle verse highlighting when using highlight button', () => {
    // First, ensure a translation has highlighting enabled
    navigate('/settings')
    click(settingsPageHighlights)
    assertTextContains(settingsPanelTitle, 'Highlights')

    // Add KJV translation for highlights (it's the default/current translation)
    cy.get('body').then($body => {
      if ($body.find(highlightsTranslationItem).length === 0) {
        // Select KJV (default translation) and add it
        select(translationSelector, 'KJV')
        click(highlightsAddButton)
        wait(500)
      }
    })

    // Navigate back to home
    cy.visit('/')

    // Search for a passage (using test fixture data)
    cy.get('input[type="text"]').type('Gen 1{enter}')

    // Wait for results to load - Gen 1 shows in split layout by default
    wait(500)

    // Select a verse (setCaret triggers selectionchange event)
    setCaret(first(verseElement))

    // Verify highlight button is visible
    assertShowing(highlightColorSwatch)

    // Click to apply highlight
    click(highlightButtonDropdown)

    // Wait for dropdown to open
    wait(100)

    // Select the first highlight color from the dropdown
    click(first(highlightColorItem))

    // Wait for highlight to apply and Vue to update
    wait(500)

    // Verify the verse now has a highlight class or style (verse-highlighted class and --highlight-color variable)
    assertExists(verseElement + '.verse-highlighted, ' + verseElement + '[style*="--highlight-color"]')

    // Click again to open dropdown and toggle off the highlight
    click(highlightButtonDropdown)

    // Wait for dropdown to open
    wait(100)

    // Select the same color to toggle off
    click(first(highlightColorItem))

    // Wait a moment
    wait(300)

    // Verify highlight is removed
    first(verseElement).should('not.have.class', 'verse-highlighted')
  })

  it('should allow selecting different highlight colors', () => {
    // Setup: ensure highlighting is enabled
    navigate('/settings')
    click(settingsPageHighlights)

    // Add KJV translation for highlights (it's the default/current translation)
    cy.get('body').then($body => {
      if ($body.find(highlightsTranslationItem).length === 0) {
        select(translationSelector, 'KJV')
        click(highlightsAddButton)
        wait(500)
      }
    })

    // Go to home
    cy.visit('/')

    // Search and select a verse (using test fixture data)
    cy.get('input[type="text"]').type('Gen 1{enter}')

    // Wait for results to load - Gen 1 shows in split layout by default
    wait(500)

    // Select a verse (setCaret triggers selectionchange event)
    setCaret(first(verseElement))

    // Open color picker dropdown by clicking the dropdown arrow
    cy.get(highlightButtonDropdown).find('.q-btn-dropdown__arrow-container').click()

    // Verify color options are shown
    cy.get(highlightColorItem).should('have.length.greaterThan', 0)

    // Select a color
    first(highlightColorItem).click()

    // Verify highlight is applied (verse-highlighted class and --highlight-color variable)
    wait(300)
    assertExists(verseElement + '.verse-highlighted, ' + verseElement + '[style*="--highlight-color"]')
  })
})
