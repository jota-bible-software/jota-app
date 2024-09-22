<template>
  <SettingsPanel :title="$t('settingsTranslations.title')">
    <LabelRow :label="$t('settingsTranslations.allSelected')">
      <span class="text-bold">{{ store.allSelectedCount }} / {{ store.editions.length }}</span>
    </LabelRow>
    <q-list id="translations" class="rounded-borders">
      <q-expansion-item v-for="(group, i) in store.groups" :key="group.lang"
        :default-opened="group.lang === settings.lang" group="a" :class="{ highlight: store.focusLang === group.lang }"
        @show="store.focusLang = group.lang" bordered>

        <!-- Collapsible Header -->
        <template v-slot:header>
          <q-item-section>
            <div class="row items-center q-gutter-sm">
              <q-toggle :model-value="group.selectedStatus" @update:model-value="group.toggleSelected">
                <q-tooltip>{{ $t('settingsTranslations.selectAll') }} {{ group.lang }}</q-tooltip>
              </q-toggle>
              <q-btn flat>
                <FlagIcon :lang="group.lang" />
              </q-btn>
              <span class="text-weight-bold w-4">
                {{ group.lang }}
              </span>
              <span class="text-weight-bold">
                {{ nativeLanguageName(group.lang) }}
              </span>
            </div>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center q-gutter-md">
              <span>{{ $t('settingsTranslations.selected') }}: </span>
              <span>{{ group.selectedCount }} / {{ group.editionCount }} </span>
            </div>
          </q-item-section>
        </template>

        <!-- New BibleSelector for default translation -->
        <LabelRow :label="$t('settingsTranslations.defaultTranslation')" class="q-pa-md ">
          <BibleSelector v-model="group.defaultEdition.value" :editions="group.editions" class="col" />
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
          <q-item v-for="edition in group.editions" :key="edition.symbol" v-ripple class="items-center">
            <q-item-section side top>
              <q-toggle v-model="edition.selected.value" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ edition.title }}</q-item-label>
              <!-- <q-item-label caption v-if="item.selected && !item.content">
                {{ $t('settingsTranslations.downloading') }}
              </q-item-label> -->
            </q-item-section>

            <q-item-section side>
              <div class="row items-center q-gutter-md">
                <span>{{ edition.symbol }}</span>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator v-if="i < store.groups.length" />
      </q-expansion-item>
    </q-list>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { useEditionStore } from 'src/stores/edition-store'
import { useSettingsStore } from 'src/stores/settings-store'
import SettingsPanel from './SettingsPanel.vue'
import LabelRow from './LabelRow.vue'
import FlagIcon from './FlagIcon.vue'
import BibleSelector from './BibleSelector.vue'
import { nativeLanguageName } from 'src/util'

const store = useEditionStore()
const settings = useSettingsStore()

</script>

<style lang="scss">
#translations {
  max-width: 550px;
}

.w-4 {
  width: 2em;
}

.highlight {
  >div {
    >div.q-item {
      background-color: var(--q-selection);
    }
  }
}
</style>
