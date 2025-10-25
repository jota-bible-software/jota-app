// cspell: language pt
export default {
  app: {
    // No visible text in App.vue
  },
  audioPlayer: {
    unsupportedBrowser: 'O seu navegador não suporta reprodução de áudio :/'
  },
  bibleContent: {
    // No visible text in BibleContent.vue
  },
  bibleSelector: {
    selectBible: 'Selecionar tradução',
    selectFromList: 'Selecionar da lista'
  },
  buttonBookSelector: {
    hideButtons: 'Ocultar botões de seleção de livro e capítulo',
    selectBookChapter: 'Selecionar livro e capítulo',
    showButtons: 'Mostrar botões de seleção de livro e capítulo'
  },
  buttonHelp: {
    help: 'Ajuda'
  },
  buttonReadingPlan: {
    readingPlan: 'Plano de leitura'
  },
  buttonSettings: {
    settings: 'Configurações'
  },
  buttonWholeWords: {
    disable: 'Desativar pesquisa de palavras inteiras',
    enable: 'Ativar pesquisa de palavras inteiras',
    wholeWords: 'Palavras inteiras'
  },
  buttonWordWrap: {
    disable: 'Desativar quebra de linha',
    enable: 'Ativar quebra de linha'
  },
  errorNotFound: {
    backToHome: 'Voltar à página inicial',
    message: 'A página que você está procurando não foi encontrada.',
    title: '404'
  },
  translationStore: {
    cannotUnselectAllTranslations: 'Não é possível desmarcar todas as traduções',
    translationNotFound: 'Conteúdo da tradução não encontrado para {symbol} ({locale})',
    translationFetchError: 'Erro ao buscar conteúdo da tradução para {symbol} ({locale})',
    noDataReceived: 'Nenhum dado recebido da solicitação de busca',
    invalidFileFormat: 'Formato de arquivo de tradução inválido para {symbol} ({locale})',
    unsupportedDataFormat: 'Formato de dados não suportado: {format}'
  },
  mainPage: {
    clearSearch: 'Limpar critérios e resultados de pesquisa',
    downloading: 'Baixando conteúdo da tradução ...',
    placeholderLong: 'Digite texto contendo referências bíblicas ou uma frase para pesquisar no texto da tradução',
    placeholderShort: 'Referência ou frase',
    search: 'Pesquisar'
  },
  mainToolbar: {
    translationLabel: 'Tradução'
  },
  messageLine: {
    chapterLabel: 'Capítulo',
    copiedFoundVerses: 'Versículos encontrados copiados',
    copiedSelectedVerses: 'Versículos selecionados copiados',
    copyFound: 'Copiar versículos encontrados para a área de transferência',
    copySelected: 'Copiar versículos selecionados para a área de transferência',
    defaultTemplate: 'Modelo padrão',
    enableNavigation: 'Ativar navegação',
    formatFailed: 'Formatação falhou',
    formattedLayout: 'Mudar layout para formatado para impressão',
    foundPassages: 'Encontrado:',
    nextChapter: 'Próximo capítulo',
    noSelectedVerses: 'Nenhum versículo selecionado',
    notConfiguredFor: 'não está configurado para',
    notFound: 'Nada encontrado :-(',
    playAudio: 'Reproduzir capítulo em versão de áudio',
    previousChapter: 'Capítulo anterior',
    searching: 'Pesquisando...',
    selectBookChapter: 'Selecionar livro e capítulo',
    sortAndDeduplicate: 'Ordenar e remover duplicados'
  },
  pageHeader: {
    backToHome: 'Voltar à página inicial'
  },
  referencePicker: {
    selectBook: 'Selecionar livro:',
    selectChapter: 'Selecionar capítulo no livro:',
    selectVerse: 'Selecionar versículo em:',
    backTooltip: 'Voltar para seleção',
    chapters: 'capítulos',
    books: 'livros'
  },
  routes: {
    settings: 'Configurações'
  },
  screenModeToggle: {
    autoMode: 'Modo automático',
    darkMode: 'Modo escuro',
    lightMode: 'Modo claro',
    screenMode: 'Modo de tela'
  },
  settingsAppearance: {
    bibleTextExample: 'Exemplo de texto da Bíblia',
    fontSize: 'Tamanho da fonte',
    inlineVerseNumbers: 'Números de versículos em linha',
    superscriptVerseNumbers: 'Números de versículos sobrescritos',
    underlineVerseHighlight: 'Sublinhado para destaque de versículos',
    continuousVerses: 'Exibir versículos continuamente',
    textDecrease: 'Diminuir texto',
    textIncrease: 'Aumentar texto',
    title: 'Aparência'
  },
  searchStore: {
    errorPrefix: 'Erro:',
    noTemplateFound: 'Nenhum modelo de cópia encontrado',
    translationContentNotLoaded: 'Conteúdo da tradução não carregado',
    noFragmentsFound: 'Nenhum fragmento encontrado',
    formattingError: 'Erro durante a formatação:',
    noPassageSelected: 'Nenhuma passagem selecionada',
    sortTooltip: 'Alternar classificação e remoção de duplicatas entre os fragmentos encontrados',
    warningCouldNotFormat: 'Não foi possível formatar',
    noLocaleData: 'Dados de localização não disponíveis',
  },
  settingsBookNames: {
    addButton: 'Adicionar',
    addNewNaming: 'Adicionar nova nomenclatura',
    appDisplay: 'Na tela do aplicativo',
    book: 'livro',
    bookCountError: 'A lista deve conter exatamente 73 livros. Atualmente contém {count} {books}.',
    bookListCannotBeEmpty: 'A lista de livros não pode estar vazia',
    bookNames: 'Nomes dos livros',
    books2to4: 'livros',
    books5plus: 'livros',
    cancelButton: 'Cancelar',
    editButton: 'Editar',
    nameAlreadyExists: 'Este nome já existe',
    nameCannotBeEmpty: 'O nome não pode estar vazio',
    removeButton: 'Remover',
    removeTooltipAppBookNaming: 'Não é possível remover a nomenclatura que está sendo usada na tela do aplicativo',
    removeTooltipCopyTemplate: 'Não é possível remover. A nomenclatura é usada no modelo de cópia "{templateName}" para o idioma {locale}',
    saveButton: 'Salvar',
    standardName: 'Nome padrão',
    title: 'Nomenclatura dos livros bíblicos',
    useOnAppScreen: 'Usar na tela do aplicativo'
  },
  settingsCopyTemplates: {
    addButton: 'Adicionar novo modelo',
    addNewTemplate: 'Adicionar novo modelo',
    bookNaming: 'Nomenclatura dos livros',
    bookNamingRequired: 'A nomenclatura dos livros é obrigatória',
    cancelButton: 'Cancelar',
    closeButton: 'Fechar',
    defaultTemplate: 'Modelo padrão',
    defaultTemplateTooltip: 'Não é possível remover o modelo padrão',
    editTemplate: 'Editar modelo',
    error: 'Erro',
    formatRequired: 'O formato é obrigatório',
    formatTemplate: 'Modelo de formatação',
    nameExists: 'Um modelo com este nome já existe',
    nameRequired: 'O nome é obrigatório',
    no: 'Não',
    ok: 'OK',
    removeButton: 'Remover',
    removeConfirm: 'Tem certeza de que deseja remover o modelo',
    removeTitle: 'Remover modelo',
    saveButton: 'Salvar',
    setAsDefault: 'Definir como padrão',
    templateDescription: 'Selecione o modelo de formatação e a nomenclatura dos livros:',
    templateName: 'Nome do modelo',
    theSameExists: 'Já existe um modelo com o mesmo formato e nomenclatura dos livros com o nome',
    title: 'Modelos de cópia',
    yes: 'Sim'
  },
  settingsFormatTemplates: {
    addButton: 'Adicionar novo modelo',
    afterContent: 'Após o conteúdo',
    appDisplay: 'Na tela do aplicativo',
    beforeContent: 'Antes do conteúdo',
    cancelButton: 'Cancelar',
    charsAfter: 'depois',
    charsBefore: 'antes',
    charsAroundQuote: 'Caracteres ao redor da citação',
    charsAroundReference: 'Caracteres ao redor da referência',
    charsAroundTranslationAbbreviation: 'Caracteres ao redor da abreviação da tradução',
    charsAroundVerseNumber: 'Caracteres ao redor do número do versículo',
    editTitle: 'Editar modelo de formatação',
    example: 'Exemplo de passagem formatada',
    forLanguage: 'para o idioma',
    lowercase: 'Minúsculas',
    nameAlreadyExists: 'Um modelo com este nome já existe',
    nameCannotBeEmpty: 'O nome não pode estar vazio',
    newLine: 'Em nova linha',
    newLineForEachVerse: 'Nova linha para cada versículo',
    no: 'Não',
    none: 'Nenhum',
    rangeChar: 'Caractere de intervalo',
    referencePosition: 'Posição da referência',
    referenceWithoutContent: 'Referência sem conteúdo',
    removeButton: 'Remover',
    removeDialogMessage: 'Tem certeza de que deseja remover o modelo',
    removeDialogTitle: 'Remover modelo',
    removeTooltipAppScreen: 'Não é possível remover. O modelo é usado na tela do aplicativo',
    removeTooltipCopyTemplate: 'Não é possível remover. O modelo é usado no modelo de cópia',
    sameLine: 'Na mesma linha',
    saveButton: 'Salvar',
    separatorChar: 'Caractere separador',
    templateName: 'Nome do modelo',
    title: 'Modelos de formatação',
    translationAbbreviation: 'Abreviação da tradução',
    uppercase: 'Maiúsculas',
    versesWithNumbers: 'Versículos com números',
    yes: 'Sim'
  },
  settingsGeneral: {
    locale: 'Idioma e região padrão',
    defaultSearchResultLayout: 'Layout padrão dos resultados de pesquisa',
    defaultTranslation: 'Tradução padrão',
    formatted: 'Formatado',
    referencePickerOnStart: 'Exibir botões de seleção de livro/capítulo ao abrir a página',
    split: 'Dividido',
    title: 'Configurações gerais',
    githubRepo: 'Repositório GitHub',
    contactEmail: 'E-mail de contato',
    highlightingEnabled: 'Ativar destaque de versículos'
  },
  settingsImportExport: {
    title: 'Importar / Exportar',
    lastImportedFile: 'Último arquivo carregado',
    selectSettingsFile: 'Selecione o arquivo de configurações',
    importButton: 'Importar',
    exportButton: 'Exportar',
    resetSettings: 'Redefinir configurações',
    settingsSaved: 'Configurações salvas no arquivo: {filename}',
    settingsNotSaved: 'Não foi possível salvar as configurações',
    importSuccess: 'Configurações importadas com sucesso',
    resetConfirmTitle: 'Redefinir configurações',
    resetConfirmMessage: 'Tem certeza de que deseja redefinir todas as configurações?',
    yes: 'Sim',
    no: 'Não',
    resetSuccess: 'Configurações redefinidas com sucesso',
    selectFileFirst: 'Primeiro selecione um arquivo'
  },
  settingsPage: {
    appearance: 'Aparência',
    bookNames: 'Nomes dos livros',
    copyTemplates: 'Modelos de cópia',
    formatTemplates: 'Modelos de formatação',
    general: 'Geral',
    highlights: 'Destaques',
    importExport: 'Importar / Exportar',
    translations: 'Traduções'
  },
  settingsTranslations: {
    allSelected: 'Todas selecionadas',
    defaultTranslation: 'Tradução padrão',
    downloading: 'Baixando ...',
    selectAll: 'Selecionar todas para o idioma',
    selected: 'Selecionadas',
    title: 'Traduções'
  },
  highlight: {
    title: 'Destaques',
    palette: 'Paleta de Destaque',
    applyHighlight: 'Aplicar destaque',
    removeHighlight: 'Remover destaque',
    clearAllHighlights: 'Limpar todos os destaques',
    viewByColor: 'Ver por cor',
    manageColors: 'Gerir cores',
    tooltips: {
      togglePalette: 'Mostrar/ocultar paleta de destaque (H)',
      applyColor: 'Aplicar destaque {color}',
      removeColor: 'Remover destaque',
      activeColor: 'Cor ativa: {color}',
      viewFiltered: 'Ver todos os destaques {color}',
      reorderColors: 'Arraste para reordenar cores'
    },
    stats: {
      highlightCount: '{count} versículos destacados no capítulo atual',
      totalHighlights: '{count} versículos destacados no total',
      noHighlights: 'Ainda sem destaques',
      colorUsage: '{count} passagens destacadas com esta cor'
    },
    filter: {
      title: 'Passagens Destacadas',
      selectColor: 'Selecionar cor para filtrar',
      allColors: 'Todas as cores ({count})',
      noPassages: 'Nenhuma passagem destacada com esta cor',
      groupedByBook: 'Agrupado por livro',
      clickToNavigate: 'Clique para navegar para a passagem',
      clearColorHighlights: 'Limpar todos os destaques {color}',
      removePassage: 'Remover destaque desta passagem'
    },
    colorManager: {
      title: 'Gerir Cores de Destaque',
      addColor: 'Adicionar Nova Cor',
      editColor: 'Editar Cor',
      removeColor: 'Remover Cor',
      colorName: 'Nome da Cor',
      colorHex: 'Código da Cor',
      colorPreview: 'Pré-visualização',
      reorder: 'Arraste para reordenar',
      removeConfirm: 'Remover esta cor?',
      removeConfirmMessage: 'Isto irá remover {count} passagens destacadas. Esta ação não pode ser desfeita.',
      cannotRemoveLast: 'Não é possível remover a última cor',
      invalidHex: 'Código de cor inválido',
      nameRequired: 'O nome da cor é obrigatório',
      pickColor: 'Escolher uma cor'
    },
    translationMismatch: 'Incompatibilidade de Tradução',
    translationMismatchMessage: 'Tem destaques para {original} mas está a visualizar {current}. Mude de tradução para ver os seus destaques.',
    translationMismatchDismiss: 'Dispensar',
    translationMismatchLearnMore: 'Saber Mais',
    shortcuts: {
      apply: 'Ctrl+H - Aplicar cor ativa'
    },

    importExport: {
      selectFile: 'Selecionar ficheiro de destaques',
      exportSuccess: 'Destaques exportados para o ficheiro: {filename}',
      exportFailed: 'Falha ao exportar destaques',
      importSuccess: 'Destaques importados com sucesso',
      importFailed: 'Falha ao importar destaques',
      resetHighlights: 'Redefinir destaques',
      resetConfirmTitle: 'Redefinir destaques',
      resetConfirmMessage: 'Tem a certeza de que deseja eliminar todos os destaques? Esta ação não pode ser desfeita.',
      resetSuccess: 'Destaques redefinidos com sucesso'
    }
  }
}
