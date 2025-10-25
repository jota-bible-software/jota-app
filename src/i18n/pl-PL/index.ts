export default {
  app: {
    // No visible text in App.vue
  },
  audioPlayer: {
    unsupportedBrowser: 'Twoja przeglądarka nie obsługuje słuchania audio :/'
  },
  bibleContent: {
    // No visible text in BibleContent.vue
  },
  bibleSelector: {
    selectBible: 'Wybierz przekład',
    selectFromList: 'Wybierz z listy'
  },
  buttonBookSelector: {
    hideButtons: 'Schowaj przyciski wyboru księgi i rozdziału',
    selectBookChapter: 'Wybierz księgę i rozdział',
    showButtons: 'Pokaż przyciski wyboru księgi i rozdziału '
  },
  buttonHelp: {
    help: 'Pomoc'
  },
  buttonReadingPlan: {
    readingPlan: 'Plan czytania'
  },
  buttonSettings: {
    settings: 'Ustawienia'
  },
  buttonWholeWords: {
    disable: 'Wyłącz wyszukiwanie całych słów',
    enable: 'Włącz wyszukiwanie całych słów',
    wholeWords: 'Całe słowa'
  },
  errorNotFound: {
    backToHome: 'Powrót do strony głównej',
    message: 'Strona, której szukasz, nie została znaleziona.',
    title: '404'
  },
  translationStore: {
    cannotUnselectAllTranslations: 'Nie można odznaczyć wszystkich przekładów',
    translationNotFound: 'Nie znaleziono treści dla przekładu {symbol} ({locale})',
    translationFetchError: 'Błąd podczas pobierania treści przekładu dla {symbol} ({locale})',
    noDataReceived: 'Nie otrzymano danych z żądania pobrania',
    invalidFileFormat: 'Nieprawidłowy format pliku przekładu dla {symbol} ({locale})',
    unsupportedDataFormat: 'Nieobsługiwany format danych: {format}'
  },
  mainPage: {
    clearSearch: 'Wyczyść kryteria i wyniki wyszukiwania',
    downloading: 'Pobieranie treści przekładu ...',
    placeholderLong: 'Podaj tekst zawierający odnośniki biblijne lub frazę do wyszukania w tekście przekładu',
    placeholderShort: 'Odnośnik lub fraza',
    search: 'Szukaj'
  },
  mainToolbar: {
    translationLabel: 'Przekład'
  },
  messageLine: {
    chapterLabel: 'Rozdział',
    copiedFoundVerses: 'Skopiowano znalezione wersety',
    copiedSelectedVerses: 'Skopiowano wybrane wersety',
    copyFound: 'Kopiuj znalezione wersety do schowka',
    copySelected: 'Kopiuj zaznaczone wersety do schowka',
    defaultTemplate: 'Domyślny szablon',
    enableNavigation: 'Włącz nawigację',
    formatFailed: 'Formatowanie nie powiodło się',
    formattedLayout: 'Zmień układ na sformatowany do wydruku',
    foundPassages: 'Znaleziono:',
    nextChapter: 'Następny rozdział',
    noSelectedVerses: 'Nie wybrano wersetów',
    notConfiguredFor: 'nie jest skonfigurowany dla',
    notFound: 'Nic takiego nie znaleziono :-(',
    playAudio: 'Odtwórz rozdział w wersji audio',
    previousChapter: 'Poprzedni rozdział',
    searching: 'Wyszukiwanie...',
    selectBookChapter: 'Wybierz księgę i rozdział',
    sortAndDeduplicate: 'Sortuj i usuń duplikaty'
  },
  pageHeader: {
    backToHome: 'Powrót do strony głównej'
  },
  referencePicker: {
    selectBook: 'Wybierz księgę:',
    selectChapter: 'Wybierz rozdział w księdze:',
    selectVerse: 'Wybierz werset w:',
    backTooltip: 'Przejdź do wybierania',
    chapters: 'rozdziałów',
    books: 'ksiąg'
  },
  routes: {
    settings: 'Ustawienia'
  },
  screenModeToggle: {
    autoMode: 'Tryb automatyczny',
    darkMode: 'Tryb ciemny',
    lightMode: 'Tryb jasny',
    screenMode: 'Tryb ekranu'
  },
  searchStore: {
    errorPrefix: 'Błąd:',
    noTemplateFound: 'Nie znaleziono żadnego szablonu kopiowania',
    translationContentNotLoaded: 'Treść tłumaczenia nie została załadowana',
    noFragmentsFound: 'Nie znaleziono żadnych fragmentów',
    formattingError: 'Błąd podczas formatowania:',
    noPassageSelected: 'Nie zaznaczono fragmentu',
    sortTooltip: 'Włącz/wyłącz sortowanie i usuwanie duplikatów wśród wyszukanych fragmentów',
    warningCouldNotFormat: 'Nie można sformatować',
    noLocaleData: 'Brak danych lokalizacyjnych',
  },
  settingsAppearance: {
    bibleTextExample: 'Przykład tekstu Biblii',
    fontSize: 'Rozmiar tekstu',
    inlineVerseNumbers: 'Numery wersetów w linii',
    superscriptVerseNumbers: 'Numery wersetów jako indeks górny',
    underlineVerseHighlight: 'Podkreślenie wyróżnienia wersetów',
    continuousVerses: 'Wyświetlaj wersety ciągle',
    textDecrease: 'Zmniejsz tekst',
    textIncrease: 'Zwiększ tekst',
    title: 'Wygląd'
  },
  settingsBookNames: {
    addButton: 'Dodaj',
    addNewNaming: 'Dodaj nowe nazewnictwo',
    appDisplay: 'Na ekranie aplikacji',
    book: 'księgę',
    bookCountError: 'Lista musi zawierać dokładnie 73 księgi. Obecnie zawiera {count} {books}.',
    bookListCannotBeEmpty: 'Lista ksiąg nie może być pusta',
    bookNames: 'Nazwy ksiąg',
    books2to4: 'księgi',
    books5plus: 'ksiąg',
    cancelButton: 'Cofnij',
    editButton: 'Edytuj',
    nameAlreadyExists: 'Taka nazwa już występuje',
    nameCannotBeEmpty: 'Nazwa nie może być pusta',
    removeButton: 'Usuń',
    removeTooltipAppBookNaming: 'Nie można usunąć nazewnictwa, które jest używane na ekranie aplikacji',
    removeTooltipCopyTemplate: 'Nie można usunąć. Nazewnictwo jest używane w szablonie kopiowania "{templateName}" dla języka {locale}',
    saveButton: 'Zapisz',
    standardName: 'Nazwa standardu',
    title: 'Nazewnictwo ksiąg biblijnych',
    useOnAppScreen: 'Użyj na ekranie aplikacji'
  },
  settingsCopyTemplates: {
    addButton: 'Dodaj nowy szablon',
    addNewTemplate: 'Dodaj nowy szablon',
    bookNaming: 'Nazewnictwo ksiąg',
    bookNamingRequired: 'Nazewnictwo ksiąg jest wymagane',
    cancelButton: 'Anuluj',
    closeButton: 'Zamknij',
    defaultTemplate: 'Domyślny szablon',
    defaultTemplateTooltip: 'Nie można usunąć domyślnego szablonu',
    editTemplate: 'Edytuj szablon',
    error: 'Błąd',
    formatRequired: 'Szablon formatowania jest wymagany',
    formatTemplate: 'Szablon formatowania',
    nameExists: 'Szablon o tej nazwie już istnieje',
    nameRequired: 'Nazwa jest wymagana',
    no: 'Nie',
    ok: 'OK',
    removeButton: 'Usuń',
    removeConfirm: 'Czy na pewno chcesz usunąć szablon',
    removeTitle: 'Usuń szablon',
    saveButton: 'Zapisz',
    setAsDefault: 'Ustaw jako domyślny',
    templateDescription: 'Wybierz szablon formatowania i nazewnictwo ksiąg:',
    templateName: 'Nazwa szablonu',
    theSameExists: 'Szablon z tym samym formatem i nazewnictwem ksiąg już istnieje pod tym nazwą',
    title: 'Szablony kopiowania',
    yes: 'Tak'
  },
  settingsFormatTemplates: {
    addButton: 'Dodaj nowy szablon',
    afterContent: 'Po treści',
    appDisplay: 'Na ekranie aplikacji',
    beforeContent: 'Przed treścią',
    cancelButton: 'Anuluj',
    charsAfter: 'po',
    charsBefore: 'przed',
    charsAroundQuote: 'Znaki wokół cytatu',
    charsAroundReference: 'Znaki wokół odnośnika',
    charsAroundTranslationAbbreviation: 'Znaki wokół skrótu przekładu',
    charsAroundVerseNumber: 'Znaki wokół numeru wersetu',
    editTitle: 'Edytuj szablon formatowania',
    example: 'Przykład sformatowanego fragmentu',
    forLanguage: 'dla języka',
    lowercase: 'Małe litery',
    nameAlreadyExists: 'Szablon o tej nazwie już istnieje',
    nameCannotBeEmpty: 'Nazwa nie może być pusta',
    newLine: 'W nowej linii',
    newLineForEachVerse: 'Nowa linia dla każdego wersetu',
    no: 'Nie',
    none: 'Brak',
    rangeChar: 'Znak zakresu',
    referenceOnly: 'Tylko odnośnik',
    referencePosition: 'Pozycja odnośnika',
    referenceWithoutContent: 'Odnośnik bez treści',
    removeButton: 'Usuń',
    removeDialogMessage: 'Czy na pewno chcesz usunąć szablon',
    removeDialogTitle: 'Usuń szablon',
    removeTooltipAppScreen: 'Nie można usunąć. Szablon jest używany na ekranie aplikacji',
    removeTooltipCopyTemplate: 'Nie można usunąć. Szablon jest używany w szablonie kopiowania',
    sameLine: 'W tej samej linii',
    saveButton: 'Zapisz',
    separatorChar: 'Znak separatora',
    templateName: 'Nazwa szablonu',
    title: 'Szablony formatowania',
    translationAbbreviation: 'Skrót przekładu',
    uppercase: 'Wielkie litery',
    versesWithNumbers: 'Wersety z numerami',
    yes: 'Tak'
  },
  settingsGeneral: {
    locale: 'Domyślny język i region',
    defaultSearchResultLayout: 'Domyślny układ wyników wyszukiwania',
    defaultTranslation: 'Domyślny przekład',
    formatted: 'Sformatowany',
    referencePickerOnStart: 'Pokaż przyciski wyboru księgi/rozdziału po otwarciu strony',
    split: 'Podzielony',
    title: 'Ustawienia ogólne',
    githubRepo: 'Repozytorium GitHub',
    contactEmail: 'E-mail kontaktowy',
    highlightingEnabled: 'Włącz wyróżnianie wersetów'
  },
  settingsImportExport: {
    title: 'Import / Export',
    lastImportedFile: 'Plik załadowany ostatnio',
    selectSettingsFile: 'Wybierz plik ustawień',
    importButton: 'Zaimportuj',
    exportButton: 'Eksportuj',
    resetSettings: 'Resetuj ustawienia',
    settingsSaved: 'Zapisano ustawienia do pliku: {filename}',
    settingsNotSaved: 'Nie udało się zapisać ustawień',
    importSuccess: 'Ustawienia zostały zaimportowane',
    resetConfirmTitle: 'Resetowanie ustawień',
    resetConfirmMessage: 'Czy na pewno chcesz zresetować wszystkie ustawienia?',
    yes: 'Tak',
    no: 'Nie',
    resetSuccess: 'Ustawienia zostały zresetowane',
    selectFileFirst: 'Najpierw wybierz plik'
  },
  settingsPage: {
    appearance: 'Wygląd',
    bookNames: 'Nazwy ksiąg',
    copyTemplates: 'Szablony kopiowania',
    formatTemplates: 'Szablony formatowania',
    general: 'Ogólne',
    highlights: 'Wyróżnienia',
    importExport: 'Import / Export',
    translations: 'Przekłady'
  },
  settingsTranslations: {
    allSelected: 'Wszystkich wybranych',
    defaultTranslation: 'Domyślny przekład',
    downloading: 'Pobieranie ...',
    selectAll: 'Wybierz wszystkie dla języka',
    selected: 'Wybrano',
    title: 'Przekłady'
  },
  highlight: {
    title: 'Wyróżnienia',
    palette: 'Paleta wyróżnień',
    applyHighlight: 'Zastosuj wyróżnienie',
    removeHighlight: 'Usuń wyróżnienie',
    clearAllHighlights: 'Wyczyść wszystkie wyróżnienia',
    viewByColor: 'Zobacz według koloru',
    manageColors: 'Zarządzaj kolorami',
    
    tooltips: {
      togglePalette: 'Pokaż/ukryj paletę wyróżnień (H)',
      applyColor: 'Zastosuj wyróżnienie {color}',
      removeColor: 'Usuń wyróżnienie',
      activeColor: 'Aktywny kolor: {color}',
      viewFiltered: 'Zobacz wszystkie wyróżnienia {color}',
      reorderColors: 'Przeciągnij aby zmienić kolejność kolorów'
    },
    
    stats: {
      highlightCount: '{count} wyróżnionych wersetów w bieżącym rozdziale',
      totalHighlights: '{count} wszystkich wyróżnionych wersetów',
      noHighlights: 'Brak wyróżnień',
      colorUsage: '{count} fragmentów wyróżnionych tym kolorem'
    },
    
    filter: {
      title: 'Wyróżnione fragmenty',
      selectColor: 'Wybierz kolor do filtrowania',
      allColors: 'Wszystkie kolory ({count})',
      noPassages: 'Brak fragmentów wyróżnionych tym kolorem',
      groupedByBook: 'Pogrupowane według księgi',
      clickToNavigate: 'Kliknij, aby przejść do fragmentu',
      clearColorHighlights: 'Wyczyść wszystkie wyróżnienia {color}',
      removePassage: 'Usuń wyróżnienie z tego fragmentu'
    },
    
    colorManager: {
      title: 'Zarządzaj kolorami wyróżnień',
      addColor: 'Dodaj nowy kolor',
      editColor: 'Edytuj kolor',
      removeColor: 'Usuń kolor',
      colorName: 'Nazwa koloru',
      colorHex: 'Kod koloru',
      colorPreview: 'Podgląd',
      reorder: 'Przeciągnij aby zmienić kolejność',
      removeConfirm: 'Usunąć ten kolor?',
      removeConfirmMessage: 'Spowoduje to usunięcie {count} wyróżnionych fragmentów. Tej operacji nie można cofnąć.',
      cannotRemoveLast: 'Nie można usunąć ostatniego koloru',
      invalidHex: 'Nieprawidłowy kod koloru',
      nameRequired: 'Nazwa koloru jest wymagana',
      pickColor: 'Wybierz kolor'
    },
    
    translationMismatch: 'Niezgodność przekładu',
    translationMismatchMessage: 'Masz wyróżnienia dla {original}, ale obecnie przeglądasz {current}. Przełącz przekład, aby zobaczyć swoje wyróżnienia.',
    translationMismatchDismiss: 'Odrzuć',
    translationMismatchLearnMore: 'Dowiedz się więcej',
    
    shortcuts: {
      apply: 'Ctrl+H - Zastosuj aktywny kolor'
    },

    importExport: {
      selectFile: 'Wybierz plik wyróżnień',
      exportSuccess: 'Wyróżnienia wyeksportowano do pliku: {filename}',
      exportFailed: 'Nie udało się wyeksportować wyróżnień',
      importSuccess: 'Wyróżnienia zostały zaimportowane',
      importFailed: 'Nie udało się zaimportować wyróżnień',
      resetHighlights: 'Resetuj wyróżnienia',
      resetConfirmTitle: 'Resetowanie wyróżnień',
      resetConfirmMessage: 'Czy na pewno chcesz usunąć wszystkie wyróżnienia? Tej operacji nie można cofnąć.',
      resetSuccess: 'Wyróżnienia zostały zresetowane'
    }
  }
}
