<template>
  <q-select v-model="selected" :options="options" option-label="symbol" :option-value="optionValue" popup-content-style="white-space: nowrap" dense
    :data-tag="tags.translationSelector">

    <template v-slot:selected>
      <div class="row items-center q-gutter-sm">
        <span>{{ selected?.symbol || '' }}</span>
        <!-- <span class="gt-sm">{{ selected.title }}</span> -->
      </div>
    </template>

    <template v-slot:option="scope">
      <q-separator v-if="scope.opt?.isFirstInGroup" />

      <q-item v-bind="scope.itemProps" :data-tag="tags.translationSelectorItem">
        <q-item-section>
          <q-item-label>
            <div class="row items-center q-gutter-md">
              <FlagIcon :region="locale2region(scope.opt?.locale)" v-if="props.flag && scope.opt?.locale" />
              <span class="symbol">{{ scope.opt?.symbol || '' }}</span>
              <span class="col">{{ scope.opt?.title || '' }}</span>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TranslationItem, TranslationKey } from 'src/types'
import FlagIcon from './FlagIcon.vue'
import { locale2region } from 'src/util'
import * as tags from 'src/tags'

// Accept both full TranslationItem or just TranslationKey for flexibility
type ModelValue = TranslationItem | TranslationKey | null

const props = defineProps<{
  modelValue?: ModelValue
  flag?: boolean
  translations?: TranslationItem[]
  allowEmpty?: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value: ModelValue]
}>()

// Create a unique key for each option to avoid deep comparison issues
function optionValue(opt: TranslationItem | null): string {
  if (!opt || !opt.locale || !opt.symbol) return ''
  return `${opt.locale}:${opt.symbol}`
}

// Strip reactive properties and create plain objects for QSelect options
const options = computed(() => {
  const items: TranslationItem[] = []

  // Add empty option if allowed
  if (props.allowEmpty) {
    items.push({ locale: '', symbol: '', title: '', size: 0 } as TranslationItem)
  }

  if (Array.isArray(props.translations)) {
    // Map to plain objects to avoid reactive ref comparison issues
    for (const t of props.translations) {
      if (t) {
        items.push({
          locale: t.locale,
          symbol: t.symbol,
          title: t.title,
          size: t.size,
          year: t.year,
          bookNames: t.bookNames,
          bookOrder: t.bookOrder,
          isFirstInGroup: t.isFirstInGroup
        } as TranslationItem)
      }
    }
  }

  return items
})

const selected = computed({
  get(): ModelValue {
    // Try to find the full translation item if only a key was provided
    if (props.modelValue && options.value.length > 0) {
      const found = options.value.find(
        t => t.locale === props.modelValue?.locale && t.symbol === props.modelValue?.symbol
      )
      if (found) return found
    }
    return props.modelValue || null
  },
  set(value: ModelValue) {
    emit('update:modelValue', value)
  }
})

</script>

<style lang="scss" scoped>
.header {
  background-color: var(--q-background-05)
}

.symbol {
  width: 1.7em;
}
</style>
