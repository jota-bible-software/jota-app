<template>
  <q-btn :value="store.showPicker" @click="toggle" dense flat no-caps icon="icon-mat-checklist"
    :text-color="store.showPicker ? 'primary' : 'disabled'" v-close-popup :checked="store.showPicker"
    @change="(v: boolean) => store.showPicker = v" :data-tag="tags.referencePickerToggle">
    <span v-if="inMenu" class="button-menu-item">{{ $t('buttonBookSelector.selectBookChapter') }}</span>
    <q-tooltip>{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import * as tags from 'src/tags'
import { useSearchStore } from 'src/stores/search-store'

const { t } = useI18n()
const store = useSearchStore()

defineProps({ inMenu: Boolean })

const tooltip = computed(() => store.showPicker ? t('buttonBookSelector.hideButtons') : t('buttonBookSelector.showButtons'))

function toggle() {
  store.showPicker = !store.showPicker
}
</script>
