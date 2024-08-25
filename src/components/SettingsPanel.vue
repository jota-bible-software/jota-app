<template>
  <q-tab-panel class="q-pl-lg q-pt-none">
    <div class="q-gutter-md">
      <div class="row ">
        <div class="row q-gutter-md items-center">
          <!-- Back button -->
          <q-btn v-if="isBackDefined" flat icon="icon-mat-arrow_back_ios" class="q-p-none" @click="emit('back')"
            size="md" dense />

          <!-- Title -->
          <div class="text-h6 ">{{ props.title }}</div>
          <!-- For language selector -->
          <LabelRow label="dla języka" v-if="props.lang" class="q-ml-md">
            <LanguageSelector v-model="store.lang" />
          </LabelRow>
        </div>
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
