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
          <LabelRow label="dla języka" v-if="props.locale" class="q-ml-md">
            <LocaleSelector v-model="settings.focusedLocale" />
          </LabelRow>
        </div>
      </div>

      <slot></slot>
    </div>
  </q-tab-panel>
</template>

<script setup lan="ts">
import { useSettingsStore } from 'stores/settings-store'
import LocaleSelector from './LocaleSelector.vue'
import LabelRow from './LabelRow.vue'

const settings = useSettingsStore()
const props = defineProps({
  title: String,
  locale: Boolean,
  onBack: Function,
})
const isBackDefined = !!props.onBack
const emit = defineEmits(['back'])

</script>
