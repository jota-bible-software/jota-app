<template>
  <SettingsPanel :title="$t('settingsGeneral.title')">
    <LabelRow :label="$t('settingsGeneral.language')">
      <LanguageSelector v-model="store.persist.appearance.defaultLang" />
    </LabelRow>

    <q-select v-model="locale" :options="localeOptions" label="Quasar Language" dense borderless emit-value map-options
      options-dense style="min-width: 150px" />

    <LabelRow>
      <q-toggle v-model="store.persist.referencePickerOnStart" :label="$t('settingsGeneral.referencePickerOnStart')" />
    </LabelRow>

    <LabelRow :label="$t('settingsGeneral.defaultSearchResultLayout')">
      <q-btn-toggle v-model="store.persist.defaultSearchResultLayout" spread no-caps :options="[
        { label: $t('settingsGeneral.split'), value: 'split' },
        { label: $t('settingsGeneral.formatted'), value: 'formatted' }
      ]" />
    </LabelRow>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import LabelRow from './LabelRow.vue'
import LanguageSelector from './LanguageSelector.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useSettingsStore()

const { locale } = useI18n({ useScope: 'global' })

const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'de', label: 'German' }
]

</script>
