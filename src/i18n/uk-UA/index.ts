// cspell: language uk
export default {
  app: {
    // No visible text in App.vue
  },
  audioPlayer: {
    unsupportedBrowser: 'Ваш браузер не підтримує відтворення аудіо :/'
  },
  bibleContent: {
    // No visible text in BibleContent.vue
  },
  bibleSelector: {
    selectBible: 'Вибрати правопис',
    selectFromList: 'Вибрати зі списку'
  },
  buttonBookSelector: {
    hideButtons: 'Сховати кнопки вибору книги та розділу',
    selectBookChapter: 'Вибрати книгу та розділ',
    showButtons: 'Показати кнопки вибору книги та розділу'
  },
  buttonHelp: {
    help: 'Допомога'
  },
  buttonReadingPlan: {
    readingPlan: 'План читання'
  },
  buttonSettings: {
    settings: 'Налаштування'
  },
  buttonWholeWords: {
    disable: 'Вимкнути пошук цілих слів',
    enable: 'Увімкнути пошук цілих слів',
    wholeWords: 'Цілі слова'
  },
  buttonWordWrap: {
    disable: 'Вимкнути перенесення слів',
    enable: 'Увімкнути перенесення слів'
  },
  errorNotFound: {
    backToHome: 'Повернутися на головну сторінку',
    message: 'Сторінку, яку ви шукаєте, не знайдено.',
    title: '404'
  },
  translationStore: {
    cannotUnselectAllTranslations: 'Неможливо відзначити всі переклади',
    translationNotFound: 'Вміст перекладу не знайдено для {symbol} ({locale})',
    translationFetchError: 'Помилка отримання вмісту перекладу для {symbol} ({locale})',
    noDataReceived: 'Не отримано даних із запиту на отримання'
  },
  mainPage: {
    clearSearch: 'Очистити критерії та результати пошуку',
    downloading: 'Завантаження вмісту перекладу ...',
    placeholderLong: 'Введіть текст, що містить біблійні посилання або фразу для пошуку в тексті перекладу',
    placeholderShort: 'Посилання або фраза',
    search: 'Пошук'
  },
  mainToolbar: {
    translationLabel: 'Переклад'
  },
  messageLine: {
    chapterLabel: 'Розділ',
    copiedFoundVerses: 'Скопійовано знайдені вірші',
    copiedSelectedVerses: 'Скопійовано вибрані вірші',
    copyFound: 'Копіювати знайдені вірші в буфер обміну',
    copySelected: 'Копіювати вибрані вірші в буфер обмін',
    defaultTemplate: 'Шаблон за замовчуванням',
    enableNavigation: 'Увімкнути навігацію',
    formatFailed: 'Форматування не вдалося',
    formattedLayout: 'Змінити макет на форматований для друку',
    foundPassages: 'Знайдено:',
    nextChapter: 'Наступний розділ',
    noSelectedVerses: 'Не вибрано віршів',
    notConfiguredFor: 'не налаштовано для',
    notFound: 'Нічого не знайдено :-(',
    playAudio: 'Відтворити розділ в аудіоверсії',
    previousChapter: 'Попередній розділ',
    searching: 'Пошук...',
    selectBookChapter: 'Вибрати книгу та розділ',
    sortAndDeduplicate: 'Сортувати та видалити дублікати'
  },
  pageHeader: {
    backToHome: 'Повернутися на головну сторінку'
  },
  referencePicker: {
    selectBook: 'Вибрати книгу:',
    selectChapter: 'Вибрати розділ у книзі:',
    selectVerse: 'Вибрати вірш у:',
    backTooltip: 'Повернутися до вибору',
    chapters: 'розділів',
    books: 'книг'
  },
  routes: {
    settings: 'Налаштування'
  },
  screenModeToggle: {
    autoMode: 'Автоматичний режим',
    darkMode: 'Темний режим',
    lightMode: 'Світлий режим',
    screenMode: 'Режим екрану'
  },
  searchStore: {
    errorPrefix: 'Помилка:',
    noTemplateFound: 'Не знайдено шаблону для копіювання',
    translationContentNotLoaded: 'Зміст перекладу не завантажено',
    noFragmentsFound: 'Не знайдено фрагментів',
    formattingError: 'Помилка під час форматування:',
    noPassageSelected: 'Не вибрано уривок',
    sortTooltip: 'Увімкнути/вимкнути сортування та видалення дублікатів серед знайдених фрагментів',
    warningCouldNotFormat: 'Не вдалося відформатувати',
    noLocaleData: 'Дані локалізації відсутні',
  },
  settingsAppearance: {
    bibleTextExample: 'Приклад тексту Біблії',
    fontSize: 'Розмір шрифту',
    textDecrease: 'Зменшити текст',
    textIncrease: 'Збільшити текст',
    title: 'Зовнішній вигляд'
  },
  settingsBookNames: {
    addButton: 'Додати',
    addNewNaming: 'Додати нове найменування',
    appDisplay: 'На екрані додатку',
    book: 'книгу',
    bookCountError: 'Список повинен містити рівно 73 книги. Зараз він містить {count} {books}.',
    bookListCannotBeEmpty: 'Список книг не може бути порожнім',
    bookNames: 'Назви книг',
    books2to4: 'книги',
    books5plus: 'книг',
    cancelButton: 'Скасувати',
    editButton: 'Редагувати',
    nameAlreadyExists: 'Така назва вже існує',
    nameCannotBeEmpty: 'Назва не може бути порожньою',
    removeButton: 'Видалити',
    removeTooltipAppBookNaming: 'Неможливо видалити найменування, яке використовується на екрані додатку',
    removeTooltipCopyTemplate: 'Неможливо видалити. Найменування використовується в шаблоні копіювання "{templateName}" для мови {locale}',
    saveButton: 'Зберегти',
    standardName: 'Стандартна назва',
    title: 'Найменування біблійних книг',
    useOnAppScreen: 'Використовувати на екрані додатку'
  },
  settingsCopyTemplates: {
    addButton: 'Додати новий шаблон',
    addNewTemplate: 'Додати новий шаблон',
    bookNaming: 'Найменування книг',
    bookNamingRequired: 'Найменування книг є обов\'язковим',
    cancelButton: 'Скасувати',
    defaultTemplate: 'Шаблон за замовчуванням',
    defaultTemplateTooltip: 'Неможливо видалити шаблон за замовчуванням',
    editTemplate: 'Редагувати шаблон',
    error: 'Помилка',
    formatRequired: 'Формат є обов\'язковим',
    formatTemplate: 'Шаблон форматування',
    nameExists: 'Шаблон з такою назвою вже існує',
    nameRequired: "Ім'я обов'язкове",
    no: 'Ні',
    ok: 'OK',
    removeButton: 'Видалити',
    removeConfirm: 'Ви впевнені, що хочете видалити шаблон',
    removeTitle: 'Видалити шаблон',
    saveButton: 'Зберегти',
    setAsDefault: 'Встановити за замовчуванням',
    templateDescription: 'Виберіть шаблон форматування та найменування книг:',
    templateName: 'Назва шаблону',
    theSameExists: 'Шаблон з таким же форматом та найменуванням книг вже існує з таким іменем',
    title: 'Шаблони копіювання',
    yes: 'Так'
  },
  settingsFormatTemplates: {
    addButton: 'Додати новий шаблон',
    afterContent: 'Після вмісту',
    appDisplay: 'На екрані додатку',
    beforeContent: 'Перед вмістом',
    cancelButton: 'Скасувати',
    charsAfter: 'після',
    charsBefore: 'перед',
    charsAroundQuote: 'Символи навколо цитати',
    charsAroundReference: 'Символи навколо посилання',
    charsAroundTranslationAbbreviation: 'Символи навколо скорочення перекладу',
    charsAroundVerseNumber: 'Символи навколо номера вірша',
    editTitle: 'Редагувати шаблон форматування',
    example: 'Приклад форматованого уривку',
    forLanguage: 'для мови',
    lowercase: 'Малі літери',
    nameAlreadyExists: 'Шаблон з такою назвою вже існує',
    nameCannotBeEmpty: 'Назва не може бути порожньою',
    newLine: 'З нового рядка',
    newLineForEachVerse: 'Новий рядок для кожного вірша',
    no: 'Ні',
    none: 'Немає',
    rangeChar: 'Символ діапазону',
    referenceOnly: 'Тільки посилання',
    referencePosition: 'Позиція посилання',
    referenceWithoutContent: 'Посилання без вмісту',
    removeButton: 'Видалити',
    removeDialogMessage: 'Ви впевнені, що хочете видалити шаблон',
    removeDialogTitle: 'Видалити шаблон',
    removeTooltipAppScreen: 'Неможливо видалити. Шаблон використовується на екрані додатку',
    removeTooltipCopyTemplate: 'Неможливо видалити. Шаблон використовується в шаблоні копіювання',
    sameLine: 'В тому ж рядку',
    saveButton: 'Зберегти',
    separatorChar: 'Символ-роздільник',
    templateName: 'Назва шаблону',
    title: 'Шаблони форматування',
    translationAbbreviation: 'Скорочення перекладу',
    uppercase: 'Великі літери',
    versesWithNumbers: 'Вірші з номерами',
    yes: 'Так'
  },
  settingsGeneral: {
    locale: 'Мова та регіон за замовчуванням',
    defaultSearchResultLayout: 'Макет результатів пошуку за замовчуванням',
    defaultTranslation: 'Переклад за замовчуванням',
    formatted: 'Форматований',
    referencePickerOnStart: 'Показувати кнопки вибору книги/роділу при відкритті сторінки',
    split: 'Розділений',
    title: 'Загальні налаштування',
    githubRepo: 'Репозиторій GitHub',
    contactEmail: 'Електронна пошта для зворотного зв\'язку',
  },
  settingsImportExport: {
    title: 'Імпорт / Експорт',
    lastImportedFile: 'Останній завантажений файл',
    selectSettingsFile: 'Виберіть файл налаштувань',
    importButton: 'Імпорт',
    exportButton: 'Експорт',
    resetSettings: 'Скинути налаштування',
    settingsSaved: 'Налаштування збережено до файлу: {filename}',
    settingsNotSaved: 'Налаштування не можуть бути збережені',
    importSuccess: 'Налаштування імпортовано успішно',
    resetConfirmTitle: 'Скинути налаштування',
    resetConfirmMessage: 'Ви впевнені, що хочете скинути всі налаштування?',
    yes: 'Так',
    no: 'Ні',
    resetSuccess: 'Налаштування скинуто успішно',
    selectFileFirst: 'Спочатку виберіть файл'
  },
  settingsPage: {
    appearance: 'Зовнішній вигляд',
    bookNames: 'Назви книг',
    copyTemplates: 'Шаблони копіювання',
    formatTemplates: 'Шаблони форматування',
    general: 'Загальні',
    importExport: 'Імпорт / Експорт',
    translations: 'Переклади'
  },
  settingsTranslations: {
    allSelected: 'Всі вибрані',
    defaultTranslation: 'Переклад за замовчуванням',
    downloading: 'Завантаження ...',
    selectAll: 'Вибрати всі для мови',
    selected: 'Вибрано',
    title: 'Переклади'
  }
}
