<template>
  <q-select v-model="selected" :options="localeOptions" emit-value popup-content-style="white-space: nowrap" dense>
    <template v-slot:selected>
      <FlagIcon :region="locale2region(selected)" />
      <span class="gt-sm q-ml-md">{{ getDisplayName(selected) }}</span>
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>
            <FlagIcon :region="locale2region(scope.opt.value)" />
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
import { locale2region } from 'src/util'
import { LocaleSymbol } from 'src/types'
import { useSettingsStore } from 'src/stores/settings-store'

const store = useSettingsStore()

const props = defineProps(['modelValue', 'flag', 'editions'])
const emit = defineEmits(['update:modelValue'])


const selected = computed({
  get(): LocaleSymbol {
    return props.modelValue
  },
  set(value: LocaleSymbol) {
    emit('update:modelValue', value)
  }
})

const localeOptions = computed(() => {
  // Ensure store.locales exists and is an array
  const availableLocales = store.locales || ['en-US'];
  return localeData.filter(locale => availableLocales.includes(locale.symbol)).map(locale => ({
    value: locale.symbol,
    label: `${locale.langName} (${locale.regionName})`
  }));
})

function getDisplayName(locale: string): string {
  if (!locale) return ''
  const localeInfo = localeData.find(l => l.symbol === locale)
  if (!localeInfo) return locale

  const parts = locale.split('-')
  if (parts.length < 2) return localeInfo.langName
  
  const [lang, region] = parts
  if (lang.toLowerCase() === region.toLowerCase()) {
    return localeInfo.langName
  } else {
    return `${localeInfo.langName} (${localeInfo.regionName})`
  }
}
</script>
