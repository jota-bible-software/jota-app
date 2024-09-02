<template>
  <SettingsPanel :title="$t('settingsTranslations.title')">
    <LabelRow :label="$t('settingsTranslations.allSelected')">
      <span class="text-bold">{{ allSelectedCount }} / {{ allCount }}</span>
    </LabelRow>
    <q-list id="translations" class="rounded-borders">
      <q-expansion-item v-for="lang in store.languages" :key="lang.symbol" :default-opened="store.isOpen(lang.symbol)"
        group="a" :class="{ highlight: store.isOpen(lang.symbol) }" @show="store.lang = lang.symbol" bordered>

        <!-- Collapsible Header -->
        <template v-slot:header>
          <q-item-section>
            <div class="row items-center q-gutter-sm">
              <q-toggle :model-value="store.selectionStatus(lang.symbol)"
                @update:model-value="(v: boolean) => store.selectLang(lang.symbol, v)">
                <q-tooltip>{{ $t('settingsTranslations.selectAll') }} {{ lang.symbol }}</q-tooltip>
              </q-toggle>
              <q-btn flat>
                <FlagIcon :lang="lang.symbol" />
              </q-btn>
              <span class="text-weight-bold">
                {{ lang.name }}
              </span>
            </div>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center q-gutter-md">
              <span>{{ $t('settingsTranslations.selected') }}: </span>
              <span>{{ store.selectedCount(lang.symbol) }} / {{ store.getTranslations(lang.symbol).length }} </span>
            </div>
          </q-item-section>
        </template>

        <!-- New BibleSelector for default translation -->
        <LabelRow :label="$t('settingsTranslations.defaultTranslation')" class="q-pa-md ">
          <BibleSelector :model-value="getDefaultTranslation(lang.symbol)"
            @update:model-value="updateDefaultTranslation(lang.symbol, $event)" :lang="lang.symbol" class="col" />
        </LabelRow>

        <!-- Translations -->
        <q-list dense class="q-pb-md">


          <!-- Hint -->
          <!-- <q-item-label class="q-pr-md q-py-sm">
              <q-item-section></q-item-section>
              <q-item-section side>
                <div class="row q-gutter-md">
                  <div>Symbol</div>
                  <div class="q-ml-lg gt-sx">Size</div>
                  <div>Store</div>
                </div>
              </q-item-section>
            </q-item-label> -->

          <!-- Translation -->
          <q-item v-for="item in store.getTranslations(lang.symbol)" :key="item.symbol" v-ripple class="items-center">
            <q-item-section side top>
              <q-toggle v-model="item.selected" @update:model-value="(v: boolean) => handleToggle(item, v)" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <!-- <q-item-label caption v-if="item.selected && !item.content">
                {{ $t('settingsTranslations.downloading') }}
              </q-item-label> -->
            </q-item-section>

            <q-item-section side>
              <div class="row items-center q-gutter-md">
                <span>{{ item.symbol }}</span>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator v-if="lang.symbol !== store.languages[store.languages.length - 1].symbol" />
      </q-expansion-item>
    </q-list>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { supportedLanguageSymbols } from 'src/logic/data'
import { useTranslationStore } from 'stores/translation-store'
import { useSettingsStore } from 'src/stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import LabelRow from './LabelRow.vue'
import FlagIcon from './FlagIcon.vue'
import BibleSelector from './BibleSelector.vue'
import { useI18n } from 'vue-i18n'
import { LanguageSymbol, Translation } from 'src/types'

const { t } = useI18n()
const store = useTranslationStore()
const settings = useSettingsStore()


const allSelectedCount = computed(() => supportedLanguageSymbols.reduce((sum, lang) => sum + store.selectedCount(lang), 0))
const allCount = store.translations.length

function isDefault(item: Translation) {
  return item.symbol === getDefaultTranslation(item.lang).symbol
}

function handleToggle(item: Translation, value: boolean) {
  store.select(item, value)
}

function getDefaultTranslation(lang: LanguageSymbol) {
  return settings.persist.languageSettings[lang].defaultTranslation
}

function updateDefaultTranslation(lang: LanguageSymbol, event: any) {
  settings.persist.languageSettings[lang].defaultTranslation = event
  const translations = store.getTranslations(event.lang)
  if (!settings.persist.languageSettings[lang].selectedTranslations.includes(event.symbol)) {
    // settings.persist.languageSettings[lang].selectedTranslations.push(event.symbol)
    const found = translations.find(it => it.symbol === event.symbol)
    if (found) found.selected = true
  }
}
</script>

<style lang="scss">
#translations {
  max-width: 550px;
}

.highlight {
  >div {
    >div.q-item {
      background-color: var(--q-selection);
    }
  }
}
</style>
