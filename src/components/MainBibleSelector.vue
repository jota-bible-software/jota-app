<template>
  <BibleSelector :model-value="store.currentTranslation" @update:model-value="(value: TranslationKey) => store.currentKey = value"
    :translations="store.translationsGrouped" flag="true" />
</template>

<script setup lang="ts">
import { TranslationKey } from 'src/types'
import BibleSelector from './BibleSelector.vue'
import { useTranslationStore } from 'src/stores/translation-store'

const store = useTranslationStore()
</script>

<style scoped></style>
