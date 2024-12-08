<template>
  <BibleSelector :model-value="store.currentEdition"
    @update:model-value="(value: EditionKey) => store.currentKey = value" :editions="store.editionsGrouped" flag="true" />
</template>

<script setup lang="ts">
import { EditionKey } from 'src/types'
import BibleSelector from './BibleSelector.vue'
import { useEditionStore } from 'src/stores/edition-store'

const store = useEditionStore()
</script>

<style scoped></style>
