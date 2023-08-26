// eslint-disable-next-line vue/multi-word-component-names
<template>
  <q-select dense outlined v-model="selected" :options="store.selectedTranslations" option-label="symbol" emit-value
    popup-content-style="white-space: nowrap">

    <template v-slot:selected>
      {{ selectedLabel }}
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-item-label>{{ scope.opt.symbol.toUpperCase() }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label><span v-html="scope.opt.title" /></q-item-label>
        </q-item-section>
      </q-item>
    </template>

  </q-select>
</template>

<script setup lang="ts">
import { useTranslationStore } from 'src/stores/translation-store'
import { computed } from 'vue'
import { Screen } from 'quasar'
import { Translation } from 'src/types'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const store = useTranslationStore()

const selected = computed({
  get(): Translation {
    return store.selectedTranslations.find(t => t.symbol === props.modelValue) || store.selectedTranslations[0]
    // const t = store.translations.find(t => t.symbol === props.modelValue)
    // // if (!t) return 
    // const symbol = t && t.symbol.toUpperCase()
    // return Screen.lt.md ? symbol : `${symbol}&nbsp;&nbsp;|&nbsp;&nbsp;${t && t.title}`
  },
  set(value: Translation) {
    // Inform the parent about the value change
    emit('update:modelValue', value.symbol)
  }
})

const selectedLabel = computed(() => {
  const symbol = selected.value.symbol.toUpperCase()
  return Screen.lt.md ? symbol : symbol + ' - ' + selected.value.title
})

</script>

