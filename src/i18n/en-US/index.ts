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
    selectBible: 'Select Bible',
    selectFromList: 'Select from list'
  },
  bookNamesEditor: {
    selectFromList: 'Select from list'
  },
  bookNamingList: {
    selectBookNaming: 'Select book naming'
  },
  buttonBookSelector: {
    selectBook: 'Select book',
    showButtons: 'Show book and chapter selection buttons',
    hideButtons: 'Hide book and chapter selection buttons'
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
    wholeWords: 'Whole words',
    enable: 'Enable whole word search',
    disable: 'Disable whole word search'
  },
  messageLine: {
    searching: 'Searching...',
    foundPassages: 'Found passages:',
    copyFound: 'Copy found verses to clipboard',
    enableNavigation: 'Enable navigation',
    formattedLayout: 'Change layout to print formatted',
    sortAndDeduplicate: 'Sort and deduplicate',
    notFound: 'Nothing found :-(',
    previousChapter: 'Previous chapter',
    nextChapter: 'Next chapter',
    copySelected: 'Copy selected verses to clipboard',
    playAudio: 'Play chapter in audio version',
    chapterLabel: 'Chapter',
    copiedSelectedVerses: 'Copied selected verses',
    noSelectedVerses: 'No selected verses',
    copiedFoundVerses: 'Copied found verses',
    formatFailed: 'Format failed',
    notConfiguredFor: 'is not configured for',
    defaultTemplate: 'Default template'
  },
  settingsBookNames: {
    title: 'Bible book naming',
    appDisplay: 'On application screen',
    editButton: 'Edit',
    standardName: 'Standard name',
    bookNames: 'Book names',
    removeTooltipAppBookNaming: 'Cannot remove naming that is used on the application screen',
    removeTooltipCopyTemplate: 'Cannot remove. The naming is used in the copy template "{templateName}" for language {lang}',
    addNewNaming: 'Add new naming',
    bookListCannotBeEmpty: 'Book list cannot be empty',
    bookCountError: 'The list must contain exactly 73 books. Currently it contains {count} {books}.',
    book: 'book',
    books2to4: 'books',
    books5plus: 'books',
    addButton: 'Add',
    saveButton: 'Save',
    cancelButton: 'Cancel',
    useOnAppScreen: 'Use on application screen',
    removeButton: 'Remove',
    nameAlreadyExists: 'This name already exists',
    nameCannotBeEmpty: 'Name cannot be empty'
  },
  settingsFormatTemplates: {
    title: 'Format Templates',
    appDisplay: 'On application screen',
    editTitle: 'Edit template',
    templateName: 'Template name',
    addButton: 'Add new template',
    referencePosition: 'Reference position',
    beforeContent: 'Before content',
    afterContent: 'After content',
    sameLine: 'On the same line',
    newLine: 'On a new line',
    translationAbbreviation: 'Translation abbreviation',
    none: 'None',
    lowercase: 'Lowercase',
    uppercase: 'Uppercase',
    versesWithNumbers: 'Verses with numbers',
    newLineForEachVerse: 'New line for each verse',
    separatorChar: 'Separator character',
    rangeChar: 'Range character',
    charsAroundReference: 'Characters around reference',
    charsBefore: 'before',
    charsAfter: 'after',
    charsAroundQuote: 'Characters around quote',
    charsAroundVerseNumber: 'Characters around verse number',
    charsAroundTranslationAbbreviation: 'Characters around translation abbreviation',
    removeDialogTitle: 'Remove template',
    removeDialogMessage: 'Are you sure you want to remove the template',
    yes: 'Yes',
    no: 'No',
    removeTooltip: 'Cannot remove. The template is used in a copy template',
    forLanguage: 'for language',
    nameCannotBeEmpty: 'Name cannot be empty',
    nameAlreadyExists: 'A template with this name already exists',
    saveButton: 'Save',
    cancelButton: 'Cancel',
    removeButton: 'Remove',
    example: "Example of a formatted passage"
  },
  settingsCopyTemplates: {
    title: 'Copy Templates',
    defaultTemplate: 'Default template',
    editTemplate: 'Edit template',
    templateName: 'Template name',
    templateDescription: 'Select format template and book naming for each language:',
    formatTemplate: 'Format template',
    bookNaming: 'Book naming',
    addButton: 'Add new template',
    removeTitle: 'Remove template',
    removeConfirm: 'Are you sure you want to remove the template',
    yes: 'Yes',
    no: 'No',
    error: 'Error',
    nameRequired: 'Name is required',
    nameExists: 'A template with this name already exists',
    ok: 'OK',
    saveButton: 'Save',
    cancelButton: 'Cancel',
    removeButton: 'Remove',
    defaultTemplateTooltip: 'Cannot remove the default template'
  },
  passageFormatEditor: {
    bookNamesLabel: 'Book names in passage reference:',
    separatorChar: {
      label: 'Character separating chapter from verses in reference:',
      colon: 'Colon',
      comma: 'Comma'
    },
    translationAbbreviation: {
      label: 'Translation abbreviation:',
      none: 'None',
      lowercase: 'Lowercase',
      uppercase: 'Uppercase'
    },
    options: {
      quotes: 'Passage content in quotation marks',
      numbers: 'Verses with numbers',
      newLine: 'Each verse on a new line'
    },
    example: 'Example of formatting a passage with a single verse and with multiple:'
  },
  settingsGeneral: {
    title: 'General Settings',
    defaultLanguage: 'Default language',
    defaultTranslation: 'Default translation',
    referencePickerOnStart: 'Show reference picker on start',
    defaultSearchResultLayout: 'Default search result layout',
    split: 'Split',
    formatted: 'Formatted'
  },
  settingsPage: {
    general: 'General',
    appearance: 'Appearance',
    translations: 'Translations',
    bookNames: 'Book Names',
    formatTemplates: 'Format Templates',
    copyTemplates: 'Copy Templates',
    importExport: 'Import / Export'
  },
  settingsAppearance: {
    title: 'Appearance',
    fontSize: 'Font size',
    textIncrease: 'Increase text',
    textDecrease: 'Decrease text',
    bibleTextExample: 'Bible text example'
  },
  screenModeToggle: {
    screenMode: 'Screen mode',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    autoMode: 'Auto mode'
  },
  routes: {
    settings: 'Settings'
  },
  settingsTranslations: {
    title: 'Translations',
    defaultTranslation: 'Default translation',
    allSelected: 'All selected',
    selected: 'Selected',
    selectAll: 'Select all for language',
    downloading: 'Downloading ...'
  },
  pageHeader: {
    backToHome: 'Back to Home'
  },
  buttonWordWrap: {
    enable: 'Enable word wrap',
    disable: 'Disable word wrap'
  },
  mainToolbar: {
    translationLabel: 'Translation'
  },
  mainPage: {
    clearSearch: 'Clear search criteria and results',
    search: 'Search',
    downloading: 'Downloading translation content ...',
    placeholderLong: 'Enter text containing bible references or a phrase to search in the translation text',
    placeholderShort: 'Reference or phrase'
  },
  errorNotFound: {
    title: '404',
    message: 'The page you are looking for was not found.',
    backToHome: 'Back to Home'
  }
}
