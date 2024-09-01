<template>
  <div class="text-primary q-py-sm gt-sm">
    <!-- Show only on the main page -->
    <div class="row no-wrap items-center">
      <div class="gt-sm page-title"> Jota </div>
      <q-space />
      <span id="translation-label" class="text-secondary q-mr-sm">{{ $t('mainToolbar.translationLabel') }}</span>
      <BibleSelector v-model="store.currentTranslation" class="q-pr-sm gt-sm" />

      <ButtonHelp />
      <ButtonSettings />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from 'src/stores/search-store'
import BibleSelector from 'src/components/BibleSelector.vue'
import ButtonHelp from 'src/components/ButtonHelp.vue'
import ButtonSettings from 'src/components/ButtonSettings.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useSearchStore()
</script>

<style lang="scss" scoped>
</style>
