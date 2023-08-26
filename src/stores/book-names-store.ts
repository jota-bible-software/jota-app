import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getBookNames } from 'src/logic/data'
import { useSettingsStore } from './settings-store'

export function useBookNamesStore(key: string, model: string[]) {
  return defineStore(`book-names-${key}`, () => {
    const settings = useSettingsStore()
    const selectedBookNaming = ref('')
    const showSelectButton = ref(false)
    const showList = ref(false)

    const bookNamesText = ref(model.join(', '))

    watch(selectedBookNaming, newValue => {
      model = getBookNames(settings.lang, newValue)
      bookNamesText.value = model.join(', ')
      showList.value = false
      showSelectButton.value = false
    })

    return { bookNamesText, model, showList, showSelectButton, selectedBookNaming }
  })()
}
