// eslint-disable-next-line vue/multi-word-component-names
<template>
  <q-select v-model="selected" :options="translations" option-label="symbol" emit-value
    popup-content-style="white-space: nowrap" dense>

    <template v-slot:selected>
      <div class="row items-center q-gutter-sm">
        <FlagIcon :lang="selected.lang" v-if="!props.lang" />
        <span>{{ selected.symbol }}</span>
        <span>{{ selected.title }}</span>
      </div>
    </template>

    <template v-slot:option="scope">
      <!-- <div v-if="scope.opt.isFirstInGroup" class="row justify-center header">
        {{ scope.opt.lang }}
      </div> -->
      <q-separator v-if="scope.opt.isFirstInGroup" />

      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>
            <div class="row items-center q-gutter-md">
              <FlagIcon :lang="scope.opt.lang" v-if="!props.lang" />
              <span>{{ scope.opt.symbol }}</span>
              <span>{{ scope.opt.title }}</span>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

  </q-select>
</template>

<script setup lang="ts">
import { useTranslationStore } from 'src/stores/translation-store'
import { computed } from 'vue'
import { Translation } from 'src/types'
import FlagIcon from './FlagIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps(['modelValue', 'lang'])
const emit = defineEmits(['update:modelValue'])
const store = useTranslationStore()

const translations = computed(() => props.lang ? store.getTranslations(props.lang) : store.selectedTranslationsGrouped)

const selected = computed({
  get(): Translation {
    if (props.modelValue && translations.value.length > 0) {
      const { lang, symbol } = props.modelValue
      return translations.value.find(t => t.lang === lang && t.symbol === symbol) || translations.value[0]
    }
    return translations.value[0] || {} as Translation
  },
  set(value: Translation) {
    const { lang, symbol } = value
    emit('update:modelValue', { lang, symbol })
  }
})

</script>

<style lang="scss" scoped>
.header {
  background-color: var(--q-background-05)
}
</style>
