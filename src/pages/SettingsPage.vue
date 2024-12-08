<template>
  <q-page>

    <div :class="classes">
      <div class="col-auto gt-sm">
        <q-tabs v-model="store.currentTab" vertical dense active-color="primary" no-caps outside-arrows mobile-arrows>
          <q-tab name="general" :label="$t('settingsPage.general')" :data-tag="tags.settingsPageGeneral" />
          <q-tab name="appearance" :label="$t('settingsPage.appearance')" :data-tag="tags.settingsPageAppearance" />
          <q-tab name="editions" :label="$t('settingsPage.editions')" :data-tag="tags.settingsPageEditions" />
          <q-tab name="bookNames" :label="$t('settingsPage.bookNames')" :data-tag="tags.settingsPageBookNames" />
          <q-tab name="formatTemplates" :label="$t('settingsPage.formatTemplates')"
            :data-tag="tags.settingsPageFormatTemplates" />
          <q-tab name="copyTemplates" :label="$t('settingsPage.copyTemplates')"
            :data-tag="tags.settingsPageCopyTemplates" />
          <q-tab name="importExport" :label="$t('settingsPage.importExport')"
            :data-tag="tags.settingsPageImportExport" />
        </q-tabs>
      </div>
      <div class="col q-px-xs">
        <q-tab-panels v-model="store.currentTab">
          <SettingsGeneral name="general" />
          <SettingsAppearance name="appearance" />
          <SettingsEditions name="editions" />
          <SettingsBookNames name="bookNames" />
          <SettingsFormatTemplates name="formatTemplates" />
          <SettingsCopyTemplates name="copyTemplates" />
          <SettingsImportExport name="importExport" />
        </q-tab-panels>
      </div>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import SettingsGeneral from 'src/components/SettingsGeneral.vue'
import SettingsAppearance from 'src/components/SettingsAppearance.vue'
import SettingsEditions from 'src/components/SettingsEditions.vue'
import SettingsBookNames from 'src/components/SettingsBookNames.vue'
import SettingsFormatTemplates from 'src/components/SettingsFormatTemplates.vue'
import SettingsCopyTemplates from 'src/components/SettingsCopyTemplates.vue'
import SettingsImportExport from 'src/components/SettingsImportExport.vue'
import { useSettingsStore } from 'src/stores/settings-store'
import { useQuasar } from 'quasar'
import * as tags from 'src/tags'

const store = useSettingsStore()
const $q = useQuasar()
const classes = computed(() => ['row', { 'q-px-xl': $q.screen.gt.sm }])
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
</style>
