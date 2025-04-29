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
    selectBible: 'Select edition',
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
  editionStore: {
    cannotUnselectAllEditions: 'Cannot unselect all editions',
    editionNotFound: 'Edition content not found for {symbol} ({locale})',
    editionFetchError: 'Error fetching edition content for {symbol} ({locale})',
    noDataReceived: 'No data received from fetch request'
  },
  mainPage: {
    clearSearch: 'Clear search criteria and results',
    downloading: 'Downloading edition content ...',
    placeholderLong: 'Enter text containing Bible references or a phrase to search in the edition content',
    placeholderShort: 'Reference or phrase',
    search: 'Search'
  },
  mainToolbar: {
    editionLabel: 'Edition'
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
    editionContentNotLoaded: 'Edition content not loaded',
    noFragmentsFound: 'No fragments found',
    formattingError: 'Error during formatting:',
    noPassageSelected: 'No passage selected',
    sortTooltip: 'Toggle sorting and removing duplicates among found fragments',
    warningCouldNotFormat: 'Could not format',
  },
  settingsAppearance: {
    bibleTextExample: 'Bible text example',
    fontSize: 'Font size',
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
    charsAroundEditionAbbreviation: 'Characters around edition abbreviation',
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
    editionAbbreviation: 'Edition abbreviation',
    uppercase: 'Uppercase',
    versesWithNumbers: 'Verses with numbers',
    yes: 'Yes'
  },
  settingsGeneral: {
    locale: 'Default language',
    defaultSearchResultLayout: 'Default search result layout',
    defaultEdition: 'Default edition',
    formatted: 'Formatted',
    referencePickerOnStart: 'Show book/chapter buttons after opening the page',
    split: 'Split',
    title: 'General settings',
    githubRepo: 'GitHub Repository',
    contactEmail: 'Contact email',
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
    importExport: 'Import / Export',
    editions: 'Editions'
  },
  settingsEditions: {
    allSelected: 'All selected',
    defaultEdition: 'Default edition',
    downloading: 'Downloading ...',
    selectAll: 'Select all for language',
    selected: 'Selected',
    title: 'Editions'
  }
}
