// cspell: language es
export default {
  app: {
    // No visible text in App.vue
  },
  audioPlayer: {
    unsupportedBrowser: 'Tu navegador no admite la reproducción de audio :/'
  },
  bibleContent: {
    // No visible text in BibleContent.vue
  },
  bibleSelector: {
    selectBible: 'Seleccionar edición',
    selectFromList: 'Seleccionar de la lista'
  },
  buttonBookSelector: {
    hideButtons: 'Ocultar botones de selección de libro y capítulo',
    selectBookChapter: 'Seleccionar libro y capítulo',
    showButtons: 'Mostrar botones de selección de libro y capítulo'
  },
  buttonHelp: {
    help: 'Ayuda'
  },
  buttonReadingPlan: {
    readingPlan: 'Plan de lectura'
  },
  buttonSettings: {
    settings: 'Configuración'
  },
  buttonWholeWords: {
    disable: 'Desactivar búsqueda de palabras completas',
    enable: 'Activar búsqueda de palabras completas',
    wholeWords: 'Palabras completas'
  },
  buttonWordWrap: {
    disable: 'Desactivar ajuste de línea',
    enable: 'Activar ajuste de línea'
  },
  errorNotFound: {
    backToHome: 'Volver a la página principal',
    message: 'La página que estás buscando no se encontró.',
    title: '404'
  },
  editionStore: {
    cannotUnselectAllEditions: 'No se puede deseleccionar todas las ediciones',
    editionNotFound: 'Contenido de la edición no encontrado para {symbol} ({locale})',
    editionFetchError: 'Error al obtener el contenido de la edición para {symbol} ({locale})',
    noDataReceived: 'No se recibieron datos de la solicitud de búsqueda'
  },
  mainPage: {
    clearSearch: 'Borrar criterios y resultados de búsqueda',
    downloading: 'Descargando contenido de la traducción ...',
    placeholderLong: 'Ingresa texto que contenga referencias bíblicas o una frase para buscar en el texto de la traducción',
    placeholderShort: 'Referencia o frase',
    search: 'Buscar'
  },
  mainToolbar: {
    editionLabel: 'Traducción'
  },
  messageLine: {
    chapterLabel: 'Capítulo',
    copiedFoundVerses: 'Versículos encontrados copiados',
    copiedSelectedVerses: 'Versículos seleccionados copiados',
    copyFound: 'Copiar versículos encontrados al portapapeles',
    copySelected: 'Copiar versículos seleccionados al portapapeles',
    defaultTemplate: 'Plantilla predeterminada',
    enableNavigation: 'Activar navegación',
    formatFailed: 'El formato falló',
    formattedLayout: 'Cambiar diseño a formato de impresión',
    foundPassages: 'Encontrado:',
    nextChapter: 'Siguiente capítulo',
    noSelectedVerses: 'No se seleccionaron versículos',
    notConfiguredFor: 'no está configurado para',
    notFound: 'No se encontró nada :-(',
    playAudio: 'Reproducir capítulo en versión de audio',
    previousChapter: 'Capítulo anterior',
    searching: 'Buscando...',
    sortAndDeduplicate: 'Ordenar y eliminar duplicados'
  },
  pageHeader: {
    backToHome: 'Volver a la página principal'
  },
  referencePicker: {
    selectBook: 'Seleccionar libro:',
    selectChapter: 'Seleccionar capítulo en libro:',
    selectVerse: 'Seleccionar versículo en:',
    backTooltip: 'Volver a seleccionar',
    chapters: 'capítulos',
    books: 'libros'
  },
  routes: {
    settings: 'Configuración'
  },
  screenModeToggle: {
    autoMode: 'Modo automático',
    darkMode: 'Modo oscuro',
    lightMode: 'Modo claro',
    screenMode: 'Modo de pantalla'
  },
  searchStore: {
    errorPrefix: 'Error:',
    noTemplateFound: 'No se encontró ninguna plantilla de copia',
    editionContentNotLoaded: 'El contenido de la edición no se ha cargado',
    noFragmentsFound: 'No se encontraron fragmentos',
    formattingError: 'Error durante el formateo:',
    noPassageSelected: 'No se ha seleccionado ningún pasaje',
    sortTooltip: 'Alternar ordenación y eliminación de duplicados entre los fragmentos encontrados',
    warningCouldNotFormat: 'No se pudo formatear',
  },
  settingsAppearance: {
    bibleTextExample: 'Ejemplo de texto bíblico',
    fontSize: 'Tamaño de fuente',
    textDecrease: 'Disminuir texto',
    textIncrease: 'Aumentar texto',
    title: 'Apariencia'
  },
  settingsBookNames: {
    addButton: 'Agregar',
    addNewNaming: 'Agregar nueva nomenclatura',
    appDisplay: 'En la pantalla de la aplicación',
    book: 'libro',
    bookCountError: 'La lista debe contener exactamente 73 libros. Actualmente contiene {count} {books}.',
    bookListCannotBeEmpty: 'La lista de libros no puede estar vacía',
    bookNames: 'Nombres de los libros',
    books2to4: 'libros',
    books5plus: 'libros',
    cancelButton: 'Cancelar',
    editButton: 'Editar',
    nameAlreadyExists: 'Este nombre ya existe',
    nameCannotBeEmpty: 'El nombre no puede estar vacío',
    removeButton: 'Eliminar',
    removeTooltipAppBookNaming: 'No se puede eliminar la nomenclatura que se está utilizando en la pantalla de la aplicación',
    removeTooltipCopyTemplate: 'No se puede eliminar. La nomenclatura se utiliza en la plantilla de copia "{templateName}" para el idioma {locale}',
    saveButton: 'Guardar',
    standardName: 'Nombre estándar',
    title: 'Nomenclatura de libros bíblicos',
    useOnAppScreen: 'Usar en la pantalla de la aplicación'
  },
  settingsCopyTemplates: {
    addButton: 'Agregar nueva plantilla',
    addNewTemplate: 'Agregar nueva plantilla',
    bookNaming: 'Nomenclatura de libros',
    bookNamingRequired: 'Se requiere la nomenclatura de libros',
    cancelButton: 'Cancelar',
    defaultTemplate: 'Plantilla predeterminada',
    defaultTemplateTooltip: 'No se puede eliminar la plantilla predeterminada',
    editTemplate: 'Editar plantilla',
    error: 'Error',
    formatRequired: 'Se requiere el formato',
    formatTemplate: 'Plantilla de formato',
    nameExists: 'Ya existe una plantilla con este nombre',
    nameRequired: 'El nombre es obligatorio',
    no: 'No',
    ok: 'OK',
    removeButton: 'Eliminar',
    removeConfirm: '¿Estás seguro de que deseas eliminar la plantilla',
    removeTitle: 'Eliminar plantilla',
    saveButton: 'Guardar',
    setAsDefault: 'Establecer como predeterminado',
    templateDescription: 'Selecciona la plantilla de formato y la nomenclatura de libros:',
    templateName: 'Nombre de la plantilla',
    theSameExists: 'Ya existe una plantilla con el mismo formato y nomenclatura de libros con el nombre',
    title: 'Plantillas de copia',
    yes: 'Sí'
  },
  settingsFormatTemplates: {
    addButton: 'Agregar nueva plantilla',
    afterContent: 'Después del contenido',
    appDisplay: 'En la pantalla de la aplicación',
    beforeContent: 'Antes del contenido',
    cancelButton: 'Cancelar',
    charsAfter: 'después',
    charsBefore: 'antes',
    charsAroundQuote: 'Caracteres alrededor de la cita',
    charsAroundReference: 'Caracteres alrededor de la referencia',
    charsAroundEditionAbbreviation: 'Caracteres alrededor de la abreviatura de la traducción',
    charsAroundVerseNumber: 'Caracteres alrededor del número de versículo',
    editTitle: 'Editar plantilla de formato',
    example: 'Ejemplo de pasaje formateado',
    forLanguage: 'para el idioma',
    lowercase: 'Minúsculas',
    nameAlreadyExists: 'Ya existe una plantilla con este nombre',
    nameCannotBeEmpty: 'El nombre no puede estar vacío',
    newLine: 'En nueva línea',
    newLineForEachVerse: 'Nueva línea para cada versículo',
    no: 'No',
    none: 'Ninguno',
    rangeChar: 'Carácter de rango',
    referencePosition: 'Posición de la referencia',
    removeButton: 'Eliminar',
    removeDialogMessage: '¿Estás seguro de que deseas eliminar la plantilla',
    removeDialogTitle: 'Eliminar plantilla',
    removeTooltipAppScreen: 'No se puede eliminar. La plantilla se usa en la pantalla de la aplicación',
    removeTooltipCopyTemplate: 'No se puede eliminar. La plantilla se usa en la plantilla de copia',
    sameLine: 'En la misma línea',
    saveButton: 'Guardar',
    separatorChar: 'Carácter separador',
    templateName: 'Nombre de la plantilla',
    title: 'Plantillas de formato',
    editionAbbreviation: 'Abreviatura de la traducción',
    uppercase: 'Mayúsculas',
    versesWithNumbers: 'Versículos con números',
    yes: 'Sí'
  },
  settingsGeneral: {
    locale: 'Idioma y región predeterminados',
    defaultSearchResultLayout: 'Diseño predeterminado de los resultados de búsqueda',
    defaultEdition: 'Traducción predeterminada',
    formatted: 'Formateado',
    referencePickerOnStart: 'Mostrar selector de libro/capítulo al abrir la página',
    split: 'Dividido',
    title: 'Configuración general',
    githubRepo: 'Repositorio de GitHub',
    contactEmail: 'Correo electrónico de contacto',
  },
  settingsImportExport: {
    title: 'Importar / Exportar',
    lastImportedFile: 'Último archivo subido',
    selectSettingsFile: 'Seleccionar archivo de configuración',
    importButton: 'Importar',
    exportButton: 'Exportar',
    resetSettings: 'Restablecer configuración',
    settingsSaved: 'Configuración guardada en el archivo {filename}',
    settingsNotSaved: 'No se pudo guardar la configuración',
    importSuccess: 'Configuración importada correctamente',
    resetConfirmTitle: 'Restablecer configuración',
    resetConfirmMessage: '¿Estás seguro de que deseas restablecer todas las configuraciones?',
    yes: 'Sí',
    no: 'No',
    resetSuccess: 'Configuración restablecida correctamente',
    selectFileFirst: 'Primero selecciona un archivo'
  },
  settingsPage: {
    appearance: 'Apariencia',
    bookNames: 'Nombres de libros',
    copyTemplates: 'Plantillas de copia',
    formatTemplates: 'Plantillas de formato',
    general: 'General',
    importExport: 'Importar / Exportar',
    editions: 'Traducciones'
  },
  settingsEditions: {
    allSelected: 'Todas seleccionadas',
    defaultEdition: 'Traducción predeterminada',
    downloading: 'Descargando ...',
    selectAll: 'Seleccionar todas para el idioma',
    selected: 'Seleccionadas',
    title: 'Traducciones'
  }
}
