<template>
  <q-select v-model="selected" :options="localeOptions" emit-value popup-content-style="white-space: nowrap" dense>
    <template v-slot:selected>
      <FlagIcon :lang="getRegionCode(selected)" />
      <span class="gt-sm q-ml-md">{{ getDisplayName(selected) }}</span>
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>
            <FlagIcon :lang="getRegionCode(scope.opt.value)" />
            <span class="q-ml-md">{{ getDisplayName(scope.opt.value) }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { localeData } from 'src/logic/data'
import FlagIcon from './FlagIcon.vue'
import { useSettingsStore } from 'src/stores/settings-store'
import { LocaleSymbol } from 'src/types'
import { useI18n } from 'vue-i18n'

const store = useSettingsStore()

const { locale } = useI18n({ useScope: 'global' })

const localeOptions = computed(() =>
  localeData.map(locale => ({
    value: locale.symbol,
    label: `${locale.langName} (${locale.regionName})`
  }))
)

const selected = computed({
  get: () => store.persist.appearance.locale,
  set: (value: LocaleSymbol) => {
    store.persist.appearance.locale = value
    locale.value = value
  }
})

function getRegionCode(locale: string): string {
  return locale ? locale.split('-')[1].toLowerCase() : ''
}

function getDisplayName(locale: string): string {
  const localeInfo = localeData.find(l => l.symbol === locale)
  if (!localeInfo) return locale

  const [lang, region] = locale.split('-')
  if (lang.toLowerCase() === region.toLowerCase()) {
    return localeInfo.langName
  } else {
    return `${localeInfo.langName} (${localeInfo.regionName})`
  }
}
</script>
