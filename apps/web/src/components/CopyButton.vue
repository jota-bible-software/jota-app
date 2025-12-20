<template>
  <q-btn-dropdown outline dense split :text-color="textColor" class="q-ml-sm" icon="icon-mdi-content-copy" @click="onClick()">

    <template v-slot:label>
      <q-tooltip>{{ $t(props.tooltip) }}</q-tooltip>
    </template>

    <q-list separator>
      <q-item clickable v-close-popup @click="onClick(item)" v-for="item in copyTemplates" :key="item.name" style="max-width: 500px"
        :data-tag="props.dataTagItem">
        <q-item-section>
          <q-item-label>
            <span>{{ item.name }}</span>
            <q-chip v-if="!!defaultSuffix(item)" outline dense color="accent" class="q-ml-md"> {{ defaultSuffix(item) }} </q-chip>
          </q-item-label>
          <q-item-label caption><span v-html="formattedSample(item)" /></q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { CopyTemplateData } from 'src/types'
import { useSearchStore } from 'src/stores/search-store'
import { useSettingsStore } from 'src/stores/settings-store'
import { useTranslationStore } from 'src/stores/translation-store'
import { useI18n } from 'vue-i18n'

const store = useSearchStore()
const translations = useTranslationStore()
const settings = useSettingsStore()
const { t } = useI18n()

const props = defineProps(['tooltip', 'textColor', 'dataTagItem'])
const emit = defineEmits(['click'])

const copyTemplates = computed(() => settings.persist.localeData[translations.currentTranslation.locale].copyTemplates)

function onClick(template?: CopyTemplateData) {
  emit('click', template)
}

function defaultSuffix(item: CopyTemplateData): string {
  return item && item.name === settings.persist.localeData[translations.currentTranslation.locale].defaultCopyTemplate ? t('messageLine.defaultTemplate') : ''
}

function formattedSample(item: CopyTemplateData) {
  return store.formattedSample(item)
}
</script>
