<template>
  <SettingsPanel :title="$t('settingsEditions.title')">
    <LabelRow :label="$t('settingsEditions.allSelected')">
      <span class="text-bold" :data-tag="tags.settingsEditionsAllSelected">{{ store.allSelectedCount }} /
        {{ store.editions.length }}</span>
    </LabelRow>
    <q-list id="editions" class="rounded-borders">
      <q-expansion-item v-for="(group, i) in store.groups" :key="group.locale"
        :default-opened="group.locale === settings.persist.appearance.locale" group="a"
        :class="{ highlight: store.currentKey.locale === group.locale }" @show="store.currentKey.locale = group.locale"
        bordered :data-tag="tags.settingsEditionGroup">

        <!-- Collapsible Header -->
        <template v-slot:header>
          <q-item-section :data-tag="tags.settingsEditionGroupHeader">
            <div class="row items-center q-gutter-sm">
              <q-toggle :model-value="group.selectedStatus" @update:model-value="group.toggleSelected"
                :data-tag="tags.settingsEditionGroupToggle">
                <q-tooltip>{{ $t('settingsEditions.selectAll') }} {{ group.locale }}</q-tooltip>
              </q-toggle>
              <q-btn flat :data-tag="tags.settingsEditionGroupFlag">
                <FlagIcon :region="locale2region(group.locale)" />
              </q-btn>
              <span class="text-weight-bold w-4" :data-tag="tags.settingsEditionsLocale">
                {{ group.locale }}
              </span>
              <span class="text-weight-bold">
                {{ nativeLanguageName(group.locale) }}
              </span>
            </div>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center q-gutter-md">
              <span>{{ $t('settingsEditions.selected') }}: </span>
              <span :data-tag="tags.settingsEditionGroupSelected">{{ group.selectedCount }} / {{ group.editionCount }}
              </span>
            </div>
          </q-item-section>
        </template>

        <!-- Updated BibleSelector with None option -->
        <LabelRow :label="$t('settingsEditions.defaultEdition')" class="q-pa-md">
          <BibleSelector v-model="group.defaultEdition.value" :editions="[{ symbol: '', title: '' }, ...group.editions]"
            class="col" :data-tag="tags.settingsEditionDefault" />
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

          <!-- Edition -->
          <q-item v-for="edition in group.editions" :key="edition.symbol" v-ripple class="items-center"
            :data-tag="tags.settingsEditionItem">
            <q-item-section side top>
              <q-toggle v-model="edition.selected.value" :data-tag="tags.settingsEditionItemToggle" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ edition.title }}</q-item-label>
              <!-- <q-item-label caption v-if="item.selected && !item.content">
                {{ $t('settingsEditions.downloading') }}
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
import { locale2region, nativeLanguageName } from 'src/util'
import * as tags from 'src/tags'

const store = useEditionStore()
const settings = useSettingsStore()

</script>

<style lang="scss">
#editions {
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
</style>
