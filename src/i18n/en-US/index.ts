export default {
  app: {
    // No visible text in App.vue
  },
  audioPlayer: {
    unsupportedBrowser: 'Your browser does not support audio playback :/'
  },
  bibleContent: {
    // No visible text in BibleContent.vue
  },
  bibleSelector: {
    selectBible: 'Select translation',
    selectFromList: 'Select from list'
  },
  buttonBookSelector: {
    hideButtons: 'Hide book and chapter selection buttons',
    selectBookChapter: 'Select book and chapter',
    showButtons: 'Show book and chapter selection buttons'
  },
  buttonHelp: {
    help: 'Help'
  },
  buttonReadingPlan: {
    readingPlan: 'Reading Plan'
  },
  buttonSettings: {
    settings: 'Settings'
  },
  buttonWholeWords: {
    disable: 'Disable whole word search',
    enable: 'Enable whole word search',
    wholeWords: 'Whole words'
  },
  buttonWordWrap: {
    disable: 'Disable word wrap',
    enable: 'Enable word wrap'
  },
  errorNotFound: {
    backToHome: 'Back to home page',
    message: 'The page you are looking for was not found.',
    title: '404'
  },
  translationStore: {
    cannotUnselectAllTranslations: 'Cannot unselect all translations',
    translationNotFound: 'Translation content not found for {symbol} ({locale})',
    translationFetchError: 'Error fetching translation content for {symbol} ({locale})',
    noDataReceived: 'No data received from fetch request',
    invalidFileFormat: 'Invalid translation file format for {symbol} ({locale})',
    unsupportedDataFormat: 'Unsupported data format: {format}'
  },
  mainPage: {
    clearSearch: 'Clear search criteria and results',
    downloading: 'Downloading translation content ...',
    placeholderLong: 'Enter text containing Bible references or a phrase to search in the translation content',
    placeholderShort: 'Reference or phrase',
    search: 'Search'
  },
  mainToolbar: {
    translationLabel: 'Translation'
  },
  messageLine: {
    chapterLabel: 'Chapter',
    copiedFoundVerses: 'Copied found verses',
    copiedSelectedVerses: 'Copied selected verses',
    copyFound: 'Copy found verses to clipboard',
    copySelected: 'Copy selected verses to clipboard',
    defaultTemplate: 'Default template',
    enableNavigation: 'Enable navigation',
    formatFailed: 'Formatting failed',
    formattedLayout: 'Change layout to formatted for printing',
    foundPassages: 'Found:',
    nextChapter: 'Next chapter',
    noSelectedVerses: 'No verses selected',
    notConfiguredFor: 'is not configured for',
    notFound: 'Nothing found :-(',
    playAudio: 'Play chapter in audio version',
    previousChapter: 'Previous chapter',
    searching: 'Searching...',
    selectBookChapter: 'Select book and chapter',
    sortAndDeduplicate: 'Sort and remove duplicates'
  },
  pageHeader: {
    backToHome: 'Back to home page'
  },
  referencePicker: {
    selectBook: 'Select book:',
    selectChapter: 'Select chapter in book:',
    selectVerse: 'Select verse in:',
    backTooltip: 'Go back to selecting',
    chapters: 'chapters',
    books: 'books'
  },
  routes: {
    settings: 'Settings',
    manual: 'Manual'
  },
  screenModeToggle: {
    autoMode: 'Auto mode',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    screenMode: 'Screen mode'
  },
  searchStore: {
    errorPrefix: 'Error:',
    noTemplateFound: 'No copy template found',
    translationContentNotLoaded: 'Translation content not loaded',
    noFragmentsFound: 'No fragments found',
    formattingError: 'Error during formatting:',
    noPassageSelected: 'No passage selected',
    sortTooltip: 'Toggle sorting and removing duplicates among found fragments',
    warningCouldNotFormat: 'Could not format',
    noLocaleData: 'No locale data available',
  },
  settingsAppearance: {
    bibleTextExample: 'Bible text example',
    fontSize: 'Font size',
    inlineVerseNumbers: 'Inline verse numbers',
    superscriptVerseNumbers: 'Superscript verse numbers',
    underlineVerseHighlight: 'Underline verse highlighting',
    continuousVerses: 'Display verses continuously',
    textDecrease: 'Decrease text',
    textIncrease: 'Increase text',
    title: 'Appearance'
  },
  settingsBookNames: {
    addButton: 'Add',
    addNewNaming: 'Add new naming',
    appDisplay: 'On app screen',
    book: 'book',
    bookCountError: 'The list must contain exactly 73 books. It currently contains {count} {books}.',
    bookListCannotBeEmpty: 'Book list cannot be empty',
    bookNames: 'Book names',
    books2to4: 'books',
    books5plus: 'books',
    cancelButton: 'Cancel',
    editButton: 'Edit',
    nameAlreadyExists: 'This name already exists',
    nameCannotBeEmpty: 'Name cannot be empty',
    removeButton: 'Remove',
    removeTooltipAppBookNaming: 'Cannot remove naming that is used on the app screen',
    removeTooltipCopyTemplate: 'Cannot remove. Naming is used in copy template "{templateName}" for language {locale}',
    saveButton: 'Save',
    standardName: 'Standard name',
    title: 'Bible book naming',
    useOnAppScreen: 'Use on app screen'
  },
  settingsCopyTemplates: {
    addButton: 'Add new template',
    addNewTemplate: 'Add new template',
    bookNaming: 'Book naming',
    bookNamingRequired: 'Book naming is required',
    cancelButton: 'Cancel',
    closeButton: 'Close',
    defaultTemplate: 'Default template',
    defaultTemplateTooltip: 'Cannot remove the default template',
    editTemplate: 'Edit template',
    error: 'Error',
    formatRequired: 'Format is required',
    formatTemplate: 'Format template',
    nameExists: 'A template with this name already exists',
    nameRequired: 'Name is required',
    no: 'No',
    ok: 'OK',
    removeButton: 'Remove',
    removeConfirm: 'Are you sure you want to remove the template',
    removeTitle: 'Remove template',
    saveButton: 'Save',
    setAsDefault: 'Set as default',
    templateDescription: 'Select format template and book naming:',
    templateName: 'Template name',
    theSameExists: 'A template with the same format and book naming already exists under the name',
    title: 'Copy templates',
    yes: 'Yes'
  },
  settingsFormatTemplates: {
    addButton: 'Add new template',
    afterContent: 'After content',
    appDisplay: 'On app screen',
    beforeContent: 'Before content',
    cancelButton: 'Cancel',
    charsAfter: 'after',
    charsBefore: 'before',
    charsAroundQuote: 'Characters around quote',
    charsAroundReference: 'Characters around reference',
    charsAroundTranslationAbbreviation: 'Characters around translation abbreviation',
    charsAroundVerseNumber: 'Characters around verse number',
    editTitle: 'Edit format template',
    example: 'Example of formatted passage',
    forLanguage: 'for language',
    lowercase: 'Lowercase',
    nameAlreadyExists: 'A template with this name already exists',
    nameCannotBeEmpty: 'Name cannot be empty',
    newLine: 'On new line',
    newLineForEachVerse: 'New line for each verse',
    no: 'No',
    none: 'None',
    rangeChar: 'Range character',
    referenceOnly: 'Reference only',
    referencePosition: 'Reference position',
    referenceWithoutContent: 'Reference without content',
    removeButton: 'Remove',
    removeDialogMessage: 'Are you sure you want to remove the template',
    removeDialogTitle: 'Remove template',
    removeTooltipAppScreen: 'Cannot remove. Template is used in app screen',
    removeTooltipCopyTemplate: 'Cannot remove. Template is used in copy template',
    sameLine: 'On the same line',
    saveButton: 'Save',
    separatorChar: 'Separator character',
    templateName: 'Template name',
    title: 'Format templates',
    translationAbbreviation: 'Translation abbreviation',
    uppercase: 'Uppercase',
    versesWithNumbers: 'Verses with numbers',
    yes: 'Yes'
  },
  settingsGeneral: {
    locale: 'Default language',
    defaultSearchResultLayout: 'Default search result layout',
    defaultTranslation: 'Default translation',
    formatted: 'Formatted',
    referencePickerOnStart: 'Show book/chapter buttons after opening the page',
    split: 'Split',
    title: 'General settings',
    githubRepo: 'GitHub Repository',
    userManual: 'User Manual',
    contactEmail: 'Contact email'
  },
  settingsImportExport: {
    title: 'Import / Export',
    lastImportedFile: 'Last uploaded file',
    selectSettingsFile: 'Select settings file',
    importButton: 'Import',
    exportButton: 'Export',
    resetSettings: 'Reset settings',
    settingsSaved: 'Settings saved to file: {filename}',
    settingsNotSaved: 'Settings could not be saved',
    importSuccess: 'Settings imported successfully',
    resetConfirmTitle: 'Reset settings',
    resetConfirmMessage: 'Are you sure you want to reset all settings?',
    yes: 'Yes',
    no: 'No',
    resetSuccess: 'Settings reset successfully',
    selectFileFirst: 'First select a file'
  },
  settingsPage: {
    appearance: 'Appearance',
    bookNames: 'Book names',
    copyTemplates: 'Copy templates',
    formatTemplates: 'Format templates',
    general: 'General',
    highlights: 'Highlights',
    importExport: 'Import / Export',
    translations: 'Translations'
  },
  settingsTranslations: {
    allSelected: 'All selected',
    defaultTranslation: 'Default translation',
    downloading: 'Downloading ...',
    enableHighlights: 'Enable highlights for this translation',
    highlightCount: 'Number of highlights in this translation',
    selectAll: 'Select all for language',
    selected: 'Selected',
    title: 'Translations'
  },
  highlight: {
    title: 'Highlights',
    palette: 'Highlight Palette',
    applyHighlight: 'Apply highlight',
    removeHighlight: 'Remove highlight',
    clearAllHighlights: 'Clear all highlights',
    viewByColor: 'View by color',
    manageColors: 'Manage colors',
    translationSummary: 'Highlights by Translation',

    tooltips: {
      togglePalette: 'Show/hide highlight palette (H)',
      applyColor: 'Apply {color} highlight',
      removeColor: 'Remove highlight',
      activeColor: 'Active color: {color}',
      viewFiltered: 'View all {color} highlights',
      reorderColors: 'Drag to reorder colors'
    },
    
    stats: {
      highlightCount: '{count} highlighted verses in current chapter',
      totalHighlights: '{count} total highlighted verses',
      noHighlights: 'No highlights yet',
      colorUsage: '{count} passages highlighted with this color'
    },
    
    filter: {
      title: 'Highlighted Passages',
      selectColor: 'Select color to filter',
      allColors: 'All colors ({count})',
      noPassages: 'No passages highlighted with this color',
      groupedByBook: 'Grouped by book',
      clickToNavigate: 'Click to navigate to passage',
      clearColorHighlights: 'Clear all {color} highlights',
      removePassage: 'Remove highlight from this passage'
    },
    
    colorManager: {
      title: 'Manage Highlight Colors',
      addColor: 'Add New Color',
      editColor: 'Edit Color',
      removeColor: 'Remove Color',
      colorName: 'Color Name',
      colorHex: 'Color Code',
      colorPreview: 'Preview',
      reorder: 'Drag to reorder',
      removeConfirm: 'Remove this color?',
      removeConfirmMessage: 'This will remove {count} highlighted passages. This action cannot be undone.',
      cannotRemoveLast: 'Cannot remove the last color',
      invalidHex: 'Invalid color code',
      nameRequired: 'Color name is required',
      pickColor: 'Pick a color'
    },
    
    translationMismatch: 'Translation Mismatch',
    translationMismatchMessage: 'You have highlights for {original} but are currently viewing {current}. Switch translations to see your highlights.',
    translationMismatchDismiss: 'Dismiss',
    translationMismatchLearnMore: 'Learn More',
    
    shortcuts: {
      apply: 'Ctrl+H - Apply active color'
    },

    importExport: {
      selectFile: 'Select highlights file',
      exportSuccess: 'Highlights exported to file: {filename}',
      exportFailed: 'Failed to export highlights',
      importSuccess: 'Highlights imported successfully',
      importFailed: 'Failed to import highlights',
      resetHighlights: 'Reset highlights',
      resetConfirmTitle: 'Reset highlights',
      resetConfirmMessage: 'Are you sure you want to delete all highlights? This action cannot be undone.',
      resetSuccess: 'Highlights reset successfully'
    }
  }
}
