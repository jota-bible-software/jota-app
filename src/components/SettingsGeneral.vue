<template>
  <SettingsPanel :title="$t('settingsGeneral.title')">
    <LabelRow :label="$t('settingsGeneral.defaultLanguage')">
      <LanguageSelector v-model="store.persist.appearance.defaultLang" />
    </LabelRow>

    
    <LabelRow>
      <q-toggle v-model="store.persist.referencePickerOnStart" :label="$t('settingsGeneral.referencePickerOnStart')" />
    </LabelRow>

    <LabelRow :label="$t('settingsGeneral.defaultSearchResultLayout')">
      <q-btn-toggle v-model="store.persist.defaultSearchResultLayout" spread no-caps
        :options="[
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
</script>
