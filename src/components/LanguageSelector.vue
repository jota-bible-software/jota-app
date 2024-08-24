<template>
  <q-select v-model="selected" :options="supportedLanguageSymbols" _label="Dla języka" option-label="symbol" emit-value
    popup-content-style="white-space: nowrap" dense>

    <template v-slot:selected>
      <FlagIcon :lang="selected" />
      <span class="gt-sm q-ml-md">{{ selected.toUpperCase() }}</span>
    </template>

    <template v-slot:option="scope">
      <div v-if="scope.opt.isFirstInGroup" class="row justify-center header">
        {{ scope.opt.lang }}
      </div>

      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>
            <FlagIcon :lang="scope.opt" />
            <span class="q-ml-md">{{ scope.opt.toUpperCase() }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LanguageSymbol } from 'src/types'
import { supportedLanguageSymbols } from 'src/logic/data'
import FlagIcon from './FlagIcon.vue'
import { useSettingsStore } from 'src/stores/settings-store'

const store = useSettingsStore()

const selected = computed({
  get: () => store.persist.appearance.defaultLang,
  set: (value: LanguageSymbol) => {
    store.persist.appearance.defaultLang = value
  }
})
</script>

<style lang="scss" scoped>
</style>
