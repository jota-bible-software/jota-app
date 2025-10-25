<template>
  <SettingsPanel :name="name" :title="$t('settingsTranslations.title')">
    <LabelRow :label="$t('settingsTranslations.allSelected')">
      <span class="text-bold" :data-tag="tags.settingsTranslationsAllSelected">{{ store.allSelectedCount }} /
        {{ store.translations.length }}</span>
    </LabelRow>
    <q-list id="translations" class="rounded-borders">
      <q-expansion-item v-for="(group, i) in store.groups" :key="group.locale" :default-opened="group.locale === settings.persist.app.defaultLocale"
        group="a" :class="{ highlight: store.currentKey.locale === group.locale }" @show="store.currentKey.locale = group.locale" bordered
        :data-tag="tags.settingsTranslationGroup">

        <!-- Collapsible Header -->
        <template v-slot:header>
          <q-item-section :data-tag="tags.settingsTranslationGroupHeader">
            <div class="row items-center q-gutter-sm">
              <q-toggle :model-value="group.selectedStatus" @update:model-value="group.toggleSelected"
                :data-tag="tags.settingsTranslationGroupToggle">
                <q-tooltip>{{ $t('settingsTranslations.selectAll') }} {{ group.locale }}</q-tooltip>
              </q-toggle>
              <q-btn flat :data-tag="tags.settingsTranslationGroupFlag">
                <FlagIcon :region="locale2region(group.locale)" />
              </q-btn>
              <span class="text-weight-bold w-4" :data-tag="tags.settingsTranslationsLocale">
                {{ group.locale }}
              </span>
              <span class="text-weight-bold">
                {{ nativeLanguageName(group.locale) }}
              </span>
            </div>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center q-gutter-md">
              <span>{{ $t('settingsTranslations.selected') }}: </span>
              <span :data-tag="tags.settingsTranslationGroupSelected">{{ group.selectedCount }} / {{ group.translationCount }}
              </span>
            </div>
          </q-item-section>
        </template>

        <!-- Updated BibleSelector with None option -->
        <LabelRow :label="$t('settingsTranslations.defaultTranslation')" class="q-pa-md">
          <BibleSelector v-model="group.defaultTranslation.value" :translations="[{ symbol: '', title: '' }, ...group.translations]" class="col"
            :data-tag="tags.settingsTranslationDefault" />
        </LabelRow>

        <!-- Rest of the component remains the same -->
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
          <q-item v-for="translation in group.translations" :key="translation.symbol" v-ripple class="items-center"
            :data-tag="tags.settingsTranslationItem">
            <q-item-section side top>
              <q-toggle v-model="translation.selected.value" :data-tag="tags.settingsTranslationItemToggle" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ translation.title }}</q-item-label>
              <!-- <q-item-label caption v-if="item.selected && !item.content">
                {{ $t('settingsTranslations.downloading') }}
              </q-item-label> -->
            </q-item-section>

            <q-item-section side class="highlight-toggle-section">
              <div class="row items-center justify-end q-gutter-xs">
                <q-badge v-if="getHighlightCount(translation.locale, translation.symbol) > 0" color="primary"
                  :label="getHighlightCount(translation.locale, translation.symbol)" class="q-mr-sm">
                  <q-tooltip>{{ $t('settingsTranslations.highlightCount') }}</q-tooltip>
                </q-badge>
                <q-toggle v-model="translation.highlightsEnabled.value" :disable="!translation.selected.value" icon="highlight">
                  <q-tooltip>{{ $t('settingsTranslations.enableHighlights') }}</q-tooltip>
                </q-toggle>

              </div>
            </q-item-section>

            <q-item-section side class="symbol-section">
              <span>{{ translation.symbol }}</span>
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator v-if="i < store.groups.length" />
      </q-expansion-item>
    </q-list>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { useTranslationStore } from 'src/stores/translation-store'
import { useSettingsStore } from 'src/stores/settings-store'
import { useHighlightStore } from 'src/stores/highlight-store'
import SettingsPanel from './SettingsPanel.vue'
import LabelRow from './LabelRow.vue'
import FlagIcon from './FlagIcon.vue'
import BibleSelector from './BibleSelector.vue'
import { locale2region, nativeLanguageName } from 'src/util'
import * as tags from 'src/tags'

defineProps<{ name: string }>()
const store = useTranslationStore()
const settings = useSettingsStore()
const highlightStore = useHighlightStore()

function getHighlightCount(locale: string, symbol: string): number {
  return highlightStore.getHighlightCountForTranslation(locale, symbol)
}

</script>

<style lang="scss">
#translations {
  max-width: 550px;
}

.w-4 {
  width: 4em;
}

.highlight {
  >div {
    >div.q-item {
      background-color: var(--q-selection);
    }
  }
}

.highlight-toggle-section {
  min-width: 100px;
}

.symbol-section {
  min-width: 3em;
  text-align: right;
}
</style>
