<template>
  <q-page class="">
    <div class="row q-px-xl">
      <div class="col-auto">
        <q-tabs v-model="tab" vertical dense active-color="primary" no-caps outside-arrows mobile-arrows>
          <q-tab name="general" label="Ogólne" />
          <q-tab name="translations" label="Przekłady" />
          <q-tab name="bookNames" label="Nazwy ksiąg" />
          <q-tab name="formatTemplates" label="Szablony formatowania" />
        </q-tabs>
      </div>
      <div class="col q-px-xs">
        <q-tab-panels v-model="tab">
          <SettingsGeneral name="general" />
          <SettingsTranslations name="translations" />
          <SettingsBookNames name="bookNames" />
          <SettingsFormatTemplates name="formatTemplates" />
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { langs } from 'src/logic/data'
import { useSettingsStore } from 'src/stores/settings-store'
import BookNamesEditor from 'src/components/BookNamesEditor.vue'
import LanguageSelector from 'src/components/LanguageSelector.vue'
import ScreenModeToggle from 'src/components/ScreenModeToggle.vue'
import PassageFormatEditor from 'src/components/PassageFormatEditor.vue'
import TranslationConfig from 'src/components/TranslationConfig.vue'
import { ref } from 'vue'
import SettingsPanel from 'src/components/SettingsPanel.vue'
import SettingsGeneral from 'src/components/SettingsGeneral.vue'
import SettingsTranslations from 'src/components/SettingsTranslations.vue'
import SettingsBookNames from 'src/components/SettingsBookNames.vue'
import SettingsFormatTemplates from 'src/components/SettingsFormatTemplates.vue'

const store = useSettingsStore()
const lang = ref('pl')

const tab = ref('general')

</script>

<style lang="scss" scoped>
.q-tab {
  justify-content: start;
  padding-left: 24px;
  padding-right: 24px;
}

.q-tab-panels.q-dark {
  color: var(--q-foreground) !important;
  background: var(--q-background) !important;
}

.q-tab-panel {
  padding-top: 0;
}
</style>
