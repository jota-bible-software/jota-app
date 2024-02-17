<template>
  <q-tab-panel class="q-pl-lg q-pt-none">
    <div class="q-gutter-md">
      <div class="row items-center q-gutter-md q-mt-none q-ml-none">
        <q-btn v-if="isBackDefined" flat icon="icon-mat-arrow_back_ios" class="q-ml-none" @click="emit('back')" />
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
  lang: Boolean,
  onBack: Function,
})
const isBackDefined = !!props.onBack
const emit = defineEmits(['back'])

</script>
