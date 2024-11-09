<template v-slot:after>
  <q-btn :value="store.words" @click="toggle" dense flat no-caps icon="icon-mdi-arrow-expand-horizontal"
    :text-color="store.words ? 'primary' : 'disabled'" v-close-popup>
    <q-tooltip>{{ tooltip }}</q-tooltip>
    <span v-if="inMenu" class="button-menu-item">{{ $t('buttonWholeWords.wholeWords') }}</span>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSearchStore } from 'src/stores/search-store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useSearchStore()

defineProps({
  inMenu: Boolean,
})

const tooltip = computed(() => (store.words ? t('buttonWholeWords.disable') : t('buttonWholeWords.enable')))

function toggle() {
  store.words = !store.words
}
</script>
