import { defineStore } from 'pinia'
import { translations as translationsData } from 'src/logic/data'
import { Translation } from 'src/types'
import { useSettingsStore } from './settings-store'
import jota from 'src/logic/jota'

const bibleLoading = [
  [
    ['Pobieranie...']
  ]
]

export const useBibleStore = defineStore('bible', {
  state: () => ({
    content: bibleLoading,
    loading: true,
    translations: translationsData,
    translation: translationsData[0],
  }),

  getters: {
    lang: (state) => state.translation.lang,
    symbol: (state) => state.translation.symbol,
    title: (state) => state.translation.title,
  },

  actions: {
    async init() {
      const settingsStore = useSettingsStore()
      const translation = this.translations.find(t => t.symbol === settingsStore.defaultTranslation)
      if (translation) await this.select(translation)
    },

    async selectTitle(title: string) {
      const translation = this.translations.find(t => t.title === title)
      if (translation) await this.select(translation)
    },

    async select(translation: Translation) {
      this.translation = translation
      this.loading = true

      const { lang, symbol } = this.translation
      const bible = await jota.getBible(lang, symbol)
      this.loading = false
      Object.freeze(bible)
      this.content = bible
    },
  },
})

useBibleStore().init()
