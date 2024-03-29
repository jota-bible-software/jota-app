import { Dark, colors } from 'quasar'
import books from 'src/logic/books'
import jota from 'src/logic/jota'

const localStorageKey = 'pl.netanel.jota.settings'
const data = JSON.parse(localStorage.getItem(localStorageKey))

export const defaultState = {
  version: '0.5.0',
  bookNames: books.bookAbbreviations.pl.join(', '),
  darkMode: true,
  defaultBible: 'Uwspółcześniona Biblia Gdańska (2017)',
  defaultFormat: '',
  defaultFormatTemplate: 'Polska prezentacja',
  defaultFormatByLocale: {
    en: '',
    pl: ''
  },
  defaultSearchResultLayout: 'formatted',
  example: 1,
  formatTemplates: [
    { name: 'English presentation', pattern: {} },
    { name: 'Polska prezentacja', pattern: {} },
  ],
  format1: '${book} ${chapter}${separator}${start} "${text}"',
  format2: '${book} ${chapter}${separator}${start}-${end} "${textNumbers}"',
  format3: '${book} ${chapter}${separator}${start}-${end} ${textNumbersNewLines}',
  lastRoute: '',
  plan: '',
  planStartDate: '',
  planProgress: 0,
  separator: ',',
  threshold1: 1,
  threshold2: 2,
  threshold3: 10,
}

const state = {
  ...defaultState,
  ...data,
}

const getters = {
  books: state => state.bookNames.split(',').map(s => s.trim()),
  thresholdFormats: state => {
    return [1, 2, 3].map(i => {
      const templateKey = 'format' + i
      let template
      try {
        template = state[templateKey]
      } catch {
        template = defaultState[templateKey]
      }
      return {
        threshold: state['threshold' + i] || 1000,
        format: template
      }
    })
  },
  formatted: (state, getters, rootState, rootGetters) => (fragment, separator) => {
    return jota.formatThreshold(getters.thresholdFormats, fragment, rootState.bibles.content,
      state.bookNames.split(', '), separator, rootGetters['bibles/symbol'])
  },
  formattedExample: (state, getters, rootState, rootGetters) => {
    let result = ''
    try {
      result = format(state, rootState, rootGetters, state.example)
    } catch (e) {
      result = 'Błąd w formule: ' + e
    }
    return result
  },
}

function format(state, rootState, rootGetters, example) {
  const fragment =
    example === 1 ? [0, 0, 0, last(state.threshold1) - 1] :
      example === 2 ? [0, 0, 0, last(state.threshold2) - 1] : [0, 0, 0, last(state.threshold2) - 1]
  return jota.format(
    rootState.bibles.content,
    fragment,
    state['format' + example],
    state.bookNames.split(', '),
    state.separator,
    rootGetters['bibles/symbol']).replace(/\n/g, '<br>')

  function last(n) {
    return n === undefined ? 10 : n
  }
}

const mutations = {}
Object.keys(state).forEach(k => {
  mutations[k] = (state, payload) => {
    state[k] = payload
    saveToLocalStorage()
  }
})
mutations.darkMode = (state, value) => {
  state.darkMode = value
  Dark.set(value)
  saveToLocalStorage()
  applyDarkMode()
}

const actions = {
  init(context) {
    if (context.state.darkMode !== undefined) {
      context.commit('darkMode', context.state.darkMode)
    }
  },
  save(context, payload) {
    context.commit('mutate', payload)
    saveToLocalStorage()
  }
}

function saveToLocalStorage() {
  localStorage.setItem(localStorageKey, JSON.stringify(state))
}

function migrate(storedVersion) {
  if (!storedVersion) {
    const changeFormat = s => { state[s] = state[s].replace('textWithNumbers', 'textNumbers').replace('textWithNewLines', 'textNumbersNewLines') }
    changeFormat('format1')
    changeFormat('format2')
    changeFormat('format3')
    saveToLocalStorage()
  }
}

migrate(data && data.version)

function applyDarkMode() {
  if (Dark.isActive) {
    const primary = '#3b88d4'
    const secondary = '#61B0FF'
    const accent = '#D49B3B'
    const foreground = '#bcc5cf'
    const background = '#252525'
    colors.setBrand('primary', primary)
    colors.setBrand('secondary', secondary)
    colors.setBrand('accent', accent)
    colors.setBrand('foreground', foreground)
    colors.setBrand('background', background)
    // On Safari, without changing alpha the color will be wrong, looking closer to background
    colors.setBrand('selection', colors.changeAlpha(colors.lighten(primary, -50), 0.99))
    colors.setBrand('border', colors.lighten(background, 20))
    colors.setBrand('scrollbar-thumb', colors.lighten(background, 10))
    colors.setBrand('scrollbar-thumb-hover', colors.lighten(background, 20))
    colors.setBrand('alternate', colors.lighten(colors.getBrand('primary'), 20))
  } else {
    const primary = '#1976D2'
    const secondary = '#1976D2'
    const secondary1 = '#0A5CAD'
    const accent = '#D18C19'
    const foreground = '#000000'
    const background = '#ffffff'
    colors.setBrand('primary', primary)
    colors.setBrand('secondary', secondary)
    colors.setBrand('accent', accent)
    colors.setBrand('foreground', foreground)
    colors.setBrand('background', background)
    // On Safari, without changing alpha the color will be wrong, looking closer to background
    colors.setBrand('selection', colors.changeAlpha(colors.lighten(primary, 85), 0.99))
    colors.setBrand('border', colors.lighten(background, -20))
    colors.setBrand('scrollbar-thumb', colors.lighten(background, -15))
    colors.setBrand('scrollbar-thumb-hover', colors.lighten(background, -30))
    colors.setBrand('alternate', colors.lighten(colors.getBrand('primary'), 20))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
