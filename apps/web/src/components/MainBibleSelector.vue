<template>
  <BibleSelector :model-value="store.currentTranslation" @update:model-value="handleUpdate"
    :translations="store.translationsGrouped" :flag="true" />
</template>

<script setup lang="ts">
import { TranslationItem, TranslationKey } from 'src/types'
import BibleSelector from './BibleSelector.vue'
import { useTranslationStore } from 'src/stores/translation-store'

const store = useTranslationStore()

function handleUpdate(value: TranslationItem | TranslationKey | null) {
  if (value) {
    store.currentKey = { locale: value.locale, symbol: value.symbol }
  }
}
</script>

<style scoped></style>
