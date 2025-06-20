<template>
  <q-select v-model="selected" :options="safeTranslations" option-label="symbol" emit-value popup-content-style="white-space: nowrap" dense
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
import { Translation } from 'src/types'
import FlagIcon from './FlagIcon.vue'
import { locale2region } from 'src/util'
import * as tags from 'src/tags'

const props = defineProps(['modelValue', 'flag', 'translations'])
const emit = defineEmits(['update:modelValue'])

const safeTranslations = computed(() => {
  return Array.isArray(props.translations) ? props.translations.filter(Boolean) : []
})

const selected = computed({
  get(): Translation | null {
    return props.modelValue || null
  },
  set(value: Translation) {
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
