<template>
  <q-tab-panel class="q-ml-xs">
    <div class="q-gutter-md">
      <div class="row items-center ">
        <div class="text-h6">{{ props.title }}</div>

        <LabelRow label="dla języka" v-if="props.lang" class="q-ml-md">
          <LanguageSelector v-model="store.lang" />
        </LabelRow>
      </div>
      <slot></slot>
    </div>
  </q-tab-panel>
</template>

<script setup lan="ts">
import { useSettingsStore } from 'stores/settings-store'
import LanguageSelector from './LanguageSelector.vue'
import LabelRow from './LabelRow.vue'

const store = useSettingsStore()
const props = defineProps({
  title: String,
  lang: Boolean
})
</script>
