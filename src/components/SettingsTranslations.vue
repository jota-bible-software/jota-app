<template>
  <SettingsPanel title="Przekłady">
    <LabelRow label="Domyślny przekład">
      <BibleSelector v-model="settings.persist.defaultTranslation" />
    </LabelRow>
    <LabelRow label="Wszystkich wybranych">
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
                @update:model-value="v => store.selectLang(lang.symbol, v)">
                <q-tooltip>Wybierz wszystkie dla języka {{ lang.symbol }}</q-tooltip>
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
              <span>Selected: </span>
              <span>{{ store.selectedCount(lang.symbol) }} / {{ store.getTranslations(lang.symbol).length }} </span>
            </div>
          </q-item-section>
        </template>

        <!-- Translations -->
        <q-list padding dense>

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
              <q-toggle v-model="item.selected" @update:model-value="v => store.select(item, v)" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption v-if="item.selected && !item.content">
                Pobieranie ...
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row items-center q-gutter-md">
                <span>{{ item.symbol }}</span>
                <!-- <span class="gt-sx">{{ store.formatMB(item.size) }} MB</span> -->
                <!-- <q-toggle color="blue" v-model="store.selected" val="battery" dense /> -->
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
import { computed } from 'vue'
import { supportedLanguageSymbols } from 'src/logic/data'
import { useTranslationStore } from 'stores/translation-store'
import { useSettingsStore } from 'src/stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import LabelRow from './LabelRow.vue'
import FlagIcon from './FlagIcon.vue'
import BibleSelector from './BibleSelector.vue'

const store = useTranslationStore()
const settings = useSettingsStore()

const allSelectedCount = computed(() => supportedLanguageSymbols.reduce((sum, lang) => sum + store.selectedCount(lang), 0))
const allCount = store.translations.length

console.log(settings.persist.defaultTranslation)

</script>

<style lang="scss" >
#translations {
  max-width: 500px;
}

.highlight {
  >div {
    >div.q-item {
      background-color: var(--q-selection);
    }
  }
}
</style>
