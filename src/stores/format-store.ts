import { defineStore } from 'pinia'
import { bookNamings, translationSamples } from 'src/logic/data'
import { useSettingsStore } from './settings-store'
import { usePassageFormat } from 'src/composables/usePassageFormat'
import { PassageFormat } from 'src/types'
import { useBookNamesStore } from './book-names-store'

const settings = useSettingsStore()
const sample = translationSamples[settings.lang]
export const useFormatStore = defineStore('format', {
  state: () => ({
    editor: {
      bookNamings,
      bookNames: settings.persist.langDefaults[settings.lang].appBookNames,
      referenceNewLine: 'same line',
      referencePosition: 'before',
      separatorChar: ':',
      quotes: true,
      numbers: true,
      verseNewLine: false,
      translation: 'uppercase',
    } as PassageFormat,
    list: []
  }),
  getters: {
    formatter: state => usePassageFormat(state.editor),
    ref1(): string { return this.formatter.formatReference([42, 0, 0], sample) },
    content1(): string { return this.formatter.formatContent([42, 0, 0], sample) },

    format_1Html: (state) => {
      const formatter = usePassageFormat(state.editor)
      return formatter.format([42, 0, 0], translationSamples[settings.lang]).replace(/\n/g, '<br/>')
    },
    format_2Html: (state) => {
      const formatter = usePassageFormat(state.editor)
      return formatter.format([42, 0, 0, 2], translationSamples[settings.lang]).replace(/\n/g, '<br/>')
    },
  },

})
